import { Router } from 'express';
import { z } from 'zod';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validateSchema } from '../middleware/validate.js';
import * as bookController from '../controllers/bookController.js';

export const booksRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - isbn
 *         - price
 *         - genre
 *         - publishedDate
 *         - stock
 *         - description
 *         - tags
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The title of your book
 *         author:
 *           type: string
 *           description: The book author
 *         isbn:
 *           type: string
 *           description: ISBN number
 *         price:
 *           type: number
 *           description: Book price
 *         genre:
 *           type: string
 *         publishedDate:
 *           type: string
 *         stock:
 *           type: number
 *         description:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 */

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  isbn: z.string().min(10),
  price: z.number().positive(),
  genre: z.string().min(1),
  publishedDate: z.string(),
  stock: z.number().int().min(0),
  description: z.string(),
  tags: z.array(z.string())
});

/**
 * @swagger
 * /api/v1/books/search:
 *   get:
 *     summary: Fuzzy search books
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search term
 *     responses:
 *       200:
 *         description: List of matched books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
booksRouter.get('/search', bookController.fuzzySearchBooks);

/**
 * @swagger
 * /api/v1/books:
 *   get:
 *     summary: Returns the list of all the books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 */
booksRouter.get('/', bookController.getBooks);

/**
 * @swagger
 * /api/v1/books/{id}:
 *   get:
 *     summary: Get the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 */
booksRouter.get('/:id', bookController.getBookById);

/**
 * @swagger
 * /api/v1/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       403:
 *         description: Forbidden
 */
booksRouter.post('/', authenticate, requireAdmin, validateSchema(bookSchema), bookController.createBook);

/**
 * @swagger
 * /api/v1/books/{id}:
 *   put:
 *     summary: Update the book by the id
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The book was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 */
booksRouter.put('/:id', authenticate, requireAdmin, validateSchema(bookSchema), bookController.updateBook);

/**
 * @swagger
 * /api/v1/books/{id}:
 *   delete:
 *     summary: Remove the book by id
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       204:
 *         description: The book was deleted
 *       404:
 *         description: The book was not found
 */
booksRouter.delete('/:id', authenticate, requireAdmin, bookController.deleteBook);

