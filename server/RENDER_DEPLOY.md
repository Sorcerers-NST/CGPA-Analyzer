# Render Deployment Guide

## Build Configuration on Render

### Build Command
```
npm install
```
The `postinstall` script in package.json will automatically run `prisma generate` after dependencies are installed.

### Start Command
```
npm start
```

### Environment Variables to Add on Render

**Required:**
- `DATABASE_URL` - Your PostgreSQL connection string from Render
- `JWT_SECRET` - A random secret key (generate with: `openssl rand -base64 32`)
- `NODE_ENV` - Set to `production`
- `CLIENT_URL` - Set to `https://cgpa-analyzer.vercel.app`

**Optional (for Google OAuth):**
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL` - `https://cgpa-analyzer.onrender.com/api/auth/google/callback`

**Optional (for Email):**
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASSWORD`
- `EMAIL_FROM`

## Database Setup

After deployment, run these commands once using Render Shell:
```bash
npx prisma migrate deploy
npx prisma db seed
```

Or use the Render dashboard to run a one-time job with these commands.
