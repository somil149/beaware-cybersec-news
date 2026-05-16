import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting test data seed...')

  // Create test category
  const category = await prisma.category.upsert({
    where: { slug: 'security' },
    update: {},
    create: {
      name: 'Security',
      slug: 'security',
      description: 'Security articles',
    },
  })

  console.log('Category created:', category.name)

  // Create test source
  const source = await prisma.source.upsert({
    where: { url: 'https://example.com' },
    update: {},
    create: {
      name: 'Test Source',
      url: 'https://example.com',
      type: 'RSS',
    },
  })

  console.log('Source created:', source.name)

  // Create test articles
  const articles = await Promise.all([
    prisma.article.upsert({
      where: { id: 'test-1' },
      update: {},
      create: {
        id: 'test-1',
        title: 'Test Article 1: Cybersecurity Best Practices',
        summary: 'This is a test article about cybersecurity best practices for modern applications.',
        content: 'Full content of the test article about cybersecurity best practices...',
        url: 'https://example.com/article1',
        publishedAt: new Date(),
        author: 'John Doe',
        imageUrl: 'https://example.com/image1.jpg',
        tags: ['security', 'best-practices', 'cybersecurity'],
        categoryId: category.id,
        sourceId: source.id,
      },
    }),
    prisma.article.upsert({
      where: { id: 'test-2' },
      update: {},
      create: {
        id: 'test-2',
        title: 'Test Article 2: Network Security Fundamentals',
        summary: 'Learn the fundamentals of network security and how to protect your infrastructure.',
        content: 'Full content about network security fundamentals...',
        url: 'https://example.com/article2',
        publishedAt: new Date(Date.now() - 86400000), // 1 day ago
        author: 'Jane Smith',
        imageUrl: 'https://example.com/image2.jpg',
        tags: ['network', 'security', 'infrastructure'],
        categoryId: category.id,
        sourceId: source.id,
      },
    }),
    prisma.article.upsert({
      where: { id: 'test-3' },
      update: {},
      create: {
        id: 'test-3',
        title: 'Test Article 3: Data Privacy Regulations',
        summary: 'Understanding data privacy regulations like GDPR and CCPA compliance.',
        content: 'Full content about data privacy regulations...',
        url: 'https://example.com/article3',
        publishedAt: new Date(Date.now() - 172800000), // 2 days ago
        author: 'Bob Johnson',
        imageUrl: 'https://example.com/image3.jpg',
        tags: ['privacy', 'gdpr', 'compliance'],
        categoryId: category.id,
        sourceId: source.id,
      },
    }),
  ])

  console.log(`Created ${articles.length} test articles`)

  console.log('Test data seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding test data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })