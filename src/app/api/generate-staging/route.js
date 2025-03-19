import { generateStagedImage } from '../../../lib/stableDiffusion'
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request) {
  try {
    // Parse the incoming form data
    const formData = await request.formData()
    const image = formData.get('image')
    const roomStyle = formData.get('style') || 'modern'

    // Check if an image file was provided
    if (!image || typeof image === 'string') {
      return new Response(JSON.stringify({ error: 'No image provided' }), { status: 400 })
    }

    // Convert the File (a Blob) to a Buffer
    // const buffer = Buffer.from(await image.arrayBuffer())
    // Create a unique filename using timestamp and uuid
    // const uniqueSuffix = Date.now() + '-' + uuidv4()
    // const ext = path.extname(image.name)
    // const filename = uniqueSuffix + ext
    // Construct the file path (adjust the directory as needed)
    // const filePath = path.join(process.cwd(), 'public', 'uploads', filename)

    // Save the uploaded file to disk
    // await fs.writeFile(filePath, buffer)

    // Generate the staged image using your custom function
    const stagedImagePath = await generateStagedImage(image, roomStyle)
    // Convert the staged image path to a public URL
    const publicUrl = `/uploads/${path.basename(stagedImagePath)}`

    return new Response(JSON.stringify({ stagedImageUrl: publicUrl }), { status: 200 })
  } catch (error) {
    console.error('Error in generate-staging API:', error)
    return new Response(JSON.stringify({ error: 'Failed to process image' }), { status: 500 })
  }
}
