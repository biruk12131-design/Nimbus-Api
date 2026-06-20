import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { books, Book } from '../models/Book.js';
import { authenticate } from '../middleware/auth.js'; // Webhook usually uses different auth but request says protected
import { validateSchema } from '../middleware/validate.js';

export const webhooksRouter = Router();

const webhookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  isbn: z.string(),
  price: z.number().positive(),
  genre: z.string(),
  description: z.string(),
  tags: z.array(z.string())
});

webhooksRouter.post('/book-published', authenticate, validateSchema(webhookSchema), (req: Request, res: Response) => {
  const payload = req.body;
  
  const newBook: Book = {
    id: uuidv4(),
    ...payload,
    publishedDate: new Date().toISOString(),
    stock: 100 // default stock for new publish
  };
  
  books.push(newBook);
  
  res.status(202).json({ message: 'Webhook accepted', bookId: newBook.id });
});
