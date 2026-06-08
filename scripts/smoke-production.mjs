import { existsSync } from "node:fs";
import { cp, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { createServer } from "node:net";

const requiredRoutes = [
  { path: "/", text: "Free Professional Stock Charts" },
  { path: "/stock/AAPL", text: "AAPL" },
  { path: "/stock/BTC-USD", text: "BTC-USD" },
  { path: "/data-disclaimer", text: "Data Disclaimer" },
  { path: "/market-movers", text: "Stock Market Movers" },
];

async function getAvailablePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  return address.port;
}

async function waitForServer(baseUrl) {
  const deadline = Date.now() + 15000;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Production server did not become ready: ${lastError?.message || "timeout"}`);
}

async function prepareStandaloneRuntime() {
  if (!existsSync(".next/standalone")) {
    throw new Error("Missing .next/standalone. Run `npm run build` before smoke tests.");
  }

  if (!existsSync(".next/static")) {
    throw new Error("Missing .next/static. Run `npm run build` before smoke tests.");
  }

  const runtimeDir = await mkdtemp(join(tmpdir(), "prostockcharts-smoke-"));
  await cp(".next/standalone", runtimeDir, { recursive: true });
  await cp(".next/static", join(runtimeDir, ".next/static"), { recursive: true });

  if (existsSync("public")) {
    await cp("public", join(runtimeDir, "public"), { recursive: true });
  }

  return runtimeDir;
}

async function startProductionServer(runtimeDir) {
  const port = await getAvailablePort();
  const child = spawn(process.execPath, ["server.js"], {
    cwd: runtimeDir,
    env: {
      ...process.env,
      HOSTNAME: "127.0.0.1",
      NODE_ENV: "production",
      PORT: String(port),
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  child.once("exit", (code) => {
    if (code !== 0 && code !== null) {
      output += `\nserver exited with code ${code}`;
    }
  });

  const baseUrl = `http://127.0.0.1:${port}`;
  try {
    await waitForServer(baseUrl);
  } catch (error) {
    child.kill();
    throw new Error(`${error.message}\n${output}`);
  }

  return { baseUrl, child };
}

function getVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function fetchText(baseUrl, path) {
  const response = await fetch(new URL(path, baseUrl));
  const text = await response.text();
  return { response, text };
}

async function checkRoute(baseUrl, route) {
  const { response, text } = await fetchText(baseUrl, route.path);

  assert(response.ok, `${route.path} returned ${response.status}`);
  assert(
    response.headers.get("content-type")?.includes("text/html"),
    `${route.path} did not return HTML`
  );
  assert(text.includes(route.text), `${route.path} did not include expected text: ${route.text}`);

  return { response, text };
}

async function checkHomepage(baseUrl) {
  const { response, text: html } = await checkRoute(baseUrl, requiredRoutes[0]);
  const cssPaths = [...html.matchAll(/href="([^"]*\/_next\/static\/css\/[^"]+\.css)"/g)].map(
    (match) => match[1]
  );

  assert(cssPaths.length > 0, "Homepage did not include a Next CSS asset");
  assert(html.includes("critical-shell-styles"), "Homepage is missing critical shell styles");
  assert(
    response.headers.get("cache-control")?.includes("s-maxage=300"),
    "Homepage should revalidate every 300 seconds"
  );

  for (const cssPath of new Set(cssPaths)) {
    const cssResponse = await fetch(new URL(cssPath, baseUrl));
    const css = await cssResponse.text();

    assert(cssResponse.ok, `CSS asset ${cssPath} returned ${cssResponse.status}`);
    assert(
      cssResponse.headers.get("content-type")?.includes("text/css"),
      `CSS asset ${cssPath} did not return text/css`
    );
    assert(css.includes("--tw-"), `CSS asset ${cssPath} does not look like Tailwind output`);
    assert(
      css.includes("background-color:#09090b") || html.includes("background:#09090b"),
      "Dark shell background was not found in CSS or critical styles"
    );
  }

  const visibleText = getVisibleText(html);
  const rawScriptMarkers = [
    "self.__next_f",
    "window.__next_f",
    "application/ld+json",
    "\"@context\"",
    "dangerouslySetInnerHTML",
  ];

  for (const marker of rawScriptMarkers) {
    assert(!visibleText.includes(marker), `Homepage visible text includes raw script marker: ${marker}`);
  }
}

async function run() {
  const externalBaseUrl = process.env.SMOKE_BASE_URL;
  let runtimeDir;
  let child;
  let baseUrl = externalBaseUrl;

  try {
    if (!baseUrl) {
      runtimeDir = await prepareStandaloneRuntime();
      const started = await startProductionServer(runtimeDir);
      baseUrl = started.baseUrl;
      child = started.child;
    }

    for (const route of requiredRoutes.slice(1)) {
      await checkRoute(baseUrl, route);
    }

    await checkHomepage(baseUrl);

    console.log(`Production smoke checks passed against ${baseUrl}`);
  } finally {
    if (child) child.kill();
    if (runtimeDir) await rm(runtimeDir, { recursive: true, force: true });
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
