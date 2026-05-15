'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

interface TimeFilterProps {
  currentTimePeriod?: '1d' | '7d' | '30d'
}

export default function TimeFilter({ currentTimePeriod }: TimeFilterProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const timePeriods = [
    { value: '1d' as const, label: 'Last 24 Hours' },
    { value: '7d' as const, label: 'Last 7 Days' },
    { value: '30d' as const, label: 'Last 30 Days' },
  ]

  const createUrl = (timePeriod?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (timePeriod) {
      params.set('timePeriod', timePeriod)
    } else {
      params.delete('timePeriod')
    }
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={createUrl()}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          !currentTimePeriod
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        All Time
      </Link>
      {timePeriods.map((period) => (
        <Link
          key={period.value}
          href={createUrl(period.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentTimePeriod === period.value
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {period.label}
        </Link>
      ))}
    </div>
  )
}