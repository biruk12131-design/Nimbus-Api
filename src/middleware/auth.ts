import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, users } from '../models/User.js';

export interface AuthRequest extends Request {
  user?: User;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: { message: 'Unauthorized', statusCode: 401 } });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'nimbus-secret-2026') as { id: string };
    const user = users.find(u => u.id === payload.id);
    if (!user) {
      return res.status(401).json({ error: { message: 'User not found', statusCode: 401 } });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: { message: 'Invalid token', statusCode: 401 } });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: { message: 'Forbidden: Admins only', statusCode: 403 } });
  }
  next();
}
