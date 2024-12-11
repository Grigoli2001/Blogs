import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import logger, { stream } from '../middlewares/winston';
import cookieParser from 'cookie-parser';

// dbs
import connectMongo from './databases/mongo';
import { connectFirebase } from './databases/firebase';

// custom middlwares
import notFound from '../middlewares/notFound';
import validator from '../middlewares/validator';
import healthCheck from '../middlewares/healthCheck';

// routes
import adminAuthRoutes from '../routes/adminAuth.routes';
import blogRoutes from '../routes/blog.routes';

const PORT = parseInt(process.env.PORT || '8080', 10);
const app = express();

// extending modules for typescript and nodemon to work together
declare module 'express-session' {
  export interface SessionData {
    user: {
      email?: string;
      _id?: string;
    };
  }
}

declare module 'jsonwebtoken' {
  export interface UserJwtPayload {
    user: {
      email: string;
      id: string;
    };
  }
}

export const registerCoreMiddleWare = (): Application => {
  try {
    app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, httpOnly: true },
      }),
    );
    app.use(morgan('combined', { stream }));
    app.use(express.json()); // returning middleware that only parses Json
    // cors should accept multiple origins
    app.use(
      cors({
        origin: [
          'http://localhost:3000',
          'http://localhost:5173',
          'http://localhost:4173',
          'http://localhost:3001',
          'http://localhost:3002',
          'http://localhost:3003',
          'http://localhost:3004',
          'http://localhost:3005',
          'http://localhost:3006',
        ],
        credentials: true,
      }),
    );
    app.use(helmet()); // enabling helmet -> setting response headers
    app.use(cookieParser());

    // custom middleware
    app.use(validator);
    app.use(healthCheck);

    // routes
    app.use('/api', adminAuthRoutes);
    app.use('/api', blogRoutes);
    // handling 404
    app.use(notFound);

    logger.http('Done registering all middlewares');

    return app;
  } catch (error) {
    logger.error('Error in registerCoreMiddleWare');
    logger.error(`Error: ${JSON.stringify(error, undefined, 2)}`);
    process.exit(1);
  }
};

// handling uncaught exceptions
const handleError = (): void => {
  process.on('uncaughtException', (err) => {
    logger.error(`UNCAUGHT_EXCEPTION OCCURED : ${JSON.stringify(err.stack)}`);
  });
};

// start applicatoin
export const startApp = async (): Promise<void> => {
  try {
    // connect to mongo
    await connectMongo();
    // connect to firebase
    connectFirebase();

    // register core application level middleware
    registerCoreMiddleWare();

    app.listen(PORT, '0.0.0.0', () => {
      logger.info('Listening on 0.0.0.0:' + PORT);
    });
    // exit on uncaught exception
    handleError();
  } catch (err) {
    logger.error(
      `startup :: Error while booting the applicaiton ${JSON.stringify(
        err,
        undefined,
        2,
      )}`,
    );
    throw err;
  }
};
