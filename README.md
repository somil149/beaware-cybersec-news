# BeAware - AI Security & Industry News Platform

A comprehensive news aggregation platform focusing on AI security, cybersecurity threats, AI industry trends, and technology developments. Built with Next.js 16, TypeScript, Prisma, and PostgreSQL.

## Features

- 🤖 **Automated News Fetching**: Daily automated fetching from RSS feeds, NewsAPI, and selective web scraping
- 📊 **Smart Categorization**: Articles categorized into AI Security, AI Trends, Cybersecurity, Industry Adoption, IT Industry, and Software Development
- ⏰ **Time-Based Filtering**: View articles from last 24 hours, 7 days, or 30 days
- 🔍 **Advanced Search**: Full-text search across articles and categories
- 👤 **User Authentication**: Email/password and OAuth (Google, GitHub) authentication
- 📧 **Newsletter Subscriptions**: Daily and weekly email digests
- 🔖 **Bookmarks**: Save articles for later reading
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- 🌙 **Dark Mode**: Automatic dark mode support
- 🚀 **Modern Stack**: Built with Next.js 16, React 19, TypeScript, and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase recommended)
- **Authentication**: NextAuth.js
- **Deployment**: Vercel
- **Automation**: GitHub Actions

## Project Structure

```
beaware-cybersec/
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Authentication pages
│   ├── api/                      # API routes
│   │   ├── auth/                # NextAuth endpoints
│   │   ├── articles/            # Articles API
│   │   ├── search/              # Search API
│   │   ├── newsletter/          # Newsletter API
│   │   └── cron/                # Cron job endpoints
│   ├── article/[id]/            # Article detail pages
│   ├── category/[slug]/         # Category pages
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/                   # React components
│   ├── ArticleCard.tsx         # Article card component
│   ├── CategoryFilter.tsx      # Category filter
│   ├── TimeFilter.tsx          # Time period filter
│   ├── SearchBar.tsx           # Search component
│   ├── NewsletterSignup.tsx    # Newsletter signup
│   ├── Header.tsx              # Site header
│   └── Footer.tsx              # Site footer
├── lib/                         # Utility libraries
│   ├── db.ts                   # Prisma client
│   ├── auth.ts                 # NextAuth configuration
│   ├── news-fetcher.ts         # News fetching service
│   ├── types.ts                # TypeScript types
│   └── utils.ts                # Utility functions
├── prisma/                      # Database schema and migrations
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seed script
├── .github/workflows/           # GitHub Actions workflows
│   ├── fetch-news.yml          # Daily news fetching
│   ├── deploy.yml              # Deployment workflow
│   └── test.yml                # Testing workflow
└── public/                      # Static assets
```

## Getting Started

### Prerequisites

- Node.js 20.9 or higher
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
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

Edit `.env.local` and add your environment variables:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/beaware_cybersec?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
NEWS_API_KEY="your-newsapi-key"
# ... other variables
```

4. **Set up the database**
```bash
# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push

# Seed initial data
npm run db:seed
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed database with initial data
- `npm run fetch-news` - Manually fetch news articles
- `npm run db:push` - Push database schema changes
- `npm run db:generate` - Generate Prisma Client

## News Sources

### RSS Feeds
- Krebs on Security
- The Hacker News
- Dark Reading
- Threat Post
- Ars Technica Security
- Google Security Blog
- OpenAI Blog
- Google AI Blog
- MIT Technology Review AI
- CISA Alerts
- OWASP Blog
- Schneier on Security

### API Integration
- NewsAPI for broader news coverage

### Web Scraping
- MITRE ATT&CK updates
- NIST Cybersecurity Framework

## API Endpoints

### Articles
- `GET /api/articles` - Get articles with filters
  - Query params: `category`, `timePeriod`, `source`, `search`, `limit`, `offset`

### Search
- `GET /api/search?q=query` - Search articles and categories

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `DELETE /api/newsletter/subscribe?email=email` - Unsubscribe

### Authentication
- `POST /api/auth/register` - Register new user
- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints

### Cron Jobs
- `POST /api/cron/fetch-news` - Trigger news fetching (requires authentication)

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Environment Variables

Required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - NextAuth secret key
- `NEWS_API_KEY` - NewsAPI key (optional)
- `CRON_SECRET` - Secret for cron job authentication

Optional:
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` - GitHub OAuth
- `RESEND_API_KEY` - Email service for newsletters

## Database Schema

The application uses the following main models:

- `Article` - News articles with metadata
- `Category` - Article categories
- `Source` - News sources
- `User` - User accounts
- `UserPreferences` - User preferences
- `Bookmark` - User bookmarks
- `NewsletterSubscription` - Newsletter subscriptions
- `ArticleView` - Article view tracking

See `prisma/schema.prisma` for the complete schema.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For deployment issues, see [DEPLOYMENT.md](./DEPLOYMENT.md).

For other issues, please open an issue on GitHub.