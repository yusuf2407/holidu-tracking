# GitHub Pages Setup - Privacy Policy URL

## Problem
The URL `https://yusuf2407.github.io/holidu-tracking/privacy-policy.html` is returning 404 because GitHub Pages is not enabled.

## Solution: Enable GitHub Pages

### Method 1: GitHub Web Interface (Easiest)

1. **Go to your repository:**
   ```
   https://github.com/yusuf2407/holidu-tracking
   ```

2. **Click on "Settings"** (top right of repository page)

3. **Scroll down to "Pages"** in the left sidebar

4. **Under "Source":**
   - Select: **"Deploy from a branch"**
   - Branch: **`main`**
   - Folder: **`/` (root)**
   - Click **"Save"**

5. **Wait 1-2 minutes** for GitHub to build and deploy

6. **Your Privacy Policy URL will be:**
   ```
   https://yusuf2407.github.io/holidu-tracking/privacy-policy.html
   ```

### Method 2: Using GitHub CLI (If installed)

```bash
gh api repos/yusuf2407/holidu-tracking/pages \
  -X POST \
  -f source[branch]=main \
  -f source[path]=/
```

### Method 3: Check Current Status

Visit: `https://github.com/yusuf2407/holidu-tracking/settings/pages`

If Pages is already enabled, check:
- Is the branch set to `main`?
- Is the folder set to `/` (root)?
- Wait a few minutes for initial deployment

## Verification

After enabling GitHub Pages:

1. **Check deployment status:**
   - Go to repository → Settings → Pages
   - You should see "Your site is live at..."

2. **Wait 1-2 minutes** for first deployment

3. **Test the URL:**
   ```
   https://yusuf2407.github.io/holidu-tracking/privacy-policy.html
   ```

4. **If still 404:**
   - Check if `privacy-policy.html` is in the root directory
   - Verify the file is committed and pushed
   - Wait a few more minutes (first deployment can take time)

## Alternative: Use Raw GitHub URL (Temporary)

If GitHub Pages takes time, you can temporarily use:
```
https://raw.githubusercontent.com/yusuf2407/holidu-tracking/main/privacy-policy.html
```

**Note:** This shows raw HTML code, not a rendered page. For Chrome Web Store, you need a proper hosted page, so GitHub Pages is preferred.

## Troubleshooting

### Still Getting 404?

1. **Verify file exists:**
   ```bash
   git ls-files | grep privacy-policy.html
   ```

2. **Check file is pushed:**
   ```bash
   git log --oneline --all -- privacy-policy.html
   ```

3. **Force rebuild:**
   - Go to Settings → Pages
   - Change branch to something else, save
   - Change back to `main`, save
   - This triggers a rebuild

4. **Check repository visibility:**
   - Repository must be **Public** for free GitHub Pages
   - Or upgrade to GitHub Pro for private repo Pages

## Quick Checklist

- [ ] Repository is public (or you have GitHub Pro)
- [ ] `privacy-policy.html` is in root directory
- [ ] File is committed and pushed to `main` branch
- [ ] GitHub Pages enabled in Settings → Pages
- [ ] Source branch set to `main`
- [ ] Source folder set to `/` (root)
- [ ] Waited 1-2 minutes after enabling

---

**After enabling, your Privacy Policy URL for Chrome Web Store:**
```
https://yusuf2407.github.io/holidu-tracking/privacy-policy.html
```

