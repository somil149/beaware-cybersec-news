# Deployment Guide - BeAware Cybersec

This guide will help you deploy the BeAware Cybersec application to Vercel and configure the custom subdomain.

## Prerequisites

- A Cloudflare account with the domain `cybersectoday.org`
- A Vercel account
- A PostgreSQL database (Supabase recommended)
- GitHub repository with the code

## Step 1: Database Setup

### Option 1: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Go to Settings > Database and copy the connection string
4. Replace the placeholders in the connection string:
   - `YOUR_PASSWORD` with your database password
   - `PROJECT_REF` with your project reference

### Option 2: Other PostgreSQL
- Set up any PostgreSQL database
- Get the connection string in format: `postgresql://user:password@host:port/database?schema=public`

## Step 2: Environment Variables

### Required Environment Variables

Add these to your `.env.local` for local development and to Vercel for production:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="https://beaware.cybersectoday.org"  # Your production URL
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# News API
NEWS_API_KEY="your-newsapi-key"

# Email Service (for newsletters)
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@beaware.cybersectoday.org"

# Application
NODE_ENV="production"
APP_URL="https://beaware.cybersectoday.org"

# Cron Job Security
CRON_SECRET="generate-with-openssl-rand-base64-32"
```

### Generating Secrets

Generate secure random strings for secrets:
```bash
openssl rand -base64 32
```

## Step 3: Vercel Deployment

### 3.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 3.2 Login to Vercel
```bash
vercel login
```

### 3.3 Deploy to Vercel
```bash
vercel
```

Follow the prompts:
- Set up and deploy? `Y`
- Which scope? Select your account
- Link to existing project? `N` (for new project)
- Project name: `beaware-cybersec`
- Directory: `./`
- Override settings? `N`

### 3.4 Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Go to Settings > Environment Variables
3. Add all the environment variables from Step 2
4. Make sure to select all environments (Development, Preview, Production)

### 3.5 Redeploy
After adding environment variables, redeploy:
```bash
vercel --prod
```

## Step 4: Custom Domain Configuration

### 4.1 Add Domain in Vercel

1. Go to your Vercel project dashboard
2. Go to Settings > Domains
3. Add domain: `beaware.cybersectoday.org`
4. Vercel will provide DNS configuration details

### 4.2 Configure Cloudflare DNS

1. Log in to your Cloudflare account
2. Select the domain `cybersectoday.org`
3. Go to DNS > Records
4. Add a new CNAME record:
   - **Type**: CNAME
   - **Name**: `beaware`
   - **Target**: `cname.vercel-dns.com`
   - **Proxy status**: Proxied (orange cloud)
   - **TTL**: Auto

5. Wait for DNS propagation (usually takes 5-15 minutes)

### 4.3 Verify Domain

1. Go back to Vercel Domains settings
2. Wait for the domain to show as "Valid Configuration"
3. The SSL certificate will be automatically provisioned

## Step 5: Database Migration

### 5.1 Generate Prisma Client
```bash
npx prisma generate
```

### 5.2 Push Database Schema
```bash
npx prisma db push
```

### 5.3 Seed Initial Data
```bash
npm run db:seed
```

## Step 6: GitHub Actions Configuration

### 6.1 Add GitHub Secrets

Go to your GitHub repository > Settings > Secrets and variables > Actions

Add the following secrets:
- `DATABASE_URL` - Your PostgreSQL connection string
- `NEXTAUTH_URL` - Your production URL
- `NEXTAUTH_SECRET` - Your NextAuth secret
- `NEWS_API_KEY` - Your NewsAPI key
- `CRON_SECRET` - Your cron secret
- `VERCEL_TOKEN` - Your Vercel authentication token
- `ORG_ID` - Your Vercel organization ID
- `PROJECT_ID` - Your Vercel project ID

### 6.2 Get Vercel Credentials

Get your Vercel token and IDs:
```bash
vercel login
vercel link
cat .vercel/project.json
```

The output will contain your `orgId` and `projectId`.

Generate a Vercel token:
1. Go to Vercel > Settings > Tokens
2. Create a new token
3. Copy the token

## Step 7: Initial News Fetch

### Option 1: Manual Trigger via GitHub Actions
1. Go to your repository > Actions
2. Select "Fetch Latest News" workflow
3. Click "Run workflow" > "Run workflow"

### Option 2: Manual API Call
```bash
curl -X POST https://beaware.cybersectoday.org/api/cron/fetch-news \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Option 3: Run Locally
```bash
npm run fetch-news
```

## Step 8: Verify Deployment

1. Visit `https://beaware.cybersectoday.org`
2. Check that the homepage loads correctly
3. Test navigation between pages
4. Test search functionality
5. Test newsletter signup
6. Test user registration/login

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check if database IP is whitelisted (for Supabase)
- Ensure SSL is enabled in connection string

### Build Failures
- Check that all environment variables are set in Vercel
- Verify Node.js version compatibility
- Check build logs for specific errors

### DNS Issues
- Use a DNS checker like `dig` to verify propagation
- Ensure CNAME record is correctly configured
- Check Cloudflare proxy status (try disabling temporarily)

### Authentication Issues
- Verify `NEXTAUTH_URL` matches your domain exactly
- Check `NEXTAUTH_SECRET` is set correctly
- Ensure OAuth providers are properly configured

## Maintenance

### Regular Tasks
- Monitor GitHub Actions for failed news fetches
- Check database storage limits
- Review and update dependencies regularly
- Monitor API rate limits (NewsAPI)

### Scaling Considerations
- Consider implementing caching for frequently accessed data
- Add CDN for static assets
- Implement database indexing for performance
- Consider read replicas for high traffic

## Security Best Practices

1. **Rotate secrets regularly** - Update `NEXTAUTH_SECRET` and `CRON_SECRET` periodically
2. **Monitor logs** - Set up logging and monitoring for suspicious activities
3. **Keep dependencies updated** - Run `npm audit` regularly
4. **Use HTTPS** - Ensure SSL certificates are always valid
5. **Rate limiting** - Implement rate limiting on API endpoints
6. **Input validation** - All user inputs should be validated and sanitized

## Support

For issues related to:
- **Vercel**: Check [Vercel Documentation](https://vercel.com/docs)
- **Cloudflare**: Check [Cloudflare Documentation](https://developers.cloudflare.com)
- **Supabase**: Check [Supabase Documentation](https://supabase.com/docs)
- **Next.js**: Check [Next.js Documentation](https://nextjs.org/docs)