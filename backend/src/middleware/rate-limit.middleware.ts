import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 requêtes par 15 min
  message: {
    message: 'Trop de tentatives, réessayez plus tard.'
  },
  standardHeaders: true, 
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // max 100 requêtes par minute
  message: {
    message: 'Trop de requêtes, réessayez plus tard.'
  },
  standardHeaders: true, 
  legacyHeaders: false,
});
