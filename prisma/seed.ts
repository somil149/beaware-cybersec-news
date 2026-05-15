import { PrismaClient } from '@prisma/client'
import { initializeCategories } from '../lib/news-fetcher'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Initialize categories
  await initializeCategories()

  // Initialize RSS sources
  const rssSources = [
    {
      name: 'Krebs on Security',
      url: 'https://krebsonsecurity.com/feed/',
      type: 'RSS',
      credibilityScore: 0.9,
    },
    {
      name: 'The Hacker News',
      url: 'https://thehackernews.com/feed.xml',
      type: 'RSS',
      credibilityScore: 0.85,
    },
    {
      name: 'Dark Reading',
      url: 'https://www.darkreading.com/rss.xml',
      type: 'RSS',
      credibilityScore: 0.8,
    },
    {
      name: 'Threat Post',
      url: 'https://threatpost.com/feed/',
      type: 'RSS',
      credibilityScore: 0.8,
    },
    {
      name: 'Ars Technica Security',
      url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
      type: 'RSS',
      credibilityScore: 0.85,
    },
    {
      name: 'Google Security Blog',
      url: 'https://security.googleblog.com/feeds/posts/default',
      type: 'RSS',
      credibilityScore: 0.9,
    },
    {
      name: 'OpenAI Blog',
      url: 'https://openai.com/blog/rss.xml',
      type: 'RSS',
      credibilityScore: 0.95,
    },
    {
      name: 'Google AI Blog',
      url: 'https://blog.google/technology/ai/rss/',
      type: 'RSS',
      credibilityScore: 0.9,
    },
    {
      name: 'MIT Technology Review AI',
      url: 'https://www.technologyreview.com/feed/',
      type: 'RSS',
      credibilityScore: 0.85,
    },
    {
      name: 'CISA Alerts',
      url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/feed',
      type: 'RSS',
      credibilityScore: 0.95,
    },
    {
      name: 'OWASP Blog',
      url: 'https://owasp.org/blog/feed/',
      type: 'RSS',
      credibilityScore: 0.9,
    },
    {
      name: 'Schneier on Security',
      url: 'https://www.schneier.com/blog/atom.xml',
      type: 'RSS',
      credibilityScore: 0.9,
    },
  ]

  for (const source of rssSources) {
    await prisma.source.upsert({
      where: { name: source.name },
      create: source,
      update: {},
    })
  }

  // Initialize scrape sources
  const scrapeSources = [
    {
      name: 'MITRE ATT&CK',
      url: 'https://attack.mitre.org/updates/',
      type: 'SCRAPE' as const,
      credibilityScore: 0.95,
    },
    {
      name: 'NIST Cybersecurity',
      url: 'https://www.nist.gov/cyberframework',
      type: 'SCRAPE' as const,
      credibilityScore: 0.95,
    },
  ]

  for (const source of scrapeSources) {
    await prisma.source.upsert({
      where: { name: source.name },
      create: source,
      update: {},
    })
  }

  console.log('Database seed completed successfully')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })