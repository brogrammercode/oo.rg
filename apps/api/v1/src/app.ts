import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import logger from './utils/logger.js';
import { HttpStatus } from './constants/http-status.js';
import config from './core/config.js';
import errorHandler from './middlewares/error.middleware.js';
import routes from './routes/index.js';

export const createApp = (): Application => {
    const app = express();

    app.use(helmet());

    app.use(cors({
        origin: config.CORS_ORIGIN,
        credentials: true,
    }));

    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use('/uploads', express.static('uploads'));

    app.use((req, _res, next) => {
        logger.info(`${req.method} ${req.url}`);
        next();
    });

    app.get('/', (_req: Request, res: Response) => {
        res.status(HttpStatus.OK).json({
            status: 'success',
            message: `HRM API v1 running on port ${config.PORT}`,
        });
    });

    app.use('/api/v1', routes);


    app.use(errorHandler);

    return app;
};

export default createApp;
