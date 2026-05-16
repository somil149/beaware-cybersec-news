import React from 'react'
import { render, screen } from '@testing-library/react'
import ArticleCard from '../ArticleCard'
import { ArticleWithStats } from '@/lib/types'

// Mock the utils
jest.mock('@/lib/utils', () => ({
  formatRelativeTime: jest.fn(() => '2h ago'),
}))

const mockArticle: ArticleWithStats = {
  id: '1',
  title: 'Test Article Title',
  summary: 'This is a test article summary that should be displayed in the card.',
  content: 'Full article content here',
  url: 'https://example.com/article',
  publishedAt: new Date('2024-01-15'),
  author: 'John Doe',
  imageUrl: 'https://example.com/image.jpg',
  tags: ['security', 'privacy', 'tech'],
  bookmarkCount: 5,
  isBookmarked: false,
  categoryId: 'cat1',
  sourceId: 'src1',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  timePeriod: null,
  category: {
    id: 'cat1',
    name: 'Security',
    slug: 'security',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  source: {
    id: 'src1',
    name: 'Tech News',
    url: 'https://example.com',
    type: 'RSS',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
}

describe('ArticleCard', () => {
  it('should render article with all fields', () => {
    render(<ArticleCard article={mockArticle} />)
    
    expect(screen.getByText('Test Article Title')).toBeInTheDocument()
    expect(screen.getByText('This is a test article summary that should be displayed in the card.')).toBeInTheDocument()
    expect(screen.getByText('Security')).toBeInTheDocument()
    expect(screen.getByText('Tech News')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('5 bookmarks')).toBeInTheDocument()
  })

  it('should render article without image', () => {
    const articleWithoutImage = { ...mockArticle, imageUrl: undefined }
    render(<ArticleCard article={articleWithoutImage} />)
    
    expect(screen.getByText('Test Article Title')).toBeInTheDocument()
    const image = screen.queryByRole('img')
    expect(image).not.toBeInTheDocument()
  })

  it('should render article without author', () => {
    const articleWithoutAuthor = { ...mockArticle, author: null }
    render(<ArticleCard article={articleWithoutAuthor} />)
    
    expect(screen.getByText('Test Article Title')).toBeInTheDocument()
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
  })

  it('should render article without summary', () => {
    const articleWithoutSummary = { ...mockArticle, summary: undefined }
    render(<ArticleCard article={articleWithoutSummary} />)
    
    expect(screen.getByText('Test Article Title')).toBeInTheDocument()
    expect(screen.queryByText('This is a test article summary')).not.toBeInTheDocument()
  })

  it('should render article without tags', () => {
    const articleWithoutTags = { ...mockArticle, tags: [] }
    render(<ArticleCard article={articleWithoutTags} />)
    
    expect(screen.getByText('Test Article Title')).toBeInTheDocument()
    expect(screen.queryByText('#security')).not.toBeInTheDocument()
  })

  it('should render article without bookmark count', () => {
    const articleWithoutBookmarks = { ...mockArticle, bookmarkCount: undefined }
    render(<ArticleCard article={articleWithoutBookmarks} />)
    
    expect(screen.getByText('Test Article Title')).toBeInTheDocument()
    expect(screen.queryByText('bookmarks')).not.toBeInTheDocument()
  })

  it('should render link to article', () => {
    render(<ArticleCard article={mockArticle} />)
    
    const link = screen.getByRole('link', { name: 'Test Article Title' })
    expect(link).toHaveAttribute('href', '/article/1')
  })

  it('should display only first 3 tags', () => {
    const articleWithManyTags = {
      ...mockArticle,
      tags: ['security', 'privacy', 'tech', 'ai', 'ml']
    }
    render(<ArticleCard article={articleWithManyTags} />)
    
    expect(screen.getByText('#security')).toBeInTheDocument()
    expect(screen.getByText('#privacy')).toBeInTheDocument()
    expect(screen.getByText('#tech')).toBeInTheDocument()
    expect(screen.queryByText('#ai')).not.toBeInTheDocument()
    expect(screen.queryByText('#ml')).not.toBeInTheDocument()
  })
})