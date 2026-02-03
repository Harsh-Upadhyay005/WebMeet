# Production Deployment Checklist

## 🚨 Before Deploying to Production

### 1. Environment Variables
- [ ] Update `.env` with `NODE_ENV=production`
- [ ] Generate new JWT secret (use: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`)
- [ ] Use production MongoDB database (separate from development)
- [ ] Update `CLIENT_URL` to your production frontend URL
- [ ] **NEVER** commit `.env` files to GitHub

### 2. Security
- [ ] Add `.env` to `.gitignore` (verify it's there)
- [ ] Remove all sensitive console.logs
- [ ] Enable HTTPS only in production
- [ ] Add rate limiting middleware (express-rate-limit)
- [ ] Add helmet.js for security headers
- [ ] Validate all user inputs
- [ ] Sanitize database queries to prevent injection

### 3. Database
- [ ] Set up database backups
- [ ] Create indexes for frequently queried fields
- [ ] Enable MongoDB Atlas IP whitelist (if using Atlas)
- [ ] Use connection pooling

### 4. Error Handling
- [ ] Implement global error handler
- [ ] Don't expose stack traces in production
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Add proper logging (Winston, Morgan)

### 5. Performance
- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Implement caching where appropriate
- [ ] Optimize database queries
- [ ] Add request timeouts

### 6. Frontend
- [ ] Update `VITE_API_BASE_URL` to production backend URL
- [ ] Build for production (`npm run build`)
- [ ] Enable source maps only for debugging
- [ ] Lazy load components
- [ ] Optimize images and assets

### 7. Testing
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test chat functionality
- [ ] Test on multiple browsers
- [ ] Load testing

### 8. Deployment
- [ ] Set up CI/CD pipeline
- [ ] Configure domain and SSL certificate
- [ ] Set up monitoring and alerts
- [ ] Document deployment process
- [ ] Create rollback plan

### 9. Post-Deployment
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Test critical user flows
- [ ] Set up uptime monitoring

## Current Issues Found:

### ❌ Critical
- Sensitive data exposed in console logs (partially fixed)
- Missing rate limiting
- Missing security headers (helmet.js)
- No global error handler

### ⚠️ Important
- No request validation middleware
- Missing compression
- No logging strategy
- Missing indexes on database

### 💡 Recommended
- Add API documentation
- Implement caching
- Set up monitoring/alerting
- Add health check endpoints (partially done)

## Environment Variables to Set on Hosting Platform:

```bash
NODE_ENV=production
PORT=3000
MONGO_URI=<your-production-mongodb-uri>
STREAM_API_KEY=<your-stream-api-key>
STREAM_API_SECRET=<your-stream-api-secret>
JWT_SECRET_KEY=<your-jwt-secret>
CLIENT_URL=<your-frontend-url>
```

## Recommended Additional Packages:

```bash
npm install helmet express-rate-limit compression morgan winston
```
