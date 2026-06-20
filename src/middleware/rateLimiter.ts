import rateLimit from 'express-rate-limit';

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // limit each IP to 100 requests per windowMs
  message: { error: { message: 'Too many requests, please try again later.', statusCode: 429 } },
  standardHeaders: 'draft-7', // rate limit headers
  legacyHeaders: false,
});

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  message: { error: { message: 'Too many login attempts, please try again after 15 minutes', statusCode: 429 } },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
