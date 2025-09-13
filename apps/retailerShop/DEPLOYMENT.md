# Frontend Deployment Guide

## Vercel Deployment

### Prerequisites
- Vercel account
- GitHub repository connected to Vercel

### Environment Variables
Set the following environment variables in your Vercel project settings:

```bash
NEXT_PUBLIC_UI_BASE_URI=https://your-api-domain.com
```

### Deployment Steps

1. **Connect Repository to Vercel**
   - Go to Vercel dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Select the `fix/frontend-prod` branch

2. **Configure Build Settings**
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/retailerShop`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

3. **Environment Variables**
   - Add `NEXT_PUBLIC_UI_BASE_URI` with your production API URL

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Troubleshooting

If you encounter build errors:

1. **Check Node.js Version**: Vercel uses Node.js 18 by default
2. **Clear Build Cache**: In Vercel dashboard, go to your project → Settings → Advanced → Clear Build Cache
3. **Check Logs**: View build logs in Vercel dashboard for detailed error messages

### Build Configuration

The project includes:
- `vercel.json` - Vercel-specific configuration
- `next.config.mjs` - Next.js configuration optimized for Vercel
- `.env.example` - Environment variables template

### Post-Deployment

After successful deployment:
1. Update your API to allow requests from the Vercel domain
2. Test all functionality in the production environment
3. Monitor for any runtime errors

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm start
```
