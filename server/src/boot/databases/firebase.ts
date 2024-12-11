import admin from 'firebase-admin';
import logger from '../../middlewares/winston';
import firebaseConfig from '../../../firebase_config.json';
const connectFirebase = (): void => {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    logger.info('Firebase connected');
  } catch (err) {
    logger.error(`Connection error\n${err}\nCause: ${err.cause}`);
    process.exit(1);
  }
};

const getBucket = () => {
  logger.info('Getting bucket');
  return admin.storage().bucket();
};

export { connectFirebase, getBucket };
