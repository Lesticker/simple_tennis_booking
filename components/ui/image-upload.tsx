'use client'

import { useState } from 'react'
import { Button } from './button'
import { Label } from './label'
import { Loader2, Upload } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function ImageUpload({ value, onChange, label = "Zdjęcie kortu" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      onChange(data.url)
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      <div className="flex flex-col items-center gap-4">
        {value && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <Image
              src={value}
              alt="Court image"
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => document.getElementById('imageInput')?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </>
            )}
          </Button>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  )
} 