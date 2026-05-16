import { prisma } from '@/lib/db'
import { formatRelativeTime, formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import parse from 'html-react-parser'

async function getArticle(id: string) {
  return prisma.article.findUnique({
    where: { id },
    include: {
      category: true,
      source: true,
    },
  })
}

async function incrementViewCount(articleId: string) {
  try {
    await prisma.article.update({
      where: { id: articleId },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })
  } catch (error) {
    console.error('Error incrementing view count:', error)
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const article = await getArticle(id)
  
  if (!article) {
    notFound()
  }

  // Increment view count asynchronously
  incrementViewCount(id)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <article className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
              {article.category.name}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatRelativeTime(article.publishedAt)}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>
              <span className="font-medium">Source:</span> {article.source.name}
            </span>
            {article.author && (
              <span>
                <span className="font-medium">Author:</span> {article.author}
              </span>
            )}
            <span>
              <span className="font-medium">Views:</span> {article.viewCount}
            </span>
          </div>
        </header>

        {/* Featured Image */}
        {article.imageUrl && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="mb-8">
          {article.summary && (
            <div className="text-xl text-gray-700 dark:text-gray-300 mb-6 italic border-l-4 border-blue-500 pl-4">
              {article.summary}
            </div>
          )}

          {article.content ? (
            <div className="text-gray-800 dark:text-gray-200 prose prose-lg dark:prose-invert max-w-none">
              {parse(article.content)}
            </div>
          ) : (
            <div className="text-gray-600 dark:text-gray-400">
              <p className="mb-4">
                This article is sourced from {article.source.name}. 
                For the full content, please visit the original article.
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Read Full Article →
              </a>
            </div>
          )}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Article Meta */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Published: {formatDate(article.publishedAt)}
            </span>
            <span>
              Category: <Link href={`/category/${article.category.slug}`} className="text-blue-600 hover:text-blue-700">
                {article.category.name}
              </Link>
            </span>
          </div>
        </div>

        {/* Share Section */}
        <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Share this article
          </h3>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Share on Twitter
            </button>
            <button className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors">
              Share on LinkedIn
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Copy Link
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}