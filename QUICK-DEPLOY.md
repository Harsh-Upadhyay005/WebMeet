# Quick Deployment Checklist

## Before You Deploy

### 1. Check Your Code
- [ ] All code pushed to GitHub
- [ ] `.env` files are gitignored
- [ ] No console.logs with sensitive data
- [ ] Backend has `npm start` script
- [ ] Frontend has `npm run build` script

---

## Backend Deployment (Render) - 10 mins

### Quick Steps:
1. **Go to**: https://dashboard.render.com/
2. **Click**: New + → Web Service
3. **Connect**: Your GitHub repo
4. **Settings**:
   ```
   Root Directory: Backend
   Build: npm install
   Start: npm start
   ```
5. **Add these Environment Variables**:
   ```
   PORT=3000
   NODE_ENV=production
   MONGO_URI=mongodb+srv://uharsh328_db_user:QsTkVwDzGspX2YXA@clustersteamify.awfnhh0.mongodb.net/streamify_db?appName=ClusterSteamify
   STREAM_API_KEY=5txvyh6sr38c
   STREAM_API_SECRET=namx9b8rspbtqadzr7nvztbt7fmkv8ye79bfqd4su9jqxbce3vyyjyzj6j69m34a
   JWT_SECRET_KEY=BvoKJAW3RVtfKO7PZ+kx0i+UTYZg+nDOE3S0dWsnwRQ=
   CLIENT_URL=https://your-app.vercel.app
   ```
6. **Deploy** and copy your URL (e.g., `https://webmeet-xxx.onrender.com`)

---

## Frontend Deployment (Vercel) - 5 mins

### Quick Steps:
1. **Update** `Frontend/vite-project/.env`:
   ```
   VITE_API_BASE_URL=https://your-render-url.onrender.com
   VITE_STREAM_API_KEY=5txvyh6sr38c
   ```

2. **Go to**: https://vercel.com/dashboard
3. **Click**: Add New → Project
4. **Import**: Your GitHub repo
5. **Settings**:
   ```
   Root Directory: Frontend/vite-project
   Framework: Vite
   Build: npm run build
   Output: dist
   ```
6. **Environment Variables** (in Vercel):
   ```
   VITE_API_BASE_URL=https://your-render-url.onrender.com
   VITE_STREAM_API_KEY=5txvyh6sr38c
   ```
7. **Deploy** and copy your URL

---

## Final Step

### Update Backend with Frontend URL
1. Go back to **Render**
2. Update `CLIENT_URL` environment variable
3. Update `server.js` line 23 with your Vercel URL
4. **Commit and push** to trigger redeploy

---

## Test Your Deployment

### Backend Test:
Visit: `https://your-backend.onrender.com/health`
Should show: `{"status":"OK","message":"Server is running"}`

### Frontend Test:
1. Visit your Vercel URL
2. Try signup/login
3. Test friend requests
4. Test chat
5. Test video call

---

## Common Issues & Fixes

### ❌ CORS Error
→ Make sure `CLIENT_URL` in Render matches your Vercel URL exactly

### ❌ MongoDB Connection Failed
→ MongoDB Atlas → Network Access → Add IP: `0.0.0.0/0`

### ❌ Frontend Can't Connect to Backend
→ Check `VITE_API_BASE_URL` in Vercel environment variables

### ❌ Backend Slow to Start (Render Free)
→ First request takes ~30s (cold start) - this is normal for free tier

---

## URLs to Remember

- **Render Dashboard**: https://webmeet-to9x.onrender.com
- **Vercel Dashboard**: https://web-meet-liart.vercel.app
- **MongoDB Atlas**: https://cloud.mongodb.com/
- **Stream Dashboard**: https://getstream.io/dashboard/

---

## Need Help?

1. Check DEPLOYMENT.md for detailed guide
2. Check deployment logs in Render/Vercel dashboard
3. Test backend `/health` endpoint
4. Check browser console for errors

Good luck! 🚀
