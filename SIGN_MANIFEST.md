# How to Sign Your Farcaster MiniApp Manifest

## Step-by-Step Instructions

### Step 1: Sign the Manifest

1. **Go to Base Build Preview Tool**
   - Visit: https://docs.base.org/mini-apps/features/sign-manifest
   - Or go directly to the signer if available

2. **Enter Your App URL**
   - Enter: `https://sub-accounts-fc-demo.vercel.app`
   - Make sure this matches exactly your deployed URL

3. **Sign In with Base Account**
   - Connect your Base account wallet
   - This should be the wallet you want associated with the MiniApp

4. **Sign the Message**
   - Click "Sign Message" button
   - Approve the signature request in your wallet

5. **Copy the accountAssociation**
   - After signing, you'll see an `accountAssociation` object
   - It will look like this:
   ```json
   {
     "type": "custody",
     "account": {
       "network": "base",
       "address": "0xYourAddress..."
     },
     "signature": "0xYourSignature..."
   }
   ```

### Step 2: Add to Your Manifest

1. **Edit `public/.well-known/farcaster.json`**
   - Add the `accountAssociation` object to your manifest
   - Place it inside the `miniapp` object

2. **Updated Manifest Structure**
   ```json
   {
     "miniapp": {
       "version": "1",
       "name": "Anonymous Forum",
       "description": "...",
       "iconUrl": "/icons/icon-1024.png",
       "homeUrl": "https://sub-accounts-fc-demo.vercel.app",
       "splashImageUrl": "/icons/splash-200.png",
       "splashBackgroundColor": "#191a43",
       "heroImageUrl": "/icons/hero-1200x630.png",
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
   }
   ```

### Step 3: Verify

1. **Check Manifest URL**
   - Visit: `https://sub-accounts-fc-demo.vercel.app/.well-known/farcaster.json`
   - Verify the `accountAssociation` is present

2. **Test in Warpcast**
   - Open Warpcast
   - Try opening your app URL
   - The error should be resolved

## Common Issues

### "accountAssociation doesn't match"
- ✅ Ensure you signed with the same wallet address
- ✅ Verify the URL matches exactly (including https://)
- ✅ Make sure accountAssociation is inside the `miniapp` object
- ✅ Check that signature is valid and not expired

### "Invalid signature"
- ✅ Re-sign the manifest if needed
- ✅ Ensure you're using the correct Base account
- ✅ Verify the signature format is correct (starts with 0x)

### Manifest not updating
- ✅ Commit and push changes to Git
- ✅ Wait for Vercel deployment to complete
- ✅ Clear cache: `https://sub-accounts-fc-demo.vercel.app/.well-known/farcaster.json?t=123456`

## Alternative: Using Farcaster CLI (Advanced)

If you prefer command line:

```bash
# Install Farcaster CLI (if available)
npm install -g @farcaster/cli

# Sign manifest
farcaster sign-manifest --url https://sub-accounts-fc-demo.vercel.app
```

## Need Help?

- Base Documentation: https://docs.base.org/mini-apps
- Farcaster Discord: https://discord.gg/farcaster
- Base Discord: https://discord.gg/buildonbase

