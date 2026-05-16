# BeAware - AI Security & Industry News Platform

<div align="center">

![BeAware Logo](https://img.shields.io/badge/BeAware-AI%20Security%20News-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![License](https://img.shields.io/badge/License-MIT-green)

*A comprehensive, automated news aggregation platform focusing on AI security, cybersecurity threats, AI industry trends, and technology developments.*

[Features](#features) • [Architecture](#system-architecture) • [Getting Started](#getting-started) • [API Documentation](#api-documentation) • [Deployment](#deployment)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Data Flow](#data-flow)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

BeAware is an enterprise-grade news aggregation platform that automatically fetches, processes, and serves AI security and cybersecurity news from multiple sources. The platform features intelligent categorization, real-time search, user authentication, and newsletter capabilities.

### Key Capabilities

- **Automated Content Ingestion**: Daily automated fetching from RSS feeds, NewsAPI, and selective web scraping
- **Intelligent Categorization**: ML-assisted categorization into 6+ categories
- **Real-time Search**: Full-text search with advanced filtering
- **User Personalization**: Bookmarks, preferences, and newsletter subscriptions
- **Scalable Architecture**: Built for high availability and horizontal scaling
- **Modern Tech Stack**: Next.js 16, React 19, TypeScript, PostgreSQL

---

## ✨ Features

### Core Features

| Feature | Description |
|---------|-------------|
| 🤖 **Automated News Fetching** | Daily automated fetching from RSS feeds, NewsAPI, and selective web scraping |
| 📊 **Smart Categorization** | Articles categorized into AI Security, AI Trends, Cybersecurity, Industry Adoption, IT Industry, and Software Development |
| ⏰ **Time-Based Filtering** | View articles from last 24 hours, 7 days, or 30 days |
| 🔍 **Advanced Search** | Full-text search across articles and categories with fuzzy matching |
| 👤 **User Authentication** | Email/password and OAuth (Google, GitHub) authentication |
| 📧 **Newsletter Subscriptions** | Daily and weekly email digests with customizable content |
| 🔖 **Bookmarks** | Save articles for later reading with organization |
| 📱 **Responsive Design** | Mobile-first design that works on all devices |
| 🌙 **Dark Mode** | Automatic dark mode support with system preference detection |
| 📈 **Analytics** | Article view tracking and engagement metrics |

### Advanced Features

- **Cron-based Automation**: GitHub Actions for scheduled news fetching
- **Error Handling**: Comprehensive error handling and retry mechanisms
- **Rate Limiting**: API rate limiting to prevent abuse
- **Caching**: Redis-compatible caching for improved performance
- **SEO Optimized**: Meta tags, sitemaps, and structured data
- **Accessibility**: WCAG 2.1 AA compliant design

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Web App    │  │  Mobile App  │  │   Admin UI   │          │
│  │  (Next.js)   │  │  (React Native)│  │  (Next.js)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                           │
│                    (Next.js API Routes)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Auth API   │  │  Content API │  │  Search API  │          │
│  │  (NextAuth)  │  │   (REST)     │  │  (Full-text) │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ News Fetcher │  │ Content Proc.│  │  User Mgmt   │          │
│  │  (RSS/API)   │  │  (Parser)    │  │  (Auth)      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Data Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ PostgreSQL   │  │    Cache     │  │  File Storage│          │
│  │  (Primary)   │  │   (Redis)    │  │   (S3/CDN)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  RSS Feeds   │  │  NewsAPI     │  │  Email Svc   │          │
│  │  (12+ Source)│  │  (Backup)    │  │  (Resend)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
beaware-cybersec/
├── app/                          # Next.js 16 App Router
│   ├── (auth)/                   # Authentication route group
│   │   ├── login/                # Login page
│   │   └── register/             # Registration page
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth.js endpoints
│   │   │   └── [...nextauth]/    # Auth handler
│   │   ├── articles/             # Article CRUD operations
│   │   │   └── route.ts          # GET/POST articles
│   │   ├── search/               # Search functionality
│   │   │   └── route.ts          # Full-text search
│   │   ├── newsletter/           # Newsletter management
│   │   │   └── subscribe/        # Subscription endpoints
│   │   └── cron/                 # Scheduled tasks
│   │       └── fetch-news/       # News fetching trigger
│   ├── article/[id]/             # Article detail page
│   │   └── page.tsx              # Dynamic article view
│   ├── category/[slug]/          # Category listing page
│   │   └── page.tsx              # Dynamic category view
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Homepage with article feed
├── components/                   # React components
│   ├── ui/                       # UI components (shadcn/ui)
│   │   ├── button.tsx            # Button component
│   │   ├── card.tsx              # Card component
│   │   └── input.tsx             # Input component
│   ├── ArticleCard.tsx           # Article display card
│   ├── ArticleImage.tsx          # Image handling component
│   ├── CategoryFilter.tsx        # Category selection
│   ├── TimeFilter.tsx            # Time period filter
│   ├── SearchBar.tsx             # Search interface
│   ├── NewsletterSignup.tsx      # Newsletter form
│   ├── Header.tsx                # Site navigation
│   └── Footer.tsx                # Site footer
├── lib/                         # Utility libraries
│   ├── db.ts                     # Prisma client singleton
│   ├── auth.ts                   # NextAuth configuration
│   ├── news-fetcher.ts           # News fetching service
│   ├── newsletter.ts             # Newsletter service
│   ├── types.ts                  # TypeScript type definitions
│   └── utils.ts                  # Utility functions
├── prisma/                      # Database management
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Development seed data
│   └── seed-realistic.ts         # Production seed data
├── .github/workflows/            # CI/CD pipelines
│   ├── fetch-news.yml            # Scheduled news fetching
│   ├── deploy.yml                # Deployment workflow
│   └── test.yml                  # Testing workflow
└── public/                      # Static assets
```

---

## 🔄 Data Flow

### News Ingestion Flow

```
┌─────────────┐
│ GitHub      │
│ Actions     │
│ (Cron Job)  │
└──────┬──────┘
       │
       │ 1. Trigger
       ▼
┌─────────────┐
│ API Endpoint│
│ /api/cron/   │
│ fetch-news   │
└──────┬──────┘
       │
       │ 2. Authenticate
       ▼
┌─────────────┐
│ NewsFetcher │
│ Service     │
└──────┬──────┘
       │
       ├──────────────┬──────────────┬──────────────┐
       │              │              │              │
       │ 3a. RSS      │ 3b. NewsAPI  │ 3c. Web      │
       │    Feeds     │    Query     │    Scraping  │
       ▼              ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Krebs    │  │ NewsAPI  │  │ MITRE    │  │ NIST     │
│ Security │  │          │  │ ATT&CK   │  │          │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │             │
     │ 4. Raw Data │             │             │
     └─────────────┴─────────────┴─────────────┘
                    │
                    ▼
          ┌─────────────────┐
          │ Content Parser  │
          │ & Normalizer    │
          └────────┬────────┘
                   │
                   │ 5. Parsed Articles
                   ▼
          ┌─────────────────┐
          │ Category        │
          │ Classifier      │
          └────────┬────────┘
                   │
                   │ 6. Categorized Articles
                   ▼
          ┌─────────────────┐
          │   Database      │
          │   (PostgreSQL)  │
          └─────────────────┘
```

### User Request Flow

```
┌─────────────┐
│   User      │
│  Browser    │
└──────┬──────┘
       │
       │ 1. HTTP Request
       ▼
┌─────────────┐
│ Next.js     │
│ App Router  │
└──────┬──────┘
       │
       ├──────────────┬──────────────┐
       │              │              │
       │ 2a. Auth     │ 2b. Content  │ 2c. Search  │
       │    Check     │    Request   │    Query   │
       ▼              ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│NextAuth  │  │ API      │  │ Search   │  │ Prisma   │
│Session   │  │Route     │  │Service   │  │Client    │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │             │
     │ 3. User/    │ 3. Articles │ 3. Search  │ 3. Data  │
     │    Session  │             │  Results   │         │
     └─────────────┴─────────────┴─────────────┘
                    │
                    ▼
          ┌─────────────────┐
          │   Response      │
          │   Formatter     │
          └────────┬────────┘
                   │
                   │ 4. JSON Response
                   ▼
          ┌─────────────────┐
          │   React         │
          │   Components    │
          └────────┬────────┘
                   │
                   │ 5. Rendered UI
                   ▼
          ┌─────────────────┐
          │   User          │
          │   Browser       │
          └─────────────────┘
```

### Authentication Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Login Request
       ▼
┌─────────────┐
│ Login Page  │
└──────┬──────┘
       │
       ├──────────────┬──────────────┐
       │              │              │
       │ 2a. Email    │ 2b. Google   │ 2c. GitHub  │
       │    Password  │    OAuth     │    OAuth    │
       ▼              ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│Credentials│  │ OAuth    │  │ OAuth    │  │ NextAuth │
│Validation │  │ Redirect│  │ Redirect│  │ Handler  │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │             │
     │ 3. User/    │ 3. OAuth    │ 3. OAuth    │ 3. JWT    │
     │    Token    │    Token    │    Token    │    Token  │
     └─────────────┴─────────────┴─────────────┘
                    │
                    ▼
          ┌─────────────────┐
          │   Session       │
          │   Management    │
          └────────┬────────┘
                   │
                   │ 4. Session Cookie
                   ▼
          ┌─────────────────┐
          │   Protected     │
          │   Routes        │
          └─────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.x | React framework with App Router |
| React | 19.x | UI library |
| TypeScript | 5.7.x | Type safety |
| Tailwind CSS | 3.x | Styling |
| shadcn/ui | Latest | UI component library |
| NextAuth.js | 5.x | Authentication |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | 16.x | Serverless API |
| Prisma ORM | 5.x | Database ORM |
| PostgreSQL | 15.x | Primary database |
| Node.js | 20.x | Runtime environment |

### DevOps & Infrastructure

| Technology | Purpose |
|------------|---------|
| Vercel | Hosting & deployment |
| GitHub Actions | CI/CD & automation |
| PostgreSQL (Neon) | Managed database |
| Resend | Email service |

### Development Tools

| Technology | Purpose |
|------------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| TypeScript | Type checking |
| Jest | Unit testing |
| Playwright | E2E testing |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.9 or higher
- **PostgreSQL** 15.x or higher (or use managed database)
- **npm** 10.x or higher
- **Git** for version control

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/beaware-cybersec.git
cd beaware-cybersec
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` and configure your environment:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/beaware_cybersec?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"

# API Keys (optional)
NEWS_API_KEY="your-newsapi-key"

# Cron Security
CRON_SECRET="your-cron-secret-key"

# OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Email (optional)
RESEND_API_KEY="your-resend-api-key"
```

4. **Set up the database**

```bash
# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push

# Seed initial data (development)
npm run db:seed

# Seed realistic data (production)
DATABASE_URL="your-production-db-url" npx tsx prisma/seed-realistic.ts
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage Guide

### For Users

#### Browsing Articles

1. **Homepage**: View the latest articles from all categories
2. **Category Filter**: Click on category tags to filter by topic
3. **Time Filter**: Use the time dropdown to filter by recency
4. **Search**: Use the search bar to find specific articles
5. **Article Details**: Click on any article to read the full content

#### User Account Features

1. **Registration**: Create an account using email/password or OAuth
2. **Login**: Access your personalized dashboard
3. **Bookmarks**: Save articles for later reading
4. **Newsletter**: Subscribe to daily or weekly digests
5. **Preferences**: Customize your reading experience

### For Developers

#### Running Tests

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

#### Manual News Fetching

```bash
# Trigger news fetching manually
npm run fetch-news
```

#### Database Management

```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes
npm run db:push

# Open Prisma Studio
npx prisma studio

# Reset database (development only)
npx prisma db push --force-reset
```

#### Code Quality

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

---

## 🔌 API Documentation

### Authentication

Most endpoints require authentication. Include your session cookie or JWT token in requests.

### Endpoints

#### Articles

**GET /api/articles**

Get articles with optional filters.

Query Parameters:
- `category` (string): Filter by category slug
- `timePeriod` (string): Filter by time period (1d, 7d, 30d, all)
- `source` (string): Filter by source ID
- `search` (string): Search query
- `limit` (number): Number of results (default: 20)
- `offset` (number): Pagination offset (default: 0)

```bash
curl "http://localhost:3000/api/articles?category=ai-security&timePeriod=7d&limit=10"
```

Response:
```json
{
  "articles": [
    {
      "id": "article-id",
      "title": "Article Title",
      "summary": "Article summary",
      "content": "Full article content",
      "url": "https://original-source.com/article",
      "publishedAt": "2024-01-15T10:00:00Z",
      "author": "Author Name",
      "imageUrl": "https://example.com/image.jpg",
      "tags": ["tag1", "tag2"],
      "category": {
        "id": "category-id",
        "name": "AI Security",
        "slug": "ai-security"
      },
      "source": {
        "id": "source-id",
        "name": "Source Name",
        "url": "https://source.com"
      },
      "viewCount": 150,
      "bookmarkCount": 25
    }
  ],
  "total": 100,
  "hasMore": true
}
```

#### Search

**GET /api/search**

Full-text search across articles.

Query Parameters:
- `q` (string): Search query (required)
- `category` (string): Filter by category
- `limit` (number): Number of results (default: 10)

```bash
curl "http://localhost:3000/api/search?q=AI%20security&category=cybersecurity"
```

Response:
```json
{
  "articles": [...],
  "categories": [...],
  "total": 25
}
```

#### Newsletter

**POST /api/newsletter/subscribe**

Subscribe to newsletter.

Request Body:
```json
{
  "email": "user@example.com",
  "frequency": "daily"
}
```

Response:
```json
{
  "success": true,
  "message": "Successfully subscribed"
}
```

#### Authentication

**POST /api/auth/register**

Register new user.

Request Body:
```json
{
  "email": "user@example.com",
  "password": "secure-password",
  "name": "User Name"
}
```

**GET/POST /api/auth/[...nextauth]**

NextAuth.js authentication endpoints.

#### Cron Jobs

**POST /api/cron/fetch-news**

Trigger news fetching (requires CRON_SECRET header).

Headers:
- `Authorization`: `Bearer CRON_SECRET`

Response:
```json
{
  "success": true,
  "articlesFetched": 25,
  "sourcesProcessed": 12
}
```

---

## 🗄️ Database Schema

### Core Models

#### Article
```prisma
model Article {
  id          String   @id @default(cuid())
  title       String
  summary     String?
  content     String?  @db.Text
  url         String   @unique
  publishedAt DateTime
  author      String?
  imageUrl    String?
  tags        String[]
  viewCount   Int      @default(0)
  
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  
  sourceId    String
  source      Source   @relation(fields: [sourceId], references: [id])
  
  bookmarks   Bookmark[]
  views       ArticleView[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### Category
```prisma
model Category {
  id        String    @id @default(cuid())
  name      String    @unique
  slug      String    @unique
  articles  Article[]
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

#### Source
```prisma
model Source {
  id        String    @id @default(cuid())
  name      String    @unique
  url       String    @unique
  type      SourceType
  articles  Article[]
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

#### User
```prisma
model User {
  id                String             @id @default(cuid())
  email             String             @unique
  name              String?
  password          String?
  image             String?
  emailVerified     DateTime?
  
  accounts          Account[]
  sessions          Session[]
  bookmarks         Bookmark[]
  preferences       UserPreferences?
  subscriptions     NewsletterSubscription[]
  
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
}
```

#### Bookmark
```prisma
model Bookmark {
  id        String   @id @default(cuid())
  userId    String
  articleId String
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  article   Article  @relation(fields: [articleId], references: [id], onDelete: Cascade)
  
  @@unique([userId, articleId])
}
```

### Relationships

```
User (1) ----< (N) Bookmark
User (1) ----< (N) UserPreferences
User (1) ----< (N) NewsletterSubscription
Article (N) >---- (1) Category
Article (N) >---- (1) Source
Article (N) ----< (N) Bookmark
Article (N) ----< (N) ArticleView
```

---

## 🚢 Deployment

### Vercel Deployment

1. **Push to GitHub**

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

2. **Import to Vercel**

- Go to [vercel.com](https://vercel.com)
- Click "Add New Project"
- Import your GitHub repository
- Configure environment variables
- Deploy

3. **Environment Variables**

Add these in Vercel project settings:

```bash
DATABASE_URL=your-production-database-url
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
CRON_SECRET=your-cron-secret
NEWS_API_KEY=your-newsapi-key
```

### Database Setup

**Option 1: PostgreSQL (Self-hosted)**

```bash
# Create database
createdb beaware_cybersec

# Run migrations
npx prisma migrate deploy

# Seed production data
DATABASE_URL="your-production-url" npx tsx prisma/seed-realistic.ts
```

**Option 2: Neon (Managed PostgreSQL)**

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Add to environment variables
5. Run schema push and seed

### Custom Domain

1. Add custom domain in Vercel
2. Configure DNS records
3. Update NEXTAUTH_URL environment variable
4. Redeploy

### Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Database Monitoring**: Use Prisma Studio or your database's monitoring tools
- **Error Tracking**: Consider integrating Sentry for error tracking

---

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Check API health
curl https://your-domain.com/api/health

# Check database connection
npx prisma db execute --stdin <<< "SELECT 1"
```

### Performance Monitoring

- Monitor API response times
- Track database query performance
- Monitor error rates
- Track user engagement metrics

### Backup Strategy

- **Database Backups**: Daily automated backups
- **Code Backups**: Git version control
- **Configuration**: Environment variable management

### Scaling Considerations

- **Horizontal Scaling**: Add more Vercel instances
- **Database Scaling**: Use managed database with auto-scaling
- **Caching**: Implement Redis for frequently accessed data
- **CDN**: Use Vercel's built-in CDN for static assets

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Write tests**
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Add tests for new features
- Update documentation

### Pull Request Guidelines

- Describe the changes in detail
- Reference related issues
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

### Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [GitHub Setup Guide](./GITHUB_SETUP.md)
- [API Documentation](#api-documentation)

### Issues

For bug reports and feature requests, please open an issue on GitHub.

### Community

- Star the repository if you find it useful
- Share your projects built with BeAware
- Contribute to the codebase

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and PostgreSQL**

[⬆ Back to Top](#beaware---ai-security--industry-news-platform)

</div>