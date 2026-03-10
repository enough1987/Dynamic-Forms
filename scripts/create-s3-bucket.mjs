/**
 * Creates and configures an S3 bucket for static website hosting.
 * Idempotent — safe to run on every deploy.
 *
 * Required env vars:
 *   AWS_REGION       e.g. "us-east-1"
 *   S3_BUCKET_NAME   e.g. "dynamicform"
 */

import {
  S3Client,
  CreateBucketCommand,
  DeletePublicAccessBlockCommand,
  PutBucketWebsiteCommand,
  PutBucketPolicyCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3'

const region = process.env.AWS_REGION
const bucket = process.env.S3_BUCKET_NAME

if (!region || !bucket) {
  console.error('Error: AWS_REGION and S3_BUCKET_NAME must be set.')
  process.exit(1)
}

const s3 = new S3Client({ region })

async function bucketExists() {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }))
    return true
  } catch {
    return false
  }
}

async function createBucket() {
  // us-east-1 must NOT include LocationConstraint
  const params =
    region === 'us-east-1'
      ? { Bucket: bucket }
      : { Bucket: bucket, CreateBucketConfiguration: { LocationConstraint: region } }

  await s3.send(new CreateBucketCommand(params))
  console.log(`Bucket "${bucket}" created.`)
}

async function removePublicAccessBlock() {
  await s3.send(new DeletePublicAccessBlockCommand({ Bucket: bucket }))
  console.log('Public access block removed.')
}

async function configureBucketPolicy() {
  const policy = JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'PublicReadGetObject',
        Effect: 'Allow',
        Principal: '*',
        Action: 's3:GetObject',
        Resource: `arn:aws:s3:::${bucket}/*`,
      },
    ],
  })
  await s3.send(new PutBucketPolicyCommand({ Bucket: bucket, Policy: policy }))
  console.log('Bucket policy applied (public read).')
}

async function configureStaticWebsite() {
  await s3.send(
    new PutBucketWebsiteCommand({
      Bucket: bucket,
      WebsiteConfiguration: {
        IndexDocument: { Suffix: 'index.html' },
        ErrorDocument: { Key: 'index.html' }, // SPA fallback
      },
    }),
  )
  console.log('Static website hosting configured.')
}

async function main() {
  console.log(`\nConfiguring S3 bucket: ${bucket} (${region})`)

  if (await bucketExists()) {
    console.log(`Bucket "${bucket}" already exists — skipping creation.`)
  } else {
    await createBucket()
  }

  await removePublicAccessBlock()
  await configureBucketPolicy()
  await configureStaticWebsite()

  const url =
    region === 'us-east-1'
      ? `http://${bucket}.s3-website-us-east-1.amazonaws.com`
      : `http://${bucket}.s3-website.${region}.amazonaws.com`

  console.log(`\nBucket ready. Website URL:\n  ${url}\n`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
