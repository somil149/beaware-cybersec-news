import { Article, Category, Source } from '@prisma/client'

export type ArticleWithRelations = Article & {
  category: Category
  source: Source
}

export type ArticleWithStats = ArticleWithRelations & {
  bookmarkCount?: number
  isBookmarked?: boolean
}

export interface NewsFilters {
  category?: string
  timePeriod?: '1d' | '7d' | '30d'
  source?: string
  search?: string
  limit?: number
  offset?: number
}

export interface NewsletterData {
  email: string
  frequency: 'IMMEDIATE' | 'DAILY' | 'WEEKLY' | 'NEVER'
  categories?: string[]
}

export interface UserPreferences {
  preferredCategories: string[]
  emailFrequency: 'IMMEDIATE' | 'DAILY' | 'WEEKLY' | 'NEVER'
}

export interface NewsSource {
  name: string
  url: string
  type: 'RSS' | 'API' | 'SCRAPE'
  category?: string
}

export interface ParsedArticle {
  title: string
  url: string
  summary?: string
  content?: string
  publishedAt: Date
  author?: string
  imageUrl?: string
  tags?: string[]
}