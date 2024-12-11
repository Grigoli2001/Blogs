import { getBucket } from '../boot/databases/firebase';
import logger from '../middlewares/winston';
import fs from 'fs';
const maxSizes = {
  image: 5000000, // 5MB
  video: 50000000, // 50MB
};

export const firebaseUpload = async (
  file: Express.Multer.File,
  userid: string,
  path: string,
): Promise<{ media: string; mimeType: string } | null> => {
  logger.info('firebaseUpload function invoked');
  if (!file) {
    return null;
  }

  const bucket = getBucket();
  const buffer = fs.readFileSync(file.path);

  if (!buffer) {
    throw new Error('No file buffer provided');
  }
  const filePath = `${userid}/${path}/${file.filename}`;
  const blob = bucket.file(filePath);

  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (err) => {
      logger.error('Blob stream error:', err);
      reject(new Error('Error uploading file to Firebase Storage'));
    });

    blobStream.on('finish', async () => {
      try {
        // Get a signed URL for the uploaded file
        // const [signedUrl] = await blob.getSignedUrl({
        //   action: 'read',
        //   expires: '03-09-2091', // Set an appropriate expiration date
        // });
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filePath)}?alt=media`;
        logger.info('File uploaded successfully. URL:', publicUrl);
        resolve({ media: publicUrl, mimeType: file.mimetype });
      } catch (err) {
        logger.error('Error getting signed URL:', err);
        reject(new Error('Failed to retrieve signed URL'));
      }
    });

    blobStream.end(buffer);
  });
};

export const validateFiles = async (files: Express.Multer.File[]) => {
  logger.info('Validating files');
  if (!files) {
    return null;
  }

  const filesArray = Object.values(files);
  if (!filesArray.length) {
    return null;
  }
  if (filesArray.length > 1) {
    throw new Error('Only one file is allowed');
  }
  const file = filesArray[0];
  if (file.size > maxSizes.image) {
    throw new Error('File size is too large');
  }
  if (!file.mimetype.includes('image')) {
    throw new Error('File is not an image');
  }
  logger.info('File have been validated successfully');
  return files;
};
