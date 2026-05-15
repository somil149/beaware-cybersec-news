import { prisma } from '@/lib/db'
import ArticleCard from '@/components/ArticleCard'
import TimeFilter from '@/components/TimeFilter'
import { notFound } from 'next/navigation'
import { Prisma } from '@prisma/client'

async function getCategory(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
  })
}

async function getArticlesByCategory(categoryId: string, timePeriod?: string) {
  const where: Prisma.ArticleWhereInput = { categoryId }
  
  if (timePeriod) {
    where.timePeriod = timePeriod
  }

  const articles = await prisma.article.findMany({
    where,
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
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ timePeriod?: string }>
}) {
  const { slug } = await params
  const { timePeriod } = await searchParams
  
  const category = await getCategory(slug)
  if (!category) {
    notFound()
  }

  const articles = await getArticlesByCategory(category.id, timePeriod)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {category.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {category.description || `Latest ${category.name} news and updates`}
          </p>
        </div>

        {/* Time Filter */}
        <div className="mb-6">
          <TimeFilter currentTimePeriod={timePeriod as '1d' | '7d' | '30d' | undefined} />
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.length > 0 ? (
            articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No articles found in this category. Check back later!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}