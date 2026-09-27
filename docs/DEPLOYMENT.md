# Deployment Guide

This document covers deployment configurations for ProStockCharts, including domain redirects and security headers.

## www → apex Domain Redirect + HSTS

ProStockCharts implements a permanent redirect from `www.prostockcharts.com` to `prostockcharts.com` (apex domain), along with HSTS (HTTP Strict Transport Security) headers for security.

### Application-Level (Next.js Middleware)

The redirect and HSTS headers are handled by Next.js middleware (`middleware.ts`), which ensures they travel with the application regardless of deployment environment:

- **www → apex**: HTTP 308 permanent redirect that preserves request method
- **HSTS**: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - 2-year max-age
  - Applies to all subdomains
  - Preload-ready (only enable if SSL certificate covers www)

### Reverse Proxy Configuration (Optional)

If you're running behind a reverse proxy (nginx, Caddy, etc.), you can also implement the redirect at the proxy level for slightly better performance. The middleware will still work as a fallback.

#### Nginx Configuration

```nginx
# Redirect www to apex
server {
    listen 80;
    listen 443 ssl http2;
    server_name www.prostockcharts.com;
    
    # SSL certificate paths (if using HTTPS)
    # ssl_certificate /path/to/fullchain.pem;
    # ssl_certificate_key /path/to/privkey.pem;
    
    return 308 https://prostockcharts.com$request_uri;
}

# Main site
server {
    listen 80;
    listen 443 ssl http2;
    server_name prostockcharts.com;
    
    # SSL certificate paths
    # ssl_certificate /path/to/fullchain.pem;
    # ssl_certificate_key /path/to/privkey.pem;
    
    # HSTS header (only on HTTPS)
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    
    # Redirect HTTP to HTTPS
    if ($scheme != "https") {
        return 301 https://$host$request_uri;
    }
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Caddy Configuration

Caddy handles HTTPS and redirects automatically with minimal configuration:

```caddy
# Redirect www to apex
www.prostockcharts.com {
    redir https://prostockcharts.com{uri} permanent
}

# Main site
prostockcharts.com {
    reverse_proxy localhost:3000
    
    # HSTS header
    header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
}
```

## Google Analytics 4 Setup

GA4 is optional and only loads when configured.

### 1. Create GA4 Property

**IMPORTANT**: ProStockCharts must have its own separate GA4 property. Do NOT reuse measurement IDs from other sites (Flashlight, SDF, Mandarin, etc.).

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property for `prostockcharts.com`
3. Copy the Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Set Environment Variable

#### Local Development

Create a `.env.local` file (not committed to git):

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### Docker Deployment

Pass as a build argument:

```bash
docker build \
  --build-arg NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX \
  -t prostockcharts .
```

Or use the deploy script with an env file:

```bash
# Create .env.production (not committed)
echo "NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX" > .env.production

# Deploy with env file
ENV_FILE=.env.production ./scripts/deploy-docker.sh
```

#### Production Environment

Set the environment variable on your production server before deployment:

```bash
export NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Verify Installation

Once the environment variable is set:

1. Build and start the application
2. Open the site in a browser
3. Open DevTools → Network tab
4. Filter for `gtag` or `google-analytics`
5. You should see requests to `www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`
6. Check the Console for `window.gtag` - it should be a function

### Tracked Events

The following events are automatically tracked once GA4 is enabled:

**Product Events:**
- `stock_page_view` — Stock detail page viewed
- `chart_range_change` — User changed chart range (1D, 5D, 1M, etc.)
- `chart_type_change` — User switched between line/candlestick modes
- `chart_data_download` — User downloaded chart data as CSV
- `chart_layout_save` — User saved a local chart layout
- `chart_layout_clear` — User cleared a local chart layout
- `premium_interest_toggle` — User toggled a premium interest item
- `search_submit` — User submitted a search
- `search_result_click` — User clicked a search result

**Performance Events (Web Vitals):**
- `FCP` — First Contentful Paint
- `LCP` — Largest Contentful Paint
- `CLS` — Cumulative Layout Shift
- `FID` — First Input Delay
- `INP` — Interaction to Next Paint
- `TTFB` — Time to First Byte

