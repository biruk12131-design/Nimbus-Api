import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import helmet from 'helmet';

import { seedData } from './data/seed.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalRateLimiter } from './middleware/rateLimiter.js';
import { authRouter } from './routes/auth.js';
import { booksRouter } from './routes/books.js';
import { ordersRouter } from './routes/orders.js';
import { webhooksRouter } from './routes/webhooks.js';
import { adminRouter } from './routes/admin.js';

const app = express();

app.use(helmet({
  contentSecurityPolicy: false, // Disabling CSP for simpler local development, especially with CDN links via script tag
}));
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:3000', 'https://trusted-bookstore.com'];
    if (process.env.APP_URL) {
      allowedOrigins.push(process.env.APP_URL);
    }
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'If-None-Match']
}));
app.use(express.json());
app.use(compression({ threshold: 1024 })); // compress responses > 1 KB
app.use(morgan(':date[iso] :method :url :status - :response-time ms'));
app.use(requestLogger);
app.use(generalRateLimiter);

// Seed data
seedData().catch(console.error);

// Root HTML
app.get('/', (req: Request, res: Response) => {
  res.send(`
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nimbus API</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-gray-50 flex items-center justify-center min-h-screen text-gray-800">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center space-y-6">
      <div class="flex justify-center">
        <svg width="120" height="120" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#8ba4f9" />
              <stop offset="100%" stop-color="#4a6cf7" />
            </linearGradient>
            <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fbd043" />
              <stop offset="100%" stop-color="#f59e0b" />
            </linearGradient>
          </defs>
          <path d="M 60 110 A 30 30 0 0 1 60 50 A 40 40 0 0 1 130 40 A 35 35 0 0 1 160 100 A 30 30 0 0 1 140 150 L 50 150 A 30 30 0 0 1 60 110 Z" fill="url(#cloudGrad)" opacity="0.9"/>
          <path d="M 120 45 L 80 110 L 105 110 L 90 175 L 140 100 L 110 100 Z" fill="url(#boltGrad)" stroke="#fff" stroke-width="2"/>
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Welcome to Nimbus API</h1>
      <p class="text-gray-500">Your Cloud-Native Bookstore API</p>
      
      <div class="flex flex-col sm:flex-row gap-4 pt-4">
        <a href="/api-docs" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition">Swagger Docs</a>
        <a href="/health" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition">Health Status</a>
      </div>
      
      <footer class="pt-8 text-xs text-gray-400">
        Built with Express & TypeScript
      </footer>
    </div>
  </body>
</html>
  `);
});

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    version: '1.0.0',
    memoryUsage: process.memoryUsage()
  });
});

// Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nimbus API',
      version: '1.0.0',
      description: 'Cloud-native bookstore API'
    },
    servers: [
      { url: '/api/v1', description: 'v1 API' },
      { url: '/api', description: 'Legacy API' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js']
};
let openapiData: any;
try {
  openapiData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/swagger/openapi.json'), 'utf-8'));
} catch (e) {
  try {
     openapiData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'dist/swagger/openapi.json'), 'utf-8'));
  } catch (err) {
     openapiData = {};
  }
}
const swaggerDocs: any = swaggerJsDoc(swaggerOptions);
// Merge with JSON data if provided manually, else use JSDoc
const mergedDocs = { ...openapiData, ...swaggerDocs, paths: { ...openapiData.paths, ...swaggerDocs.paths }, components: { ...openapiData.components, ...swaggerDocs.components } };

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(mergedDocs));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(mergedDocs));


// API Routes
app.use('/api/auth', authRouter);

// Legacy books route
const legacyBooksRouter = express.Router();
legacyBooksRouter.use((req, res, next) => {
  res.setHeader('X-Deprecation', 'true');
  next();
});
legacyBooksRouter.use('/', booksRouter);
app.use('/api/books', legacyBooksRouter);

// v1 API Routes
const v1Router = express.Router();

// Versioning middleware
v1Router.use((req: Request, res: Response, next: NextFunction): any => {
  const version = req.headers['accept-version'];
  if (version && version !== 'v1') {
    return res.status(406).json({ error: { message: 'Unsupported API version. Expected v1.', statusCode: 406 } });
  }
  next();
});

v1Router.use('/books', booksRouter);
v1Router.use('/orders', ordersRouter);
v1Router.use('/webhooks', webhooksRouter);
v1Router.use('/admin', adminRouter);

app.use('/api/v1', v1Router);

app.use(errorHandler);

export { app };

if (process.env.NODE_ENV !== 'test' && !process.env.LAMBDA_TASK_ROOT) {
  const PORT = Number(process.env.PORT) || 3000;
  // Use 0.0.0.0 for docker environments
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });

  const handleShutdown = (signal: string) => {
    console.log(`${signal} received: closing server connections...`);
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}
