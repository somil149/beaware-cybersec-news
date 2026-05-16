import Link from 'next/link'
import { ArticleWithStats } from '@/lib/types'
import { formatRelativeTime } from '@/lib/utils'

interface ArticleCardProps {
  article: ArticleWithStats
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col min-h-[300px]">
      {article.imageUrl ? (
        <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
          <svg className="w-12 h-12 text-blue-400 dark:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 012-2m-6 0l-2 2m2-2l-2 2m2 2l2-2" />
          </svg>
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
            {article.category.name}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatRelativeTime(article.publishedAt)}
          </span>
        </div>
        
        <Link href={`/article/${article.id}`}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 mb-2">
            {article.title}
          </h2>
        </Link>
        
        {article.summary && (
          <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-3 flex-grow">
            {article.summary}
          </p>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {article.source.name}
            </span>
            {article.author && (
              <>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {article.author}
                </span>
              </>
            )}
          </div>
          
          {article.bookmarkCount !== undefined && article.bookmarkCount > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {article.bookmarkCount} bookmarks
            </span>
          )}
        </div>
        
        {article.tags && article.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}