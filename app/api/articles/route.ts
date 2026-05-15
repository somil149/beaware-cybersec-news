import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ArticleWithStats } from '@/lib/types'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = await request.nextUrl.searchParams
    const category = searchParams.get('category')
    const timePeriod = searchParams.get('timePeriod') as '1d' | '7d' | '30d' | null
    const source = searchParams.get('source')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: Prisma.ArticleWhereInput = {}

    if (category) {
      where.category = {
        slug: category,
      }
    }

    if (timePeriod) {
      where.timePeriod = timePeriod
    }

    if (source) {
      where.source = {
        name: source,
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
      ]
    }

    // Get total count
    const total = await prisma.article.count({ where })

    // Get articles
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
      take: limit,
      skip: offset,
    })

    // Transform to match expected format
    const articlesWithStats: ArticleWithStats[] = articles.map((article) => ({
      ...article,
      bookmarkCount: article._count.bookmarks,
      isBookmarked: false, // Will be updated based on user session
    }))

    return NextResponse.json({
      articles: articlesWithStats,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}