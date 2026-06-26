#!/usr/bin/env bash
set -Eeuo pipefail

BRANCH="${BRANCH:-main}"
IMAGE_NAME="${IMAGE_NAME:-prostockcharts:latest}"
CONTAINER_NAME="${CONTAINER_NAME:-prostockcharts}"
HOST_PORT="${HOST_PORT:-3000}"
CONTAINER_PORT="${CONTAINER_PORT:-3000}"
ENV_FILE="${ENV_FILE:-}"
PULL_LATEST="${PULL_LATEST:-1}"
NO_CACHE="${NO_CACHE:-0}"
HEALTHCHECK_URL="${HEALTHCHECK_URL:-http://127.0.0.1:${HOST_PORT}/}"

log() {
  printf '[deploy] %s\n' "$*"
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    printf 'Missing required command: %s\n' "$1" >&2
    exit 1
  fi
}

require_command docker
require_command git

if [ -n "$ENV_FILE" ] && [ ! -f "$ENV_FILE" ]; then
  printf 'ENV_FILE does not exist: %s\n' "$ENV_FILE" >&2
  exit 1
fi

env_file_value() {
  local key="$1"

  if [ -z "$ENV_FILE" ]; then
    return 0
  fi

  awk -F= -v key="$key" '
    $0 !~ /^[[:space:]]*#/ && $1 == key {
      value = substr($0, length(key) + 2)
      gsub(/^["'\'']|["'\'']$/, "", value)
      print value
      exit
    }
  ' "$ENV_FILE"
}

public_env_value() {
  local key="$1"
  local value="${!key:-}"

  if [ -n "$value" ]; then
    printf '%s' "$value"
    return 0
  fi

  env_file_value "$key"
}

if [ "$PULL_LATEST" != "0" ]; then
  if [ -n "$(git status --porcelain)" ]; then
    printf 'Working tree is not clean. Commit, stash, or set PULL_LATEST=0.\n' >&2
    exit 1
  fi

  log "Pulling latest ${BRANCH}"
  git fetch origin "$BRANCH"
  git switch "$BRANCH"
  git pull --ff-only origin "$BRANCH"
else
  log "Skipping git pull because PULL_LATEST=0"
fi

build_args=(build -t "$IMAGE_NAME")
if [ "$NO_CACHE" = "1" ]; then
  build_args+=(--no-cache)
fi
for public_key in NEXT_PUBLIC_GA_MEASUREMENT_ID NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION; do
  public_value="$(public_env_value "$public_key")"
  if [ -n "$public_value" ]; then
    build_args+=(--build-arg "${public_key}=${public_value}")
  fi
done
build_args+=(.)

log "Building Docker image ${IMAGE_NAME}"
docker "${build_args[@]}"

if docker ps -a --format '{{.Names}}' | grep -Fxq "$CONTAINER_NAME"; then
  log "Removing existing container ${CONTAINER_NAME}"
  docker rm -f "$CONTAINER_NAME"
fi

run_args=(
  run
  -d
  --restart unless-stopped
  --name "$CONTAINER_NAME"
  -p "${HOST_PORT}:${CONTAINER_PORT}"
  -e "PORT=${CONTAINER_PORT}"
  -e "HOSTNAME=0.0.0.0"
)

if [ -n "$ENV_FILE" ]; then
  run_args+=(--env-file "$ENV_FILE")
fi

run_args+=("$IMAGE_NAME")

log "Starting container ${CONTAINER_NAME}"
docker "${run_args[@]}"

if command -v curl >/dev/null 2>&1; then
  log "Checking ${HEALTHCHECK_URL}"
  for attempt in $(seq 1 20); do
    if curl -fsS "$HEALTHCHECK_URL" >/dev/null; then
      log "Deploy complete"
      docker ps --filter "name=${CONTAINER_NAME}"
      exit 0
    fi
    sleep 1
  done

  printf 'Container started, but health check did not pass: %s\n' "$HEALTHCHECK_URL" >&2
  docker logs --tail 80 "$CONTAINER_NAME" >&2 || true
  exit 1
fi

log "Deploy complete; curl not found, so health check was skipped"
docker ps --filter "name=${CONTAINER_NAME}"
