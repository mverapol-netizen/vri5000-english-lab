# Deployment

The app is already configured as a GitHub Pages PWA.

## One-time GitHub setting
1. Open the repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. Return to **Actions** and rerun **Deploy PWA to GitHub Pages**, or make any new commit.

After Pages is enabled, future pushes to `main` deploy automatically.

## Android installation
Once the Pages site is live:
1. Open it in Chrome on Android.
2. Open the browser menu.
3. Choose **Install app** or **Add to Home screen**.
4. Accept the installation prompt.

The app is offline-first after its first successful load. Progress is stored locally in the browser and can be exported/imported from Settings.
