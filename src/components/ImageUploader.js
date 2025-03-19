"use client"
import { useState, useRef } from 'react'

export default function ImageUploader({ onImageUpload }) {
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div 
      className="border-2 border-dashed border-gray-300 rounded p-6 text-center"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {preview ? (
        <div className="mb-4">
          <img 
            src={preview} 
            alt="Room preview" 
            className="max-h-64 mx-auto"
          />
        </div>
      ) : (
        <div className="text-gray-500 mb-4">
          Drag & drop an image here, or click to select
        </div>
      )}
      
      <button
        onClick={() => fileInputRef.current.click()}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        {preview ? 'Change Image' : 'Select Image'}
      </button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  )
}
