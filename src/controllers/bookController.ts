import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import NodeCache from 'node-cache';
import { books, Book } from '../models/Book.js';
import { AuthRequest } from '../middleware/auth.js';

const cache = new NodeCache({ stdTTL: 60 }); // 60 seconds TTL

const generateETag = (data: any) => {
  return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
};

export const getBooks = (req: Request, res: Response): any => {
  const cacheKey = req.originalUrl || req.url;
  const cachedResponse = cache.get(cacheKey);

  if (cachedResponse) {
    const { data, eTag } = cachedResponse as any;
    if (req.headers['if-none-match'] === eTag) {
      return res.status(304).end();
    }
    res.setHeader('ETag', eTag);
    res.setHeader('X-Total-Count', data.pagination.totalItems.toString());
    return res.json(data);
  }

  let result = [...books];

  // Filtering
  const genre = req.query.genre as string;
  if (genre) {
    result = result.filter(b => b.genre.toLowerCase() === genre.toLowerCase());
  }
  
  const minPrice = parseFloat(req.query.minPrice as string);
  if (!isNaN(minPrice)) result = result.filter(b => b.price >= minPrice);
  
  const maxPrice = parseFloat(req.query.maxPrice as string);
  if (!isNaN(maxPrice)) result = result.filter(b => b.price <= maxPrice);

  const search = req.query.search as string;
  if (search) {
    const s = search.toLowerCase();
    result = result.filter(b => b.title.toLowerCase().includes(s) || b.author.toLowerCase().includes(s));
  }

  // Sorting
  const sort = req.query.sort as string;
  const order = req.query.order === 'desc' ? -1 : 1;
  if (sort && ['price', 'publishedDate', 'title', 'stock'].includes(sort)) {
    result.sort((a: any, b: any) => {
      if (a[sort] < b[sort]) return -1 * order;
      if (a[sort] > b[sort]) return 1 * order;
      return 0;
    });
  }

  // Pagination
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const totalItems = result.length;
  const totalPages = Math.ceil(totalItems / limit);

  const paginatedBooks = result.slice(startIndex, endIndex);

  // ETag conditional request
  const eTag = generateETag(paginatedBooks);
  if (req.headers['if-none-match'] === eTag) {
    return res.status(304).end();
  }

  res.setHeader('ETag', eTag);
  res.setHeader('X-Total-Count', totalItems.toString());

  const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
  const searchParams = new URLSearchParams(req.query as any);
  
  const buildLink = (p: number) => {
    searchParams.set('page', p.toString());
    return `${baseUrl}?${searchParams.toString()}`;
  };

  const responseData = {
    data: paginatedBooks,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      links: {
        first: buildLink(1),
        prev: page > 1 ? buildLink(page - 1) : null,
        next: page < totalPages ? buildLink(page + 1) : null,
        last: buildLink(totalPages)
      }
    }
  };

  // set to cache
  cache.set(cacheKey, { data: responseData, eTag });

  res.json(responseData);
};

export const getBookById = (req: Request, res: Response): any => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ error: { message: 'Book not found', statusCode: 404 } });
  }

  const eTag = generateETag(book);
  if (req.headers['if-none-match'] === eTag) {
    return res.status(304).end();
  }

  res.setHeader('ETag', eTag);
  res.json(book);
};

export const createBook = (req: AuthRequest, res: Response): any => {
  const newBook: Book = {
    id: uuidv4(),
    ...req.body
  };
  books.push(newBook);
  res.status(201).json(newBook);
};

export const updateBook = (req: AuthRequest, res: Response): any => {
  const index = books.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: { message: 'Book not found', statusCode: 404 } });
  }
  
  books[index] = { ...books[index], ...req.body };
  res.json(books[index]);
};

export const deleteBook = (req: AuthRequest, res: Response): any => {
  const index = books.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: { message: 'Book not found', statusCode: 404 } });
  }
  
  books.splice(index, 1);
  res.status(204).send();
};

export const fuzzySearchBooks = (req: Request, res: Response): any => {
  const q = req.query.q as string || '';
  if (!q) {
    return res.status(400).json({ error: { message: 'Search term "q" is required', statusCode: 400 } });
  }

  try {
    const regex = new RegExp(q, 'i');
    const matchedBooks = books.filter(b => regex.test(b.title) || regex.test(b.author));
    res.json(matchedBooks);
  } catch (err) {
    return res.status(400).json({ error: { message: 'Invalid search term', statusCode: 400 } });
  }
};
