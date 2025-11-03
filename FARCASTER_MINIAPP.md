# Launching as a Farcaster MiniApp

This guide will help you deploy your anonymous forum as a Farcaster MiniApp that can be accessed within Warpcast and other Farcaster clients.

## What is a Farcaster MiniApp?

MiniApps are web applications that can be embedded and accessed directly within Farcaster clients like Warpcast. They provide a seamless, native-like experience without users needing to leave the Farcaster app.

## Prerequisites

1. **Deployed Web Application**
   - Your app must be hosted on HTTPS (required for MiniApps)
   - Accessible at a public URL (e.g., `https://your-app.vercel.app`)

2. **Farcaster Account**
   - You need a Farcaster account to sign the manifest
   - Sign up at [warpcast.com](https://warpcast.com)

3. **Base Account** (for signing)
   - Used for signing the manifest to prove ownership
   - [Base Account](https://account.base.org)

---

## Step 1: Prepare Your App

### 1.1 Mobile Optimization

Ensure your app works well on mobile devices:

```typescript
// Add viewport meta tag in layout.tsx
// This should already be in Next.js by default, but verify
```

### 1.2 Deploy to Production

Deploy your app following the [DEPLOYMENT.md](./DEPLOYMENT.md) guide. Make sure:
- ✅ App is accessible via HTTPS
- ✅ All environment variables are set
- ✅ MongoDB is connected
- ✅ App is fully functional

---

## Step 2: Create MiniApp Manifest

### 2.1 Create Manifest File

Create a `public/.well-known/farcaster.json` file with your app details:

```json
{
  "name": "Anonymous Forum",
  "description": "A decentralized anonymous forum where users can post and receive USDC tips",
  "iconUrl": "https://your-domain.com/icon.png",
  "homeUrl": "https://your-domain.com",
  "splashImageUrl": "https://your-domain.com/splash.png",
  "splashBackgroundColor": "#000000",
  "heroImageUrl": "https://your-domain.com/hero.png",
  "tagline": "Post anonymously, tip freely"
}
```

### 2.2 Generate Assets

Use the [MiniApp Asset Generator](https://www.miniappassets.com/) to create:
- **Icon**: 1024×1024 pixels (PNG)
- **Splash Image**: 200×200 pixels (PNG)
- **Hero Image**: 1200×630 pixels (PNG)

Place these in your `public/` folder.

---

## Step 3: Sign Your Manifest

### 3.1 Sign with Base Build Preview

1. Go to [Base Build Preview Tool](https://docs.base.org/mini-apps/features/sign-manifest)
2. Sign in with your Base account
3. Enter your MiniApp URL: `https://your-domain.com`
4. Click "Sign Message" and sign with your wallet
5. Copy the generated `accountAssociation` object

### 3.2 Update Manifest

Add the `accountAssociation` to your `farcaster.json`:

```json
{
  "name": "Anonymous Forum",
  "description": "...",
  "iconUrl": "...",
  "homeUrl": "https://your-domain.com",
  "splashImageUrl": "...",
  "splashBackgroundColor": "#000000",
  "heroImageUrl": "...",
  "tagline": "Post anonymously, tip freely",
  "accountAssociation": {
    "type": "custody",
    "account": {
      "network": "base",
      "address": "0x..."
    },
    "signature": "0x..."
  }
}
```

---

## Step 4: Host the Manifest

### 4.1 Create Directory Structure

```bash
mkdir -p public/.well-known
```

### 4.2 Place Manifest File

Place your `farcaster.json` in `public/.well-known/farcaster.json`

Next.js will automatically serve it at: `https://your-domain.com/.well-known/farcaster.json`

### 4.3 Verify Accessibility

After deployment, verify the manifest is accessible:
```bash
curl https://your-domain.com/.well-known/farcaster.json
```

---

## Step 5: Submit to Farcaster

### 5.1 Submit via Warpcast

1. Open Warpcast
2. Go to Settings → MiniApps
3. Submit your app URL
4. Wait for approval (typically instant or a few days)

### 5.2 Alternative: Direct Discovery

Users can also discover your MiniApp by:
- Opening a link to your app in Warpcast
- The app will prompt to open as MiniApp
- Users can bookmark it for quick access

---

## Step 6: Test Your MiniApp

### 6.1 Test in Warpcast

1. Open Warpcast on mobile
2. Share your app URL: `https://your-domain.com`
3. Click the link in Warpcast
4. It should open as a MiniApp

### 6.2 Test Features

Verify these work in MiniApp context:
- ✅ Wallet connection (Base Account)
- ✅ Creating posts
- ✅ Viewing feed
- ✅ Tipping posts
- ✅ Mobile responsive design

---

## Integration Features for MiniApps

### Frame Integration (Optional)

You can enhance your MiniApp with Farcaster Frames for better engagement:

```typescript
// Example: Create a frame that links to your app
// This would be a separate frame app that redirects to your MiniApp
```

### User Context (Future Enhancement)

Access Farcaster user information when launched from Farcaster:

```typescript
// Check if running in Farcaster context
const isFarcaster = window.location.search.includes('farcaster=true');

// Access user context if available
if (isFarcaster) {
  // User is coming from Farcaster
  // You can customize experience
}
```

---

## Troubleshooting

### Manifest Not Found
- ✅ Verify file is at `public/.well-known/farcaster.json`
- ✅ Ensure file is committed and deployed
- ✅ Check file permissions
- ✅ Verify URL: `https://your-domain.com/.well-known/farcaster.json`

### Signature Invalid
- ✅ Re-sign using Base Build Preview Tool
- ✅ Ensure you're signing with the correct account
- ✅ Verify accountAssociation is correctly formatted

### App Not Opening in MiniApp Context
- ✅ Ensure HTTPS is enabled
- ✅ Check that manifest is accessible
- ✅ Verify app URL format is correct
- ✅ Try opening from within Warpcast

---

## Best Practices

### 1. Mobile-First Design
- Design for mobile screens (320px - 768px width)
- Touch-friendly buttons (min 44×44px)
- Fast loading times

### 2. Deep Linking
- Support deep links to specific posts
- Handle URL parameters for navigation
- Preserve app state on navigation

### 3. User Experience
- Fast initial load
- Smooth animations
- Clear error messages
- Loading states

### 4. Security
- Always use HTTPS
- Validate all inputs
- Secure API endpoints
- Proper error handling

---

## Example Manifest Template

```json
{
  "name": "Anonymous Forum",
  "description": "A decentralized anonymous forum where anyone can post and receive USDC tips on Base",
  "iconUrl": "https://your-domain.com/icons/icon-1024.png",
  "homeUrl": "https://your-domain.com",
  "splashImageUrl": "https://your-domain.com/icons/splash-200.png",
  "splashBackgroundColor": "#000000",
  "heroImageUrl": "https://your-domain.com/icons/hero-1200x630.png",
  "tagline": "Post anonymously, tip freely",
  "accountAssociation": {
    "type": "custody",
    "account": {
      "network": "base",
      "address": "0xYourBaseAccountAddress"
    },
    "signature": "0xYourSignatureHere"
  }
}
```

---

## Resources

- [Base MiniApps Documentation](https://docs.base.org/mini-apps)
- [MiniApp Asset Generator](https://www.miniappassets.com/)
- [Base Build Preview Tool](https://docs.base.org/mini-apps/features/sign-manifest)
- [Farcaster Documentation](https://docs.farcaster.xyz)
- [Warpcast Help Center](https://help.warpcast.com)

---

## Next Steps

1. ✅ Deploy your app to production
2. ✅ Create and host the manifest
3. ✅ Sign the manifest
4. ✅ Test in Warpcast
5. ✅ Share with your Farcaster community!

Good luck launching your MiniApp! 🚀

