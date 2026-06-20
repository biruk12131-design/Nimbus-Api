import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { orders, Order, OrderItem } from '../models/Order.js';
import { books } from '../models/Book.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { validateSchema } from '../middleware/validate.js';

export const ordersRouter = Router();

const orderSchema = z.object({
  items: z.array(z.object({
    bookId: z.string(),
    quantity: z.number().int().positive()
  })).min(1)
});

ordersRouter.post('/', authenticate, validateSchema(orderSchema), (req: AuthRequest, res: Response): any => {
  const { items } = req.body as { items: OrderItem[] };
  
  let total = 0;
  for (const item of items) {
    const book = books.find(b => b.id === item.bookId);
    if (!book) {
      return res.status(400).json({ error: { message: `Book with ID ${item.bookId} not found`, statusCode: 400 } });
    }
    if (book.stock < item.quantity) {
      return res.status(400).json({ error: { message: `Insufficient stock for ${book.title}`, statusCode: 400 } });
    }
    total += book.price * item.quantity;
  }

  // Deduct stock
  for (const item of items) {
    const book = books.find(b => b.id === item.bookId)!;
    book.stock -= item.quantity;
  }

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 14);

  const newOrder: Order = {
    id: uuidv4(),
    userId: req.user!.id,
    items,
    total,
    status: 'Processing',
    estimatedDeliveryDate: deliveryDate.toISOString(),
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);

  res.status(201).json(newOrder);
});

ordersRouter.get('/', authenticate, requireAdmin, (req: AuthRequest, res: Response) => {
  res.json(orders);
});

ordersRouter.get('/:id', authenticate, (req: AuthRequest, res: Response): any => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: { message: 'Order not found', statusCode: 404 } });
  }
  
  if (req.user!.role !== 'admin' && order.userId !== req.user!.id) {
    return res.status(403).json({ error: { message: 'Forbidden', statusCode: 403 } });
  }

  res.json(order);
});
