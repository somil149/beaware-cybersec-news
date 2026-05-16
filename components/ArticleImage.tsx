'use client'

import { useState } from 'react'

interface ArticleImageProps {
  src?: string | null
  alt: string
}

export default function ArticleImage({ src, alt }: ArticleImageProps) {
  const [imageError, setImageError] = useState(false)

  if (!src || imageError) {
    return (
      <div className="aspect-video w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
        <svg className="w-12 h-12 text-blue-400 dark:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 012-2m-6 0l-2 2m2-2l-2 2m2 2l2-2" />
        </svg>
      </div>
    )
  }

  return (
    <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  )
}