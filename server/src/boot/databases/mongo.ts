import logger from '../../middlewares/winston';
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blog';

if (!MONGO_URI) {
  logger.error('Mongo URI is required');
  process.exit(1);
}

const connectMongo = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

export default connectMongo;
