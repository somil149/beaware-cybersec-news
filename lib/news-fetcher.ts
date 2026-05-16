import Parser from 'rss-parser'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { prisma } from './db'
import { ParsedArticle, NewsSource } from './types'
import { getTimePeriod, slugify } from './utils'

const parser = new Parser()

// RSS Feed Sources
const RSS_SOURCES: NewsSource[] = [
  {
    name: 'Krebs on Security',
    url: 'https://krebsonsecurity.com/feed/',
    type: 'RSS',
    category: 'cybersecurity',
  },
  {
    name: 'The Hacker News',
    url: 'https://thehackernews.com/feed.xml',
    type: 'RSS',
    category: 'cybersecurity',
  },
  {
    name: 'Dark Reading',
    url: 'https://www.darkreading.com/rss.xml',
    type: 'RSS',
    category: 'cybersecurity',
  },
  {
    name: 'Threat Post',
    url: 'https://threatpost.com/feed/',
    type: 'RSS',
    category: 'cybersecurity',
  },
  {
    name: 'Ars Technica Security',
    url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
    type: 'RSS',
    category: 'cybersecurity',
  },
  {
    name: 'Google Security Blog',
    url: 'https://security.googleblog.com/feeds/posts/default',
    type: 'RSS',
    category: 'ai-security',
  },
  {
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog/rss.xml',
    type: 'RSS',
    category: 'ai-trends',
  },
  {
    name: 'Google AI Blog',
    url: 'https://blog.google/technology/ai/rss/',
    type: 'RSS',
    category: 'ai-trends',
  },
  {
    name: 'MIT Technology Review AI',
    url: 'https://www.technologyreview.com/feed/',
    type: 'RSS',
    category: 'ai-trends',
  },
  {
    name: 'CISA Alerts',
    url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/feed',
    type: 'RSS',
    category: 'cybersecurity',
  },
  {
    name: 'OWASP Blog',
    url: 'https://owasp.org/blog/feed/',
    type: 'RSS',
    category: 'cybersecurity',
  },
  {
    name: 'Schneier on Security',
    url: 'https://www.schneier.com/blog/atom.xml',
    type: 'RSS',
    category: 'cybersecurity',
  },
]

// Scrape sources for high-value content
const SCRAPE_SOURCES: NewsSource[] = [
  {
    name: 'MITRE ATT&CK',
    url: 'https://attack.mitre.org/updates/',
    type: 'SCRAPE',
    category: 'cybersecurity',
  },
  {
    name: 'NIST Cybersecurity',
    url: 'https://www.nist.gov/cyberframework',
    type: 'SCRAPE',
    category: 'cybersecurity',
  },
]

async function fetchArticleContent(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000, // 10 second timeout
    })

    const $ = cheerio.load(response.data)

    // Remove unwanted elements
    $('script, style, nav, footer, header, aside, .ad, .advertisement, .sidebar, .comments').remove()

    // Try different content selectors
    const contentSelectors = [
      'article',
      '.article-content',
      '.post-content',
      '.entry-content',
      '.content',
      'main',
      '.main-content',
      '[role="main"]',
    ]

    let content = ''
    for (const selector of contentSelectors) {
      const element = $(selector).first()
      if (element.length > 0) {
        content = element.text().trim()
        if (content.length > 200) {
          break // Found substantial content
        }
      }
    }

    // If no content found, try paragraph tags
    if (content.length < 200) {
      const paragraphs = $('p').map((_, el) => $(el).text().trim()).get()
      content = paragraphs.join('\n\n')
    }

    // Clean up the content
    content = content
      .replace(/\s+/g, ' ') // Remove extra whitespace
      .replace(/\n\s*\n/g, '\n\n') // Fix line breaks
      .trim()

    return content
  } catch (error) {
    console.error(`Error fetching article content from ${url}:`, error)
    return ''
  }
}

