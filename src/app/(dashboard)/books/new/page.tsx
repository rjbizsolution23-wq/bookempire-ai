'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Book, Sparkles, TrendingUp, Users } from 'lucide-react'

const genres = [
  'Fiction',
  'Non-Fiction',
  'Business',
  'Self-Help',
  'Biography',
  'Science',
  'Technology',
  'History',
  'Romance',
  'Mystery',
  'Fantasy',
  'Thriller',
]

const targetAudiences = [
  'General Readers',
  'Young Adults',
  'Professionals',
  'Entrepreneurs',
  'Students',
  'Academics',
]

export default function NewBookPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    authorName: '',
    description: '',
    genre: 'Business',
    inputType: 'topic',
    inputContent: '',
    targetWordCount: 30000,
    targetAudience: 'General Readers',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/books/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/books/${data.book.id}?generating=true`)
      } else {
        alert(data.error || 'Failed to generate book')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to generate book')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Generate New Book</h1>
        <p className="text-gray-600 mt-1">
          Create a complete, professional book in minutes using AI
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Book className="h-5 w-5 text-cyan-600" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Book Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="The Ultimate Guide to AI"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author Name *
              </label>
              <input
                type="text"
                required
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                placeholder="Rick Jefferson"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="A comprehensive guide to understanding and implementing AI in business..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genre *</label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Audience *
              </label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {targetAudiences.map((audience) => (
                  <option key={audience} value={audience}>
                    {audience}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content Input Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-600" />
            Content Input
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Input Type</label>
            <div className="grid grid-cols-3 gap-3">
              {['topic', 'outline', 'notes'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, inputType: type })}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                    formData.inputType === type
                      ? 'border-cyan-600 bg-cyan-50 text-cyan-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData.inputType === 'topic'
                ? 'Main Topic or Theme *'
                : formData.inputType === 'outline'
                ? 'Book Outline *'
                : 'Research Notes or Ideas *'}
            </label>
            <textarea
              required
              rows={6}
              value={formData.inputContent}
              onChange={(e) => setFormData({ ...formData, inputContent: e.target.value })}
              placeholder={
                formData.inputType === 'topic'
                  ? 'How AI is transforming modern business, including practical strategies and case studies...'
                  : formData.inputType === 'outline'
                  ? 'Chapter 1: Introduction to AI\nChapter 2: AI in Marketing\n...'
                  : 'Key points, research findings, quotes, statistics...'
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
            />
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-600" />
            Generation Settings
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Word Count: {formData.targetWordCount.toLocaleString()} words
            </label>
            <input
              type="range"
              min="10000"
              max="100000"
              step="5000"
              value={formData.targetWordCount}
              onChange={(e) =>
                setFormData({ ...formData, targetWordCount: parseInt(e.target.value) })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10K (Short)</span>
              <span>50K (Standard)</span>
              <span>100K (Epic)</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Estimated generation time:</strong>{' '}
              {Math.ceil(formData.targetWordCount / 5000)} - {Math.ceil(formData.targetWordCount / 3000)} minutes
            </p>
            <p className="text-xs text-blue-600 mt-1">
              You'll receive email notifications when your book is ready!
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Book
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
