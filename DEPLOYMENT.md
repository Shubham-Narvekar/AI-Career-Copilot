# 🚀 Deployment Guide for Career Planner

## Current Issue
Your frontend is deployed to Vercel, but your backend is still running locally. This means:
- ✅ Frontend is accessible online
- ❌ Backend only works when your device is running
- ❌ Users can't use the app when your computer is off

## Solution: Deploy Backend to Vercel

### Step 1: Prepare Your Environment Variables

1. **Create a `.env` file in your root directory:**
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

2. **Add environment variables to Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add MONGODB_URI
vercel env add JWT_SECRET
```

### Step 2: Update Your Backend for Vercel

1. **Ensure your backend app.ts has proper exports:**
```typescript
// backend/src/app.ts
import express from 'express';
import cors from 'cors';
// ... other imports

const app = express();

// ... your middleware and routes

// For Vercel deployment
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(5000, () => {
    console.log('Server running on port 5000');
  });
}
```

### Step 3: Deploy to Vercel

1. **Deploy your entire project:**
```bash
vercel --prod
```

2. **Vercel will automatically:**
   - Build your frontend (React app)
   - Deploy your backend (Node.js/Express)
   - Set up API routes
   - Handle environment variables

### Step 4: Update Frontend API URL

Replace `your-app.vercel.app` in `src/services/api.ts` with your actual Vercel domain.

## Alternative Solutions

### Option 2: Deploy Backend to Railway/Render
- Deploy backend separately to Railway or Render
- Update frontend API URL to point to the deployed backend
- More control over backend environment

### Option 3: Use MongoDB Atlas
- Ensure your MongoDB is hosted on Atlas (cloud)
- Your local backend can connect to cloud database
- Still need to keep your device running

## Benefits of Full Vercel Deployment

✅ **Always Online**: Your app works 24/7
✅ **No Local Server**: No need to keep your computer running
✅ **Automatic Scaling**: Vercel handles traffic spikes
✅ **Easy Updates**: Deploy with one command
✅ **Free Tier**: Generous free hosting

## Troubleshooting

### Common Issues:
1. **Environment Variables**: Make sure they're set in Vercel dashboard
2. **MongoDB Connection**: Ensure your MongoDB Atlas allows connections from anywhere
3. **CORS Issues**: Your backend should allow requests from your Vercel domain
4. **Build Errors**: Check Vercel build logs for TypeScript errors

### Commands:
```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Redeploy
vercel --prod

# Remove deployment
vercel remove
```

## Next Steps

1. **Deploy to Vercel** using the steps above
2. **Test your app** thoroughly
3. **Monitor performance** in Vercel dashboard
4. **Set up custom domain** if needed

Your app will then be fully functional without needing your device to run! 🎉 