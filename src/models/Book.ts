export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  price: number;
  genre: string;
  publishedDate: string;
  stock: number;
  description: string;
  tags: string[];
}

export const books: Book[] = [];
