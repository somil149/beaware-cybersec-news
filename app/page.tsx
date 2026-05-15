import { prisma } from '@/lib/db'
import ArticleCard from '@/components/ArticleCard'
import CategoryFilter from '@/components/CategoryFilter'
import TimeFilter from '@/components/TimeFilter'
import SearchBar from '@/components/SearchBar'
import NewsletterSignup from '@/components/NewsletterSignup'

// Mock data for demo purposes
const mockCategories = [
  { id: '1', name: 'AI Security', slug: 'ai-security', description: 'AI security news and threats' },
  { id: '2', name: 'AI Trends', slug: 'ai-trends', description: 'Latest AI industry trends' },
  { id: '3', name: 'Cybersecurity', slug: 'cybersecurity', description: 'Cybersecurity news' },
  { id: '4', name: 'Industry Adoption', slug: 'industry-adoption', description: 'AI adoption trends' },
  { id: '5', name: 'IT Industry', slug: 'it-industry', description: 'IT industry news' },
  { id: '6', name: 'Software Development', slug: 'software-development', description: 'SDLC trends' },
]

const mockArticles = [
  {
    id: '1',
    title: 'New AI Security Threat Discovered in Popular Language Models',
    url: 'https://example.com/article1',
    summary: 'Researchers have discovered a new vulnerability that affects multiple large language models, potentially exposing sensitive data.',
    content: 'Full article content would go here...',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    categoryId: '1',
    category: mockCategories[0],
    sourceId: '1',
    source: { id: '1', name: 'Krebs on Security', url: 'https://krebsonsecurity.com/feed/', type: 'RSS' as const, credibilityScore: 0.9, lastFetched: new Date(), active: true },
    sentimentScore: 0.3,
    credibilityScore: 0.9,
    viewCount: 150,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    author: 'John Smith',
    tags: ['AI', 'Security', 'LLM'],
    timePeriod: '1d',
    bookmarkCount: 12,
    isBookmarked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Major Tech Companies Announce AI Safety Consortium',
    url: 'https://example.com/article2',
    summary: 'Google, Microsoft, and OpenAI join forces to establish new AI safety standards and practices.',
    content: 'Full article content would go here...',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    categoryId: '2',
    category: mockCategories[1],
    sourceId: '2',
    source: { id: '2', name: 'The Hacker News', url: 'https://thehackernews.com/feed.xml', type: 'RSS' as const, credibilityScore: 0.85, lastFetched: new Date(), active: true },
    sentimentScore: 0.8,
    credibilityScore: 0.85,
    viewCount: 320,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    author: 'Jane Doe',
    tags: ['AI', 'Safety', 'Consortium'],
    timePeriod: '7d',
    bookmarkCount: 25,
    isBookmarked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Critical Vulnerability Found in Popular Payment Processing System',
    url: 'https://example.com/article3',
    summary: 'A security researcher identifies a critical flaw that could expose millions of payment records.',
    content: 'Full article content would go here...',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    categoryId: '3',
    category: mockCategories[2],
    sourceId: '3',
    source: { id: '3', name: 'Dark Reading', url: 'https://www.darkreading.com/rss.xml', type: 'RSS' as const, credibilityScore: 0.8, lastFetched: new Date(), active: true },
    sentimentScore: -0.5,
    credibilityScore: 0.8,
    viewCount: 450,
    imageUrl: 'https://images.unsplash.com/photo-1563206767-5b1d972d9c3b?w=800',
    author: 'Security Team',
    tags: ['Cybersecurity', 'Vulnerability', 'Payment'],
    timePeriod: '7d',
    bookmarkCount: 45,
    isBookmarked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function getArticles() {
  // Check if database URL is configured
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost')) {
    console.log('Database not configured, using mock data')
    return mockArticles
  }

  try {
    const articles = await prisma.article.findMany({
      include: {
        category: true,
        source: true,
        _count: {
          select: {
            bookmarks: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 20,
    })

    return articles.map((article) => ({
      ...article,
      bookmarkCount: article._count.bookmarks,
      isBookmarked: false,
    }))
  } catch (error) {
    console.log('Database not available, using mock data')
    return mockArticles
  }
}

async function getCategories() {
  // Check if database URL is configured
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost')) {
    console.log('Database not configured, using mock categories')
    return mockCategories
  }

  try {
    return prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    })
  } catch (error) {
    console.log('Database not available, using mock categories')
    return mockCategories
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; timePeriod?: string; search?: string }>
}) {
  const params = await searchParams
  const articles = await getArticles()
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Stay Ahead of AI Security & Industry Trends
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Your trusted source for the latest AI security news, cybersecurity threats, 
              and industry adoption trends.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Filter by Category
                </h3>
                <CategoryFilter categories={categories} currentCategory={params.category} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Filter by Time
                </h3>
                <TimeFilter currentTimePeriod={params.timePeriod as any} />
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.length > 0 ? (
                articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">
                    No articles found. Check back later for updates!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <NewsletterSignup />
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Trending Topics
                </h3>
                <div className="space-y-2">
                  {categories.slice(0, 5).map((category) => (
                    <a
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-gray-700 dark:text-gray-300">
                        {category.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
