import express from 'express';
import cors from 'cors';
import {
  INITIAL_BOOKS,
  INITIAL_MEMBERS,
  INITIAL_ISSUES,
  calculateFineDetails
} from './src/data/libraryData.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let books = [...INITIAL_BOOKS];
let members = [...INITIAL_MEMBERS];
let issues = [...INITIAL_ISSUES];

app.get('/api/books', (req, res) => {
  res.json(books);
});

app.post('/api/books', (req, res) => {
  const { title, author, category, synopsis } = req.body;
  const nextNum = 101 + books.length;
  const newBook = {
    id: `BK-${nextNum}`,
    title,
    author,
    category: category || 'Computer Science',
    isbn: `978-01430${nextNum}`,
    shelf: 'Rack A3 - Shelf 1',
    copies: 4,
    available: 4,
    rating: 4.8,
    synopsis: synopsis || 'Added to the Side Burn campus collection.'
  };
  books = [newBook, ...books];
  res.status(201).json(newBook);
});

app.get('/api/members', (req, res) => {
  res.json(members);
});

app.post('/api/members', (req, res) => {
  const { name, branch } = req.body;
  const nextNum = 101 + members.length;
  const newMember = {
    id: `SB-${nextNum}`,
    name,
    branch,
    joined: '2026-10-25',
    role: 'Student Member'
  };
  members = [newMember, ...members];
  res.status(201).json(newMember);
});

app.get('/api/issues', (req, res) => {
  res.json(issues);
});

app.get('/api/fine-check/:days', (req, res) => {
  const days = Number(req.params.days) || 0;
  res.json(calculateFineDetails(days, 15));
});

app.listen(PORT, () => {
  console.log(`Side Burn Library REST API running on http://localhost:${PORT}`);
});
