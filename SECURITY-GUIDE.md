# Security Improvements for Production

## 🔒 Install Additional Security Packages

```bash
cd Backend
npm install helmet express-rate-limit compression express-mongo-sanitize xss-clean
```

## 📝 Update server.js with Security Middleware

Add these imports at the top:
```javascript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
```

Add these middleware (after dotenv.config() and before CORS):
```javascript
// Security headers
app.use(helmet());

// Compression
app.use(compression());

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

app.use('/api', limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // 5 requests per 15 minutes
    message: 'Too many login attempts, please try again later.',
    skipSuccessfulRequests: true
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);
```

## 🔐 Generate New Production Secrets

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Generate another one for refresh tokens if needed
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🗄️ Database Security

1. **Separate Production Database**: Use a different MongoDB database for production
2. **Enable IP Whitelist**: In MongoDB Atlas, whitelist only your production server IP
3. **Create Indexes**:
```javascript
// In your models or setup file
User.createIndexes({ email: 1 }, { unique: true });
User.createIndexes({ fullName: 1 });
```

## 🌐 Environment-Specific Configuration

### Backend .env (Production)
```env
NODE_ENV=production
PORT=3000
MONGO_URI=<production-mongodb-uri>
STREAM_API_KEY=<your-key>
STREAM_API_SECRET=<your-secret>
JWT_SECRET_KEY=<strong-random-secret>
CLIENT_URL=https://your-app.vercel.app
```

### Frontend .env (Production)
```env
VITE_API_BASE_URL=https://your-backend.onrender.com
VITE_STREAM_API_KEY=<your-stream-api-key>
```

## 📊 Monitoring & Logging

1. **Set up Error Monitoring**: Sentry, Rollbar, or LogRocket
2. **Add Logging**: Winston or Pino for structured logs
3. **Uptime Monitoring**: UptimeRobot, Pingdom
4. **Performance Monitoring**: New Relic, DataDog

## ✅ Pre-Deployment Checklist

- [ ] All `.env` files in `.gitignore`
- [ ] Production environment variables set on hosting platform
- [ ] Separate production database created
- [ ] New JWT secret generated
- [ ] Security middleware installed and configured
- [ ] Rate limiting enabled
- [ ] Error handler configured
- [ ] CORS properly configured with production URLs
- [ ] HTTPS enforced (handled by hosting platform)
- [ ] Database indexes created
- [ ] Test all endpoints in production
- [ ] Monitor logs after deployment

## 🚀 Deployment Platforms

### Backend (Choose one):
- **Render**: Easiest, free tier available
- **Railway**: Good free tier, automatic SSL
- **Heroku**: Reliable, paid tiers
- **AWS/DigitalOcean**: More control, requires setup

### Frontend:
- **Vercel**: Already configured, perfect for React/Vite
- Automatic deployments from GitHub

## 📖 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Security Checklist](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)
