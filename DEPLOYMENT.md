# Deployment Guide

## Prerequisites
- GitHub account
- Render account (https://render.com)
- Vercel account (https://vercel.com)
- MongoDB Atlas account (if not already set up)

---

## 🚀 Backend Deployment (Render)

### 1. Prepare Your Repository
1. Make sure your code is pushed to GitHub
2. Ensure `.env` is in `.gitignore` (already configured)

### 2. Create Render Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the **WebMeet** repository

### 3. Configure Render Settings
- **Name**: `webmeet-backend` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `Backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: Free (or paid if needed)

### 4. Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"** and add:

```
PORT=3000
NODE_ENV=production
MONGO_URI=mongodb+srv://uharsh328_db_user:QsTkVwDzGspX2YXA@clustersteamify.awfnhh0.mongodb.net/streamify_db?appName=ClusterSteamify
STREAM_API_KEY=5txvyh6sr38c
STREAM_API_SECRET=namx9b8rspbtqadzr7nvztbt7fmkv8ye79bfqd4su9jqxbce3vyyjyzj6j69m34a
JWT_SECRET_KEY=BvoKJAW3RVtfKO7PZ+kx0i+UTYZg+nDOE3S0dWsnwRQ=
CLIENT_URL=https://your-app.vercel.app
```

**Note**: Update `CLIENT_URL` with your Vercel URL after frontend deployment

### 5. Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Copy your Render URL (e.g., `https://webmeet-backend.onrender.com`)

### 6. Test Backend
Visit: `https://your-backend-url.onrender.com/health`

You should see: `{"status":"OK","message":"Server is running"}`

---

## 🌐 Frontend Deployment (Vercel)

### 1. Update Frontend Environment Variables
1. Go to `Frontend/vite-project/.env`
2. Update with your Render backend URL:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
VITE_STREAM_API_KEY=5txvyh6sr38c
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend folder
cd Frontend/vite-project

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `Frontend/vite-project`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3. Add Environment Variables in Vercel
1. Go to **Settings** → **Environment Variables**
2. Add:
   - `VITE_API_BASE_URL`: Your Render backend URL
   - `VITE_STREAM_API_KEY`: Your Stream API key

### 4. Deploy
1. Click **"Deploy"**
2. Wait for deployment (3-5 minutes)
3. Copy your Vercel URL (e.g., `https://webmeet.vercel.app`)

### 5. Update Backend CORS
1. Go back to Render dashboard
2. Go to your backend service → **Environment**
3. Update `CLIENT_URL` to your Vercel URL
4. Also update `server.js` line 23:
   ```javascript
   'https://your-actual-app.vercel.app'
   ```
5. Redeploy backend (automatic if you push to GitHub)

---

## ✅ Post-Deployment Checklist

### Backend (Render)
- [ ] Backend is accessible at health endpoint
- [ ] MongoDB connection is working
- [ ] Environment variables are set correctly
- [ ] CORS allows your Vercel domain

### Frontend (Vercel)
- [ ] Frontend loads correctly
- [ ] Login/Signup works
- [ ] Can send/accept friend requests
- [ ] Chat functionality works
- [ ] Video call functionality works

---

## 🔧 Troubleshooting

### Backend Issues
1. **MongoDB Connection Error**
   - Check MongoDB Atlas network access (allow all IPs: 0.0.0.0/0)
   - Verify MONGO_URI in Render environment variables

2. **CORS Error**
   - Ensure `CLIENT_URL` in Render matches your Vercel domain
   - Check that Vercel domain is in `allowedOrigins` array

3. **Build Fails**
   - Check Render logs for errors
   - Ensure all dependencies are in `package.json`

### Frontend Issues
1. **API Calls Fail**
   - Verify `VITE_API_BASE_URL` points to correct Render URL
   - Check browser console for CORS errors
   - Ensure backend is running

2. **Environment Variables Not Working**
   - Environment variables in Vite must start with `VITE_`
   - Redeploy after adding/changing environment variables

3. **Build Fails**
   - Check Vercel deployment logs
   - Run `npm run build` locally to test
   - Ensure all imports use correct file extensions

---

## 📝 Important Notes

### Free Tier Limitations
- **Render Free Tier**: Spins down after 15 minutes of inactivity (cold start ~30s)
- **Vercel Free Tier**: 100GB bandwidth/month, serverless functions timeout at 10s

### Database
- Make sure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Or add Render's IP addresses to allowlist

### Custom Domain (Optional)
- **Vercel**: Settings → Domains → Add Domain
- **Render**: Settings → Custom Domain → Add Domain

---

## 🔄 Continuous Deployment

### Automatic Deployments
Both Render and Vercel support automatic deployments:
- Push to `main` branch → Automatic deployment
- Pull requests → Preview deployments (Vercel)

### Manual Deployment
- **Render**: Dashboard → Manual Deploy → Deploy latest commit
- **Vercel**: `vercel --prod` or Dashboard → Deployments → Redeploy

---

## 📞 Support

If you encounter issues:
1. Check deployment logs (Render/Vercel dashboard)
2. Verify environment variables
3. Test backend health endpoint
4. Check browser console for errors

Good luck with your deployment! 🚀
