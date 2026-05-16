import React from 'react'
import { render, screen } from '@testing-library/react'
import CategoryFilter from '../CategoryFilter'

// Mock the hooks
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => ({
    get: jest.fn(),
    toString: () => '',
  }),
}))

describe('CategoryFilter', () => {
  const mockCategories = [
    { id: '1', name: 'Technology', slug: 'technology' },
    { id: '2', name: 'Security', slug: 'security' },
    { id: '3', name: 'Privacy', slug: 'privacy' },
  ]

  it('should render all categories', () => {
    render(<CategoryFilter categories={mockCategories} />)
    
    expect(screen.getByText('All Categories')).toBeInTheDocument()
    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('Security')).toBeInTheDocument()
    expect(screen.getByText('Privacy')).toBeInTheDocument()
  })

  it('should highlight current category', () => {
    render(<CategoryFilter categories={mockCategories} currentCategory="security" />)
    
    const allCategories = screen.getByText('All Categories')
    const security = screen.getByText('Security')
    
    expect(allCategories).not.toHaveClass('bg-blue-600')
    expect(security).toHaveClass('bg-blue-600')
  })

  it('should highlight "All Categories" when no current category', () => {
    render(<CategoryFilter categories={mockCategories} />)
    
    const allCategories = screen.getByText('All Categories')
    expect(allCategories).toHaveClass('bg-blue-600')
  })

  it('should render empty categories array', () => {
    render(<CategoryFilter categories={[]} />)
    
    expect(screen.getByText('All Categories')).toBeInTheDocument()
  })
})