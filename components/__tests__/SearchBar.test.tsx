import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from '../SearchBar'

const mockPush = jest.fn()

// Mock the hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: jest.fn(),
    toString: () => '',
  }),
}))

describe('SearchBar', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('should render search input and button', () => {
    render(<SearchBar />)
    
    expect(screen.getByPlaceholderText('Search articles, categories...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
  })

  it('should update query state when typing', () => {
    render(<SearchBar />)
    
    const input = screen.getByPlaceholderText('Search articles, categories...')
    fireEvent.change(input, { target: { value: 'test query' } })
    
    expect(input).toHaveValue('test query')
  })

  it('should not submit empty query', () => {
    render(<SearchBar />)
    
    const button = screen.getByRole('button', { name: 'Search' })
    fireEvent.click(button)
    
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('should submit non-empty query', () => {
    render(<SearchBar />)
    
    const input = screen.getByPlaceholderText('Search articles, categories...')
    fireEvent.change(input, { target: { value: 'test query' } })
    
    const button = screen.getByRole('button', { name: 'Search' })
    fireEvent.click(button)
    
    expect(mockPush).toHaveBeenCalled()
  })
})