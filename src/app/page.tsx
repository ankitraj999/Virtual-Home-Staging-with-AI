"use client"
import { useState } from 'react'
import Head from 'next/head'
import ImageUploader from '../components/ImageUploader'
import ResultDisplay from '../components/ResultDisplay'

export default function Home() {
  const [originalImage, setOriginalImage] = useState(null)
  const [stagedImage, setStagedImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [roomStyle, setRoomStyle] = useState('modern')
  const [error, setError] = useState('')

  const handleImageUpload = (imageFile:any) => {
    setOriginalImage(imageFile)
    setStagedImage(null)
    setError('')
  }

  const generateStagedImage = async () => {
    if (!originalImage) {
      setError('Please upload an image first')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('image', originalImage)
      formData.append('style', roomStyle)

      const response = await fetch('/api/generate-staging', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to generate staged image')
      }

      const data = await response.json()
      setStagedImage(data.stagedImageUrl)
    } catch (err) {
      console.error('Error generating staged image:', err)
      setError('Failed to generate staged image. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Virtual Home Staging with AI</title>
        <meta name="description" content="Generate virtually staged rooms using AI" />
      </Head>

      <main>
        <h1 className="text-3xl font-bold mb-8 text-center">
          Virtual Home Staging with AI
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Upload a Room Image</h2>
            <ImageUploader onImageUpload={handleImageUpload} />
          </div>

          {originalImage && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Select Room Style</h2>
              <div className="flex flex-wrap gap-4">
                {['modern', 'minimalist', 'scandinavian', 'industrial', 'bohemian', 'traditional'].map(style => (
                  <button
                    key={style}
                    onClick={() => setRoomStyle(style)}
                    className={`px-4 py-2 rounded border ${
                      roomStyle === style 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {originalImage && (
            <div className="mb-8 text-center">
              <button
                onClick={generateStagedImage}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isLoading ? 'Generating...' : 'Generate Staged Room'}
              </button>
            </div>
          )}

          {error && (
            <div className="text-red-600 mb-4 text-center">{error}</div>
          )}

          {(originalImage || stagedImage) && (
            <ResultDisplay
              originalImage={originalImage}
              stagedImage={stagedImage}
              isLoading={isLoading}
            />
          )}
        </div>
      </main>
    </div>
  )
}
