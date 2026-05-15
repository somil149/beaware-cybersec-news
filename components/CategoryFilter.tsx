'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

interface CategoryFilterProps {
  categories: Array<{
    id: string
    name: string
    slug: string
  }>
  currentCategory?: string
}

export default function CategoryFilter({ categories, currentCategory }: CategoryFilterProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createUrl = (categorySlug?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categorySlug) {
      params.set('category', categorySlug)
    } else {
      params.delete('category')
    }
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={createUrl()}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          !currentCategory
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        All Categories
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={createUrl(category.slug)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentCategory === category.slug
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  )
}