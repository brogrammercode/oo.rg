import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(Number).default(3001),
    BACKEND_URL: z.string().url().default('http://localhost:3001'),

    DB_STRING: z.string().min(1),

    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().default('7d'),
    JWT_REFRESH_SECRET: z.string().min(32),
    JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

    CORS_ORIGIN: z.string().transform(str => str.split(',')),

    RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default(900000),
    RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default(100),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('Environment validation failed:', parsedEnv.error.format());
    process.exit(1);
}

export const config = parsedEnv.data;

export default config;
