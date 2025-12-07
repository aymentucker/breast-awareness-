import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const AWS_CONFIG = {
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
};

const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || 'azhar-breast-awareness-media';
const BUCKET_URL = `https://${BUCKET_NAME}.s3.${AWS_CONFIG.region}.amazonaws.com`;

const s3Client = new S3Client(AWS_CONFIG);

export interface UploadResult {
  url: string;
  key: string;
}

export async function uploadToS3(
  file: File,
  folder: string = 'uploads'
): Promise<UploadResult> {
  const timestamp = Date.now();
  const fileName = `${folder}/${timestamp}-${file.name}`;

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read',
    },
  });

  await upload.done();

  return {
    url: `${BUCKET_URL}/${fileName}`,
    key: fileName,
  };
}

export { s3Client, BUCKET_NAME, BUCKET_URL };
