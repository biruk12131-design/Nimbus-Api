import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { users } from '../models/User.js';
import { books } from '../models/Book.js';

export async function seedData() {
  if (users.length > 0) return; // Already seeded

  // Create Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  users.push({
    id: uuidv4(),
    name: 'Admin User',
    email: 'admin@nimbus.com',
    passwordHash: adminPassword,
    role: 'admin',
    avatarUrl: 'https://i.pravatar.cc/150?u=admin',
    createdAt: new Date().toISOString()
  });

  const userPassword = await bcrypt.hash('user123', 10);
  users.push({
    id: uuidv4(),
    name: 'Regular User',
    email: 'user@nimbus.com',
    passwordHash: userPassword,
    role: 'user',
    avatarUrl: 'https://i.pravatar.cc/150?u=user',
    createdAt: new Date().toISOString()
  });

  users.push({
    id: uuidv4(),
    name: 'Jane Doe',
    email: 'jane@nimbus.com',
    passwordHash: userPassword,
    role: 'user',
    avatarUrl: 'https://i.pravatar.cc/150?u=jane',
    createdAt: new Date().toISOString()
  });

  // Create 25 Books
  const genres = ['fiction', 'non-fiction', 'sci-fi', 'fantasy', 'mystery'];
  for (let i = 1; i <= 25; i++) {
    books.push({
      id: uuidv4(),
      title: `Book Title ${i}`,
      author: `Author ${i}`,
      isbn: `978-3-16-148410-${i}`,
      price: Math.floor(Math.random() * 40) + 10,
      genre: genres[i % genres.length],
      publishedDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      stock: Math.floor(Math.random() * 50) + 1,
      description: `A fascinating description for book ${i}.`,
      tags: ['bestseller', genres[i % genres.length]]
    });
  }
}
