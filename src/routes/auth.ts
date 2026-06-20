import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { users } from '../models/User.js';
import { validateSchema } from '../middleware/validate.js';
import { loginRateLimiter } from '../middleware/rateLimiter.js';

export const authRouter = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

authRouter.post('/register', validateSchema(registerSchema), async (req: Request, res: Response): Promise<any> => {
  const { name, email, password } = req.body;

  if (users.some(u => u.email === email)) {
    return res.status(409).json({ error: { message: 'Email already in use', statusCode: 409 } });
  }

  const role: 'admin' | 'user' = users.length === 0 ? 'admin' : 'user';
  const passwordHash = await bcrypt.hash(password, 10);
  
  const newUser = {
    id: uuidv4(),
    name,
    email,
    passwordHash,
    role,
    avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || 'nimbus-secret-2026', { expiresIn: '1d' });
  
  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatarUrl: newUser.avatarUrl,
      createdAt: newUser.createdAt
    }
  });
});

authRouter.post('/login', loginRateLimiter, validateSchema(loginSchema), async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: { message: 'Invalid credentials', statusCode: 401 } });
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ error: { message: 'Invalid credentials', statusCode: 401 } });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'nimbus-secret-2026', { expiresIn: '1d' });

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt
    }
  });
});
