import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function POST(request: Request) {
  try {
    const data = await request.formData()
    const file = data.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: 'tennis-courts',
      transformation: [
        { width: 1200, height: 800, crop: 'fill' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    })

    return NextResponse.json({ url: result.secure_url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}