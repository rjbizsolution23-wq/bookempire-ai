import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { nanoid } from 'nanoid'

const R2_ENDPOINT = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'bookempire-files'
const PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://files.bookempire.ai'

export async function uploadFile(
  buffer: Buffer,
  filename: string,
  contentType: string,
  folder: string = 'uploads'
): Promise<string> {
  const key = `${folder}/${Date.now()}-${nanoid()}-${filename}`

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  )

  return `${PUBLIC_URL}/${key}`
}

export async function uploadPDF(
  buffer: Buffer,
  bookId: string,
  filename: string
): Promise<string> {
  return uploadFile(buffer, filename, 'application/pdf', `books/${bookId}/pdf`)
}

export async function uploadEPUB(
  buffer: Buffer,
  bookId: string,
  filename: string
): Promise<string> {
  return uploadFile(buffer, filename, 'application/epub+zip', `books/${bookId}/epub`)
}

export async function uploadCover(
  buffer: Buffer,
  bookId: string,
  filename: string
): Promise<string> {
  return uploadFile(buffer, filename, 'image/png', `books/${bookId}/covers`)
}

export async function getSignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  return getSignedUrl(s3Client, command, { expiresIn })
}

export async function uploadFromUrl(url: string, bookId: string, type: 'cover' | 'pdf'): Promise<string> {
  const response = await fetch(url)
  const buffer = Buffer.from(await response.arrayBuffer())
  
  const contentType = response.headers.get('content-type') || 'application/octet-stream'
  const extension = contentType.includes('image') ? 'png' : 'pdf'
  const filename = `${type}-${nanoid()}.${extension}`

  const folder = type === 'cover' ? `books/${bookId}/covers` : `books/${bookId}/pdf`
  
  return uploadFile(buffer, filename, contentType, folder)
}
