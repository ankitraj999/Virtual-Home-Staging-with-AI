"use client"
import Image from 'next/image'

export default function ResultDisplay({ originalImage, stagedImage, isLoading }) {
  const originalPreview = originalImage ? URL.createObjectURL(originalImage) : null

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Image */}
        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Original Room</h3>
          {originalPreview && (
            <div className="relative h-64 w-full">
              <img 
                src={originalPreview}
                alt="Original room" 
                className="object-contain h-full w-full"
              />
            </div>
          )}
        </div>
        
        {/* Staged Image */}
        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Staged Room</h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : stagedImage ? (
            <div className="relative h-64 w-full">
              <img 
                src={stagedImage}
                alt="Staged room" 
                className="object-contain h-full w-full"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center text-gray-500 h-64">
              Generated image will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  )
}