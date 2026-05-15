'use client'

import { useState } from 'react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [frequency, setFrequency] = useState<'DAILY' | 'WEEKLY'>('DAILY')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, frequency }),
      })

      if (response.ok) {
        setStatus('success')
        setMessage('Successfully subscribed to newsletter!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage('Failed to subscribe. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred. Please try again.')
    }
  }

  return (
    <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Stay Updated
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Get the latest AI security and industry trends delivered to your inbox.
      </p>
      
      {status === 'success' ? (
        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-lg">
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="DAILY"
                checked={frequency === 'DAILY'}
                onChange={(e) => setFrequency(e.target.value as 'DAILY' | 'WEEKLY')}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Daily</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="WEEKLY"
                checked={frequency === 'WEEKLY'}
                onChange={(e) => setFrequency(e.target.value as 'DAILY' | 'WEEKLY')}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Weekly</span>
            </label>
          </div>
          
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
          
          {status === 'error' && (
            <p className="text-red-600 dark:text-red-400 text-sm">{message}</p>
          )}
        </form>
      )}
    </div>
  )
}