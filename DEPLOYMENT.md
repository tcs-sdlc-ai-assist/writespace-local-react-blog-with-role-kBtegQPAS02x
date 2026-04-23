# Deployment Guide

## Overview

WritSpace is a static single-page application (SPA) built with Vite and React. It requires no backend services or environment variables, making deployment straightforward.

## Deploying to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com](https://vercel.com) and sign in.
3. Click **"Add New Project"** and import your repository.
4. Vercel will auto-detect the Vite framework. Confirm the following settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **"Deploy"**.

### Option 2: Deploy via Vercel CLI

1. Install the Vercel CLI globally:

   ```bash
   npm install -g vercel
   ```

2. Navigate to the project root directory:

   ```bash
   cd writespace
   ```

3. Run the deploy command:

   ```bash
   vercel
   ```

4. Follow the prompts. When asked:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. For production deployment:

   ```bash
   vercel --prod
   ```

## SPA Rewrite Configuration

Since WritSpace is a single-page application using client-side routing, all routes must be rewritten to `index.html` so that direct URL access and page refreshes work correctly.

A `vercel.json` file is included in the project root with the following configuration:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures that any URL path (e.g., `/editor`, `/about`) is served by `index.html`, allowing React Router to handle routing on the client side.

## Environment Variables

**No environment variables are required.** WritSpace is a fully client-side application with no external API dependencies. There is nothing to configure in the Vercel dashboard under Environment Variables.

If you extend the application in the future and need environment variables, add them in the Vercel dashboard under **Project Settings → Environment Variables** and prefix them with `VITE_` so they are accessible via `import.meta.env.VITE_YOUR_VARIABLE` in the application code.

## Build Details

| Setting          | Value            |
| ---------------- | ---------------- |
| Build Command    | `npm run build`  |
| Output Directory | `dist`           |
| Node Version     | 18.x or later    |
| Package Manager  | npm              |

To verify the build locally before deploying:

```bash
npm run build
```

This generates the production-ready static files in the `dist` directory. You can preview the build locally:

```bash
npm run preview
```

## Troubleshooting

### Direct URL Access Returns 404

**Problem:** Navigating directly to a route like `/editor` or refreshing the page on a non-root route returns a 404 error.

**Solution:** Ensure the `vercel.json` file exists in the project root with the SPA rewrite rule shown above. Redeploy after adding or modifying this file.

### Build Fails on Vercel

**Problem:** The deployment fails during the build step.

**Solution:**
1. Run `npm run build` locally to check for errors.
2. Ensure all dependencies are listed in `package.json` (not just installed globally).
3. Check that the Node.js version on Vercel is compatible (18.x or later). You can set this in `package.json`:

   ```json
   {
     "engines": {
       "node": ">=18"
     }
   }
   ```

### Blank Page After Deployment

**Problem:** The deployment succeeds but the page is blank.

**Solution:**
1. Open the browser developer console and check for errors.
2. Verify that the `base` option in `vite.config.js` is not set to a subdirectory path (it should be `'/'` or omitted for root deployment).
3. Confirm the output directory is set to `dist` in Vercel project settings.

### Assets Not Loading (404 on JS/CSS Files)

**Problem:** The HTML loads but JavaScript or CSS files return 404.

**Solution:**
1. Ensure the output directory in Vercel is set to `dist` (not `build` or `public`).
2. Check that `vite.config.js` does not have a custom `base` path that conflicts with the deployment URL.

### Cached Old Version

**Problem:** Changes are not reflected after redeployment.

**Solution:**
1. In the Vercel dashboard, go to **Deployments** and verify the latest deployment is active.
2. Clear your browser cache or open the site in an incognito window.
3. Vercel automatically handles cache invalidation for hashed assets, but the `index.html` file may be cached by your browser.