async function fetchRSSFeed(source: NewsSource): Promise<ParsedArticle[]> {
  try {
    const feed = await parser.parseURL(source.url)
    const articles: ParsedArticle[] = []

    for (const item of feed.items) {
      if (!item.link) continue

      // Get content from RSS, but if it's too short, try to fetch full content
      let content = item.content || ''
      const summary = item.contentSnippet || item.content || ''

      // If RSS content is very short (< 500 chars), try to fetch full article content
      if (content.length < 500 && item.link) {
        try {
          content = await fetchArticleContent(item.link)
        } catch (error) {
          console.log(`Could not fetch full content for ${item.title}, using RSS content`)
          content = item.content || ''
        }
      }

      articles.push({
        title: item.title || '',
        url: item.link,
        summary: summary,
        content: content,
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        author: item.creator || item.author || source.name,
        imageUrl: extractImageUrl(item),
        tags: extractTags(item),
      })
    }

    return articles
  } catch (error) {
    console.error(`Error fetching RSS feed from ${source.name}:`, error)
    return []
  }
}

async function fetchFromNewsAPI(): Promise<ParsedArticle[]> {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) {
    console.log('News API key not configured, skipping...')
    return []
  }

  const keywords = [
    'AI security',
    'artificial intelligence security',
    'cybersecurity AI',
    'machine learning security',
    'AI breach',
    'cyber attack',
    'data breach',
    'AI adoption',
    'AI trends',
  ]

  const articles: ParsedArticle[] = []

  for (const keyword of keywords) {
    try {
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: keyword,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 10,
          apiKey,
        },
      })

      for (const article of response.data.articles) {
        if (!article.url) continue

        // Get content from NewsAPI, but if it's too short, try to fetch full content
        let content = article.content || ''
        const summary = article.description || ''

        // If NewsAPI content is very short (< 500 chars), try to fetch full article content
        if (content.length < 500 && article.url) {
          try {
            content = await fetchArticleContent(article.url)
          } catch (error) {
            console.log(`Could not fetch full content for ${article.title}, using NewsAPI content`)
            content = article.content || ''
          }
        }

        articles.push({
          title: article.title || '',
          url: article.url,
          summary: summary,
          content: content,
          publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
          author: article.author || 'NewsAPI',
          imageUrl: article.urlToImage,
          tags: [keyword],
        })
      }
    } catch (error) {
      console.error(`Error fetching from NewsAPI for keyword "${keyword}":`, error)
    }
  }

  return articles
}

async function scrapeWebsite(source: NewsSource): Promise<ParsedArticle[]> {
  try {
    const response = await axios.get(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    const $ = cheerio.load(response.data)
    const articles: ParsedArticle[] = []

    // This is a generic scraper - specific sites would need custom selectors
    $('article, .article, .post, .news-item').each((_, element) => {
      const $el = $(element)
      const title = $el.find('h1, h2, h3, .title').first().text().trim()
      const url = $el.find('a').first().attr('href')
      const summary = $el.find('p, .summary, .excerpt').first().text().trim()
      const dateStr = $el.find('time, .date, .published').first().attr('datetime') || 
                      $el.find('time, .date, .published').first().text()

      if (title && url) {
        articles.push({
          title,
          url: url.startsWith('http') ? url : new URL(url, source.url).href,
          summary,
          publishedAt: dateStr ? new Date(dateStr) : new Date(),
          author: source.name,
          tags: [source.category || 'general'],
        })
      }
    })

    return articles
  } catch (error) {
    console.error(`Error scraping ${source.name}:`, error)
    return []
  }
}

function extractImageUrl(item: { enclosure?: { url?: string }; content?: string }): string | undefined {
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url
  }
  // Try to extract from content
  if (item.content) {
    const match = item.content.match(/src="([^"]+)"/)
    if (match) return match[1]
  }
  return undefined
}

function extractTags(item: { categories?: string[] }): string[] {
  const tags: string[] = []
  if (item.categories) {
    tags.push(...item.categories)
  }
  return tags
}

