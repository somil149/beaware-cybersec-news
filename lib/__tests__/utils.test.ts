import {
  cn,
  formatDate,
  formatRelativeTime,
  getTimePeriod,
  truncateText,
  slugify,
  isValidUrl,
} from '../utils'

describe('cn', () => {
  it('should merge class names correctly', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('should handle conditional classes', () => {
    expect(cn('px-4', false && 'py-2', 'bg-blue-500')).toBe('px-4 bg-blue-500')
  })

  it('should handle Tailwind conflicts', () => {
    expect(cn('px-4', 'px-2')).toBe('px-2')
  })
})

describe('formatDate', () => {
  it('should format Date object', () => {
    const date = new Date('2024-01-15')
    const result = formatDate(date)
    expect(result).toContain('2024')
    expect(result).toContain('Jan')
    expect(result).toContain('15')
  })

  it('should format date string', () => {
    const result = formatDate('2024-01-15')
    expect(result).toContain('2024')
    expect(result).toContain('Jan')
    expect(result).toContain('15')
  })

  it('should handle invalid date string gracefully', () => {
    const result = formatDate('invalid-date')
    expect(typeof result).toBe('string')
  })
})

describe('formatRelativeTime', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should return "just now" for very recent dates', () => {
    const now = new Date()
    const recentDate = new Date(now.getTime() - 30 * 1000) // 30 seconds ago
    const result = formatRelativeTime(recentDate)
    expect(result).toBe('just now')
  })

  it('should return minutes ago for dates within an hour', () => {
    const now = new Date()
    const pastDate = new Date(now.getTime() - 30 * 60 * 1000) // 30 minutes ago
    const result = formatRelativeTime(pastDate)
    expect(result).toBe('30m ago')
  })

  it('should return hours ago for dates within a day', () => {
    const now = new Date()
    const pastDate = new Date(now.getTime() - 5 * 60 * 60 * 1000) // 5 hours ago
    const result = formatRelativeTime(pastDate)
    expect(result).toBe('5h ago')
  })

  it('should return days ago for dates within a week', () => {
    const now = new Date()
    const pastDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    const result = formatRelativeTime(pastDate)
    expect(result).toBe('3d ago')
  })

  it('should return formatted date for older dates', () => {
    const oldDate = new Date('2020-01-15')
    const result = formatRelativeTime(oldDate)
    expect(result).toContain('2020')
  })
})

describe('getTimePeriod', () => {
  it('should return "1d" for dates within 1 day', () => {
    const now = new Date()
    const recentDate = new Date(now.getTime() - 12 * 60 * 60 * 1000) // 12 hours ago
    expect(getTimePeriod(recentDate)).toBe('1d')
  })

  it('should return "7d" for dates within 7 days', () => {
    const now = new Date()
    const pastDate = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    expect(getTimePeriod(pastDate)).toBe('7d')
  })

  it('should return "30d" for dates within 30 days', () => {
    const now = new Date()
    const pastDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
    expect(getTimePeriod(pastDate)).toBe('30d')
  })

  it('should return null for dates older than 30 days', () => {
    const oldDate = new Date('2020-01-15')
    expect(getTimePeriod(oldDate)).toBeNull()
  })
})

describe('truncateText', () => {
  it('should return text unchanged if shorter than maxLength', () => {
    expect(truncateText('Hello', 10)).toBe('Hello')
  })

  it('should truncate text longer than maxLength', () => {
    expect(truncateText('Hello World', 5)).toBe('Hello...')
  })

  it('should handle exact length', () => {
    expect(truncateText('Hello', 5)).toBe('Hello')
  })

  it('should trim whitespace before adding ellipsis', () => {
    expect(truncateText('Hello World  ', 8)).toBe('Hello Wo...')
  })

  it('should trim whitespace before checking length', () => {
    expect(truncateText('  Hello  ', 10)).toBe('Hello')
  })
})

describe('slugify', () => {
  it('should convert to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('should remove special characters', () => {
    expect(slugify('Hello@World#Test')).toBe('helloworldtest')
  })

  it('should replace spaces with hyphens', () => {
    expect(slugify('hello world test')).toBe('hello-world-test')
  })

  it('should handle multiple spaces', () => {
    expect(slugify('hello   world')).toBe('hello-world')
  })

  it('should remove leading and trailing hyphens', () => {
    expect(slugify('-hello world-')).toBe('hello-world')
  })
})

describe('isValidUrl', () => {
  it('should return true for valid URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true)
    expect(isValidUrl('http://example.com')).toBe(true)
    expect(isValidUrl('https://example.com/path')).toBe(true)
  })

  it('should return false for invalid URLs', () => {
    expect(isValidUrl('not-a-url')).toBe(false)
    expect(isValidUrl('')).toBe(false)
    expect(isValidUrl('example')).toBe(false)
  })

  it('should handle URLs with query parameters', () => {
    expect(isValidUrl('https://example.com?param=value')).toBe(true)
  })
})