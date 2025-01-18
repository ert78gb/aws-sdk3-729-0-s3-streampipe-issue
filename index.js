import {S3} from '@aws-sdk/client-s3'
import {Upload} from '@aws-sdk/lib-storage'
import {createReadStream, createWriteStream} from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { Writable } from 'node:stream'

/**
 * @type {import('@aws-sdk/client-s3').S3ClientConfig}
 */
const s3Options = {
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_ACCESS_KEY,
  },
  region: process.env.S3_REGION,
}

if (process.env.S3_ENDPOINT) {
  s3Options.endpoint = process.env.S3_ENDPOINT
  s3Options.forcePathStyle = true
}

const s3Key = 'data.txt'
const s3Bucket = process.env.S3_BUCKET

const s3 = new S3(s3Options)
const buckets = await s3.listBuckets({})
const isBucketExists = buckets.Buckets.some(bucket => bucket.Name = s3Bucket)
if (!isBucketExists) {
  await s3.createBucket({
    Bucket: s3Bucket,
  })
}

const dataTxtFilePath = path.join(import.meta.dirname, 'data.txt')
const dataTxtStream = createReadStream(dataTxtFilePath)

await new Upload({
  client: s3,
  params: {
    Body: dataTxtStream,
    Bucket: s3Bucket,
    Key: s3Key,
    ContentType: 'text/plain; charset=utf-8',
  },
}).done()

console.info('Uploaded successfully.')

const destinationFilePath = path.join(import.meta.dirname, 'destination.txt')
const destinationStream = createWriteStream(destinationFilePath)

const s3Object = await s3.getObject({
  Bucket: s3Bucket,
  Key: s3Key,
})
await s3Object.Body.transformToWebStream().pipeTo(Writable.toWeb(destinationStream))

console.info('Downloaded successfully.')
