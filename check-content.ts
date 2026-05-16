import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const article = await prisma.article.findUnique({
    where: { id: 'cmp7q4ukz005cur9013n10sz1' },
    select: {
      id: true,
      title: true,
      content: true,
      contentLength: {
        _count: {
          select: { content: true }
        }
      }
    }
  })

  if (article) {
    console.log('Article ID:', article.id)
    console.log('Title:', article.title)
    console.log('Content length:', article.content?.length || 0)
    console.log('Content preview:', article.content?.substring(0, 200) + '...')
    console.log('Content end:', article.content?.substring(-200))
  } else {
    console.log('Article not found')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())