All events are implemented in `/lib/analytics.ts` and called from relevant components. No changes are needed to the event tracking code.

## Health Checks

The deploy script (`scripts/deploy-docker.sh`) automatically health-checks the homepage after deployment:

```bash
curl -f http://127.0.0.1:3000/ || exit 1
```

## SSL/TLS Certificate

Ensure your SSL certificate covers both:
- `prostockcharts.com` (apex)
- `www.prostockcharts.com` (www subdomain)

Let's Encrypt example:

```bash
certbot certonly --webroot -w /var/www/html \
  -d prostockcharts.com \
  -d www.prostockcharts.com
```

## Testing the Setup

### Test www Redirect

```bash
# Should return 308 redirect to prostockcharts.com
curl -I https://www.prostockcharts.com/

# Verify redirect is permanent and preserves path
curl -I https://www.prostockcharts.com/stock/AAPL
```

Expected response headers:
```
HTTP/2 308
location: https://prostockcharts.com/stock/AAPL
strict-transport-security: max-age=63072000; includeSubDomains; preload
```

### Test HSTS Header

```bash
# Should include HSTS header
curl -I https://prostockcharts.com/
```

Expected response headers:
```
HTTP/2 200
strict-transport-security: max-age=63072000; includeSubDomains; preload
```

### Test GA4 Loading

1. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in your environment
2. Build and run: `npm run build && npm start`
3. Visit `http://localhost:3000`
4. Open DevTools → Network tab
5. Filter for `gtag` - you should see the GA script loading
6. Open Console and type `window.gtag` - should be a function

### Test Analytics Events

1. With GA4 enabled, visit `http://localhost:3000`
2. Use the search box and select a result
3. Open DevTools → Network → Filter for `collect`
4. You should see analytics events being sent to Google Analytics:
   - `search_submit`
   - `search_result_click`
5. Visit a stock page and interact with the chart
6. You should see additional events:
   - `stock_page_view`
   - `chart_range_change`
   - `chart_type_change`

## Troubleshooting

### GA4 Not Loading

1. **Check environment variable**: `echo $NEXT_PUBLIC_GA_MEASUREMENT_ID`
2. **Rebuild required**: Next.js inlines `NEXT_PUBLIC_*` vars at build time
3. **Check browser console**: Look for errors related to `gtag` or Google Analytics
4. **Check Network tab**: Filter for `gtag` or `google` to see if scripts are loading

### HSTS Not Working

1. **HTTPS required**: HSTS only applies to HTTPS connections
2. **Check middleware**: Ensure `middleware.ts` exists and is not being excluded
3. **Check proxy headers**: If behind a proxy, ensure `X-Forwarded-Proto` is set

### www Redirect Not Working

1. **Check middleware**: Ensure `middleware.ts` exists at project root
2. **Check Host header**: The middleware uses the `Host` header to detect www
3. **DNS required**: Ensure www.prostockcharts.com DNS record exists
4. **SSL certificate**: Ensure certificate covers www subdomain

## Security Considerations

### HSTS Preload

The `preload` directive is included in the HSTS header, but the domain must be manually submitted to the [HSTS Preload List](https://hstspreload.org/) to be included in browsers' built-in lists.

**Before submitting for preload:**
1. Ensure HTTPS is working for apex and www
2. Ensure www → apex redirect is working
3. Test thoroughly - preload list inclusion is permanent and difficult to remove
4. Submit at https://hstspreload.org/

### Certificate Coverage

The SSL certificate MUST cover both `prostockcharts.com` and `www.prostockcharts.com` for the www redirect to work over HTTPS.

### max-age Duration

The current HSTS max-age is set to 2 years (63072000 seconds), which is the minimum required for HSTS preload list inclusion. Consider starting with a shorter duration (e.g., 1 week) for initial testing:

```typescript
// For testing (1 week):
"max-age=604800; includeSubDomains"

// For production (2 years):
"max-age=63072000; includeSubDomains; preload"
```
