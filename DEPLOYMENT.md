# Deployment Guide

This guide will help you deploy your anonymous forum application to production.

## Recommended Hosting Options

### Option 1: Vercel (Recommended for Next.js)
✅ **Best choice** - Zero-config deployment, automatic HTTPS, global CDN, serverless functions
- Free tier available
- Automatic deployments from Git
- Built-in environment variable management

### Option 2: Railway / Render
✅ Good alternatives - Support for Node.js, MongoDB, and environment variables
- Free tiers available
- Easy MongoDB integration

### Option 3: Self-hosted (VPS)
✅ More control - DigitalOcean, AWS EC2, etc.
- Requires more setup
- Full control over the environment

---

## Prerequisites

Before deploying, ensure you have:

1. **MongoDB Database**
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Recommended - Free tier available)
   - Or self-hosted MongoDB instance

2. **Coinbase Developer Platform Account** (Optional - for faucet)
   - [Sign up here](https://portal.cdp.coinbase.com/create-account)
   - Get API keys for faucet functionality

3. **Git Repository**
   - Push your code to GitHub, GitLab, or Bitbucket

---

## Step-by-Step Deployment Guide

### Part 1: Set Up MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Create a free account

2. **Create a Cluster**
   - Choose the FREE tier (M0)
   - Select a cloud provider and region closest to you
   - Wait for cluster creation (~3-5 minutes)

3. **Configure Database Access**
   - Go to "Database Access" → "Add New Database User"
   - Create username and password (save these!)
   - Set user privileges to "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access" → "Add IP Address"
   - For production: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add specific IPs for better security

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name (e.g., `forum-db`)
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/forum-db?retryWrites=true&w=majority`

---

### Part 2: Deploy to Vercel

1. **Prepare Your Repository**
   ```bash
   # Make sure your code is committed
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with your Git provider (GitHub/GitLab/Bitbucket)
   - Click "Add New Project"
   - Import your repository

3. **Configure Build Settings**
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `pnpm build` (or `npm run build`)
   - Output Directory: `.next` (default)
   - Install Command: `pnpm install` (or `npm install`)

4. **Add Environment Variables**
   In Vercel project settings → Environment Variables, add:

   **Required:**
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/forum-db?retryWrites=true&w=majority
   ```

   **Optional (for faucet functionality):**
   ```bash
   CDP_API_KEY_ID=your-api-key-id
   CDP_API_KEY_SECRET=your-api-key-secret
   CDP_WALLET_SECRET=your-wallet-secret
   NEXT_PUBLIC_PAYMASTER_SERVICE_URL=https://api.developer.coinbase.com/rpc/v1/base-sepolia/...
   NEXT_NEYNAR_API_KEY=your-neynar-api-key
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-5 minutes)
   - Your app will be live at `https://your-project.vercel.app`

---

### Part 3: Alternative - Deploy to Railway

1. **Connect Railway to GitHub**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Add MongoDB Service**
   - In Railway dashboard, click "+ New"
   - Add "MongoDB" service (or use external MongoDB Atlas)

3. **Configure Environment Variables**
   - Go to your service → Variables
   - Add all required environment variables (same as Vercel)

4. **Deploy**
   - Railway auto-deploys on push to main branch
   - Get your public URL from the service settings

---

### Part 4: Verify Deployment

1. **Test the Application**
   - Visit your deployed URL
   - Try creating a post
   - Test wallet connection
   - Test tipping functionality

2. **Check Logs**
   - Vercel: Go to project → Logs
   - Railway: View logs in dashboard
   - Look for MongoDB connection messages

3. **Common Issues**

   **MongoDB Connection Error:**
   - Verify connection string is correct
   - Check Network Access in MongoDB Atlas
   - Ensure password is URL-encoded if special characters

   **Build Errors:**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are in `package.json`
   - Check build logs for specific errors

---

## Environment Variables Reference

### Required
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

### Optional (for Faucet)
```bash
CDP_API_KEY_ID=your-api-key-id
CDP_API_KEY_SECRET=your-api-key-secret
CDP_WALLET_SECRET=your-wallet-secret
```

### Optional (for Gas Sponsorship)
```bash
NEXT_PUBLIC_PAYMASTER_SERVICE_URL=https://api.developer.coinbase.com/rpc/v1/base-sepolia/your-url
```

### Optional (for Farcaster Posts - not used in current version)
```bash
NEXT_NEYNAR_API_KEY=your-neynar-api-key
```

---

## Post-Deployment Checklist

- [ ] MongoDB connection working
- [ ] Can create posts
- [ ] Can view posts feed
- [ ] Wallet connection works
- [ ] Tipping functionality works
- [ ] Tip counts update correctly
- [ ] Environment variables set correctly
- [ ] Custom domain configured (optional)

---

## Custom Domain (Optional)

### Vercel:
1. Go to project → Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

### Railway:
1. Go to service → Settings → Networking
2. Add custom domain
3. Configure DNS records

---

## Monitoring & Maintenance

### Vercel Analytics (Optional)
- Enable in project settings
- Monitor traffic and performance

### MongoDB Monitoring
- Monitor database usage in MongoDB Atlas dashboard
- Set up alerts for high usage

### Error Tracking (Recommended)
Consider adding:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay

---

## Troubleshooting

### "MongoDB connection failed"
- Check connection string format
- Verify network access in MongoDB Atlas
- Ensure environment variable is set correctly

### "Build failed"
- Check Node.js version (requires 18+)
- Review build logs for specific errors
- Ensure all dependencies are in package.json

### "Tip count not updating"
- Check server logs for API errors
- Verify MongoDB connection
- Check browser console for client errors

---

## Security Considerations

1. **Environment Variables**
   - Never commit `.env.local` to Git
   - Use platform's environment variable management
   - Rotate secrets regularly

2. **MongoDB Security**
   - Use strong database passwords
   - Restrict network access if possible
   - Enable MongoDB Atlas authentication

3. **API Security** (Future Enhancements)
   - Add rate limiting
   - Implement request validation
   - Consider adding authentication for admin functions

---

## Cost Estimation

### Free Tier (Small Project)
- **Vercel**: Free (hobby plan)
- **MongoDB Atlas**: Free (M0 cluster - 512MB)
- **Total**: $0/month

### Production (Medium Traffic)
- **Vercel Pro**: $20/month
- **MongoDB Atlas M10**: ~$57/month
- **Total**: ~$77/month

---

## Support

If you encounter issues:
1. Check the logs in your hosting platform
2. Verify all environment variables are set
3. Test MongoDB connection separately
4. Review this guide for missed steps

For MongoDB issues: [MongoDB Support](https://www.mongodb.com/docs/atlas/)
For Vercel issues: [Vercel Documentation](https://vercel.com/docs)