async function saveArticleToDatabase(
  article: ParsedArticle,
  sourceName: string,
  categoryName: string
): Promise<void> {
  try {
    // Find or create source
    let source = await prisma.source.findUnique({
      where: { name: sourceName },
    })

    if (!source) {
      source = await prisma.source.create({
        data: {
          name: sourceName,
          url: article.url,
          type: 'RSS',
        },
      })
    }

    // Find or create category
    let category = await prisma.category.findUnique({
      where: { slug: slugify(categoryName) },
    })

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: categoryName,
          slug: slugify(categoryName),
          description: `${categoryName} news and updates`,
        },
      })
    }

    // Check if article already exists
    const existingArticle = await prisma.article.findUnique({
      where: { url: article.url },
    })

    if (existingArticle) {
      // Update existing article
      await prisma.article.update({
        where: { id: existingArticle.id },
        data: {
          title: article.title,
          summary: article.summary,
          content: article.content,
          imageUrl: article.imageUrl,
          author: article.author,
          tags: article.tags,
          timePeriod: getTimePeriod(article.publishedAt),
          updatedAt: new Date(),
        },
      })
    } else {
      // Create new article
      await prisma.article.create({
        data: {
          title: article.title,
          url: article.url,
          summary: article.summary,
          content: article.content,
          publishedAt: article.publishedAt,
          categoryId: category.id,
          sourceId: source.id,
          imageUrl: article.imageUrl,
          author: article.author,
          tags: article.tags || [],
          timePeriod: getTimePeriod(article.publishedAt),
        },
      })
    }
  } catch (error) {
    console.error(`Error saving article to database:`, error)
  }
}

export async function fetchAllNews(): Promise<{ total: number; sources: number }> {
  let totalArticles = 0
  let sourcesProcessed = 0

  // Fetch from RSS sources
  for (const source of RSS_SOURCES) {
    console.log(`Fetching from RSS source: ${source.name}`)
    const articles = await fetchRSSFeed(source)
    
    for (const article of articles) {
      await saveArticleToDatabase(article, source.name, source.category || 'general')
      totalArticles++
    }
    
    sourcesProcessed++
    
    // Update source last fetched time
    await prisma.source.updateMany({
      where: { name: source.name },
      data: { lastFetched: new Date() },
    })
  }

  // Fetch from NewsAPI
  console.log('Fetching from NewsAPI')
  const newsApiArticles = await fetchFromNewsAPI()
  for (const article of newsApiArticles) {
    await saveArticleToDatabase(article, 'NewsAPI', 'general')
    totalArticles++
  }
  sourcesProcessed++

  // Scrape websites
  for (const source of SCRAPE_SOURCES) {
    console.log(`Scraping: ${source.name}`)
    const articles = await scrapeWebsite(source)
    
    for (const article of articles) {
      await saveArticleToDatabase(article, source.name, source.category || 'general')
      totalArticles++
    }
    
    sourcesProcessed++
    
    // Update source last fetched time
    await prisma.source.updateMany({
      where: { name: source.name },
      data: { lastFetched: new Date() },
    })
  }

  console.log(`Fetched ${totalArticles} articles from ${sourcesProcessed} sources`)
  
  return { total: totalArticles, sources: sourcesProcessed }
}

export async function initializeCategories(): Promise<void> {
  const categories = [
    { name: 'AI Security', slug: 'ai-security', description: 'AI security news and threats' },
    { name: 'AI Trends', slug: 'ai-trends', description: 'Latest AI industry trends and developments' },
    { name: 'Cybersecurity', slug: 'cybersecurity', description: 'Cybersecurity news and breaches' },
    { name: 'Industry Adoption', slug: 'industry-adoption', description: 'AI adoption across industries' },
    { name: 'IT Industry', slug: 'it-industry', description: 'IT industry news and developments' },
    { name: 'Software Development', slug: 'software-development', description: 'SDLC and development trends' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      create: category,
      update: {},
    })
  }

  console.log('Categories initialized')
}

// Main function for running the script directly
if (require.main === module) {
  initializeCategories()
    .then(() => fetchAllNews())
    .then((result) => {
      console.log('News fetching completed:', result)
      process.exit(0)
    })
    .catch((error) => {
      console.error('Error in news fetching:', error)
      process.exit(1)
    })
}