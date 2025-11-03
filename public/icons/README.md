# MiniApp Icons

Place your MiniApp assets here:

## Required Images

1. **icon-1024.png** (1024×1024 pixels)
   - Main app icon
   - Square format, PNG
   - Should represent your app clearly

2. **splash-200.png** (200×200 pixels)
   - Loading/splash screen image
   - Square format, PNG
   - Shown while app loads

3. **hero-1200x630.png** (1200×630 pixels)
   - Hero/banner image
   - Landscape format, PNG
   - Used in app discovery

## Creating Assets

You can use:
- [MiniApp Asset Generator](https://www.miniappassets.com/) - Automated tool
- Design tools like Figma, Canva, Photoshop
- AI image generators

## Important Notes

- All images must be publicly accessible via HTTPS
- URLs in manifest must be full HTTPS URLs (not relative paths)
- Images must exist before the manifest will validate
- Use PNG format for best quality

## After Adding Images

1. Commit images to repository
2. Deploy to Vercel
3. Verify images are accessible:
   - https://sub-accounts-fc-demo.vercel.app/icons/icon-1024.png
   - https://sub-accounts-fc-demo.vercel.app/icons/splash-200.png
   - https://sub-accounts-fc-demo.vercel.app/icons/hero-1200x630.png

