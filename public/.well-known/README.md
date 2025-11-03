# Farcaster MiniApp Manifest

This directory contains the `farcaster.json` manifest file required for Farcaster MiniApp integration.

## Setup Instructions

1. **Update the manifest:**
   - Edit `farcaster.json`
   - Replace `https://your-domain.vercel.app` with your actual domain
   - Update image URLs to point to your hosted assets

2. **Create required images:**
   - `icon-1024.png` (1024×1024) - App icon
   - `splash-200.png` (200×200) - Splash screen
   - `hero-1200x630.png` (1200×630) - Hero image
   - Place these in `public/icons/` directory

3. **Sign the manifest:**
   - Use [Base Build Preview Tool](https://docs.base.org/mini-apps/features/sign-manifest)
   - Add the `accountAssociation` object to `farcaster.json`

4. **Deploy:**
   - The manifest will be accessible at: `https://your-domain.com/.well-known/farcaster.json`

See [FARCASTER_MINIAPP.md](../FARCASTER_MINIAPP.md) for complete instructions.

