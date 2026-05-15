# GitHub Setup Guide for BeAware Cybersec

This guide will walk you through setting up the GitHub repository and configuring it for deployment to Vercel.

## Step 1: Create GitHub Repository

1. **Go to GitHub** and sign in to your account
2. **Create a new repository**:
   - Click the "+" icon in the top-right corner
   - Select "New repository"
   - Repository name: `beaware-cybersec`
   - Description: `AI Security & Industry News Platform`
   - Make it **Private** (recommended for this project)
   - **Do not** initialize with README, .gitignore, or license
3. **Click "Create repository"**

## Step 2: Push Local Repository to GitHub

Once your repository is created, GitHub will show you instructions. Follow these steps:

```bash
cd beaware-cybersec

# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/beaware-cybersec.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/johndoe/beaware-cybersec.git
git branch -M main
git push -u origin main
```

## Step 3: Configure GitHub Secrets

Go to your GitHub repository and add the following secrets:

### Navigate to Secrets:
1. Go to your repository on GitHub
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### Required Secrets:

Add each of these secrets with their corresponding values:

#### Database & Application
- **Name:** `DATABASE_URL`
- **Value:** Your PostgreSQL connection string (e.g., from Supabase)
- **Example:** `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`

#### Authentication
- **Name:** `NEXTAUTH_URL`
- **Value:** Your production URL
- **Example:** `https://beaware.cybersectoday.org`

- **Name:** `NEXTAUTH_SECRET`
- **Value:** Generate a secure random string
- **Generate with:** `openssl rand -base64 32`

#### OAuth Providers (Optional)
- **Name:** `GOOGLE_CLIENT_ID`
- **Value:** Your Google OAuth Client ID

- **Name:** `GOOGLE_CLIENT_SECRET`
- **Value:** Your Google OAuth Client Secret

- **Name:** `GITHUB_CLIENT_ID`
- **Value:** Your GitHub OAuth Client ID

- **Name:** `GITHUB_CLIENT_SECRET`
- **Value:** Your GitHub OAuth Client Secret

#### News API
- **Name:** `NEWS_API_KEY`
- **Value:** Your NewsAPI key
- **Get it from:** https://newsapi.org/register

#### Cron Job Security
- **Name:** `CRON_SECRET`
- **Value:** Generate a secure random string
- **Generate with:** `openssl rand -base64 32`

#### Vercel Deployment
- **Name:** `VERCEL_TOKEN`
- **Value:** Your Vercel authentication token
- **Get it from:** Vercel Account Settings → Tokens

- **Name:** `ORG_ID`
- **Value:** Your Vercel organization ID
- **Get it from:** After running `vercel link`, check `.vercel/project.json`

- **Name:** `PROJECT_ID`
- **Value:** Your Vercel project ID
- **Get it from:** After running `vercel link`, check `.vercel/project.json`

## Step 4: Enable GitHub Actions

Your repository already includes GitHub Actions workflows in `.github/workflows/`:

1. **Fetch Latest News** - Runs daily at midnight UTC to fetch news
2. **Deploy to Vercel** - Automatically deploys when you push to main branch
3. **Test** - Runs tests on pull requests

The workflows are already configured and will run automatically once you push to GitHub.

## Step 5: Verify GitHub Actions

After pushing to GitHub:

1. Go to your repository
2. Click on the **Actions** tab
3. You should see the workflows listed
4. You can manually trigger the "Fetch Latest News" workflow by:
   - Clicking on "Fetch Latest News"
   - Clicking "Run workflow" → "Run workflow"

## Step 6: Set up Vercel Deployment

### Option A: Deploy via GitHub Integration (Recommended)

1. **Go to [Vercel](https://vercel.com)** and sign in
2. **Click "Add New Project"**
3. **Import Git Repository**
4. **Select your beaware-cybersec repository**
5. **Configure project:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Environment Variables:** Add all the secrets from Step 3
6. **Click "Deploy"**

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

Follow the prompts to deploy your application.

## Step 7: Configure Custom Domain

### In Vercel:

1. **Go to your project settings**
2. **Click on "Domains"**
3. **Add domain:** `beaware.cybersectoday.org`
4. **Vercel will provide DNS configuration**

### In Cloudflare:

1. **Log in to Cloudflare**
2. **Select your domain:** `cybersectoday.org`
3. **Go to DNS → Records**
4. **Add CNAME record:**
   - **Type:** CNAME
   - **Name:** `beaware`
   - **Target:** `cname.vercel-dns.com`
   - **Proxy status:** Proxied (orange cloud)
   - **TTL:** Auto

5. **Wait for DNS propagation** (usually 5-15 minutes)
6. **Verify in Vercel** that the domain shows as "Valid Configuration"

## Step 8: Initial Database Setup

Once deployed, you'll need to set up your database:

```bash
# If using Supabase, get your connection string from:
# Supabase Dashboard → Settings → Database → Connection String

# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push

# Seed initial data
npm run db:seed
```

You can run these commands:
- **Locally** before pushing
- **In Vercel** using their terminal or by adding a build script
- **Via SSH** into your Vercel deployment

## Step 9: Initial News Fetch

Trigger the first news fetch manually:

1. **Go to GitHub Actions** in your repository
2. **Click "Fetch Latest News" workflow**
3. **Click "Run workflow"**
4. **Click "Run workflow"** button

This will populate your database with the latest news articles.

## Step 10: Verify Deployment

1. **Visit your custom domain:** `https://beaware.cybersectoday.org`
2. **Check that:**
   - Homepage loads with articles
   - Navigation works between pages
   - Search functionality works
   - Newsletter signup works
   - User registration/login works

## Troubleshooting

### GitHub Actions Failures

If workflows fail:
1. **Check the logs** in the Actions tab
2. **Verify all secrets** are correctly configured
3. **Check that the Node.js version** matches (v20)
4. **Ensure the database URL** is accessible

### Vercel Deployment Issues

If deployment fails:
1. **Check build logs** in Vercel
2. **Verify environment variables** are set
3. **Check that the build command** works locally
4. **Ensure the framework preset** is correctly set to Next.js

### DNS Issues

If the custom domain doesn't work:
1. **Use a DNS checker** like `dig beaware.cybersectoday.org`
2. **Verify the CNAME record** in Cloudflare
3. **Check that the proxy status** is set correctly
4. **Wait for DNS propagation** (can take up to 24 hours)

### Database Connection Issues

If the app can't connect to the database:
1. **Verify the DATABASE_URL** is correct
2. **Check that IP whitelisting** is enabled (for Supabase)
3. **Ensure SSL is enabled** in the connection string
4. **Test the connection** locally using the same URL

## Next Steps

Once everything is set up:

1. **Monitor GitHub Actions** to ensure news fetching works daily
2. **Check Vercel Analytics** for performance metrics
3. **Set up error monitoring** (optional, e.g., Sentry)
4. **Configure email service** for newsletters (Resend recommended)
5. **Customize the UI** with your branding
6. **Add more news sources** as needed

## Support

For issues:
- **GitHub Actions:** Check GitHub Actions documentation
- **Vercel:** Check Vercel documentation
- **Cloudflare:** Check Cloudflare documentation
- **Database:** Check your database provider's documentation

## Quick Reference Commands

```bash
# Push changes to GitHub
git add .
git commit -m "Your commit message"
git push origin main

# View GitHub Actions workflow runs
# Go to: https://github.com/YOUR_USERNAME/beaware-cybersec/actions

# Trigger manual news fetch
# Go to: Actions → Fetch Latest News → Run workflow

# Deploy to Vercel manually
vercel --prod
```

Your repository is now ready for automated deployment! 🚀