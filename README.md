# Oyster Mushroom (*Pleurotus ostreatus*) Nutrition Guide

A clean, modern, responsive static website highlighting the nutritional profile, scientific health benefits, and culinary preparation techniques for Oyster Mushrooms.

## 🚀 Instant Deployment to Netlify

This repository is pre-configured with `netlify.toml` for zero-configuration Netlify hosting.

### Method 1: Netlify Drop (Instant Drag-and-Drop)
1. Navigate to **[app.netlify.com/drop](https://app.netlify.com/drop)** in your web browser.
2. Drag and drop the `Project_fssai` folder into the upload zone.
3. Your site will immediately be live on a public `https://<site-name>.netlify.app` URL with free automatic SSL.

### Method 2: Git-Integrated Continuous Deployment (Recommended)
1. Push this repository to GitHub, GitLab, or Bitbucket:
   ```bash
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. Log into **[Netlify](https://app.netlify.com)** and click **"Add new site"** &rarr; **"Import an existing project"**.
3. Select your repository.
4. Netlify will auto-detect settings from `netlify.toml`:
   - **Publish directory:** `.`
   - **Build command:** *(leave empty)*
5. Click **"Deploy Site"**. Any future `git push` will automatically trigger an instant production deploy.

### Method 3: Netlify CLI
In your terminal:
```bash
npx netlify deploy --prod
```
Follow the interactive prompts to authorize and deploy directly from your command line.

---

## 📁 Project Structure

- `index.html` — Semantic HTML5 single-page application.
- `style.css` — Custom CSS variables, typography, and hover physics.
- `app.js` — Dynamic serving calculation, nutrition table filtering, and interactive tabs.
- `404.html` — Custom styled 404 page for missing routes.
- `netlify.toml` — Netlify build settings, caching headers, security headers, and redirects.
