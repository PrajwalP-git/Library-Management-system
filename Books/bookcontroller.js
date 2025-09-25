const Book = require('./bookmodel');
const axios = require('axios');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '..', 'Uploads', 'books');
const qrDir = path.join(__dirname, '..', 'Uploads', 'qrcodes');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });

const generateQrCode = async (title, author) => {
  const qrCodePath = path.join(qrDir, `${Date.now()}_${title}.png`);
  await QRCode.toFile(qrCodePath, `${title} - ${author || ""}`);
  return `/uploads/qrcodes/${path.basename(qrCodePath)}`;
};

exports.createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      genre_id,
      price,
      isbn,
      publisher,
      published_year,
      language,
      copies_total,
    } = req.body;

    const qrCodeUrl = await generateQrCode(title, author);
    const copies_available = copies_total || 1;

    const newBook = await Book.createBook({
      title,
      author,
      genre_id,
      price,
      qr_code_url: qrCodeUrl,
      isbn,
      publisher,
      published_year,
      language,
      copies_total,
      copies_available,
    });

    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (err) {
    console.error("Error creating book:", err);
    res.status(500).json({ error: "Failed to add book" });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.getAllBooks();
    const formattedBooks = books.map(book => ({
      ...book,
      price: parseFloat(book.price),
      published_year: book.published_year ? parseInt(book.published_year, 10) : null,
      copies_total: book.copies_total ? parseInt(book.copies_total, 10) : null,
      copies_available: book.copies_available ? parseInt(book.copies_available, 10) : null,
    }));
    res.json(formattedBooks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.getBookById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    const formattedBook = {
      ...book,
      price: parseFloat(book.price),
      published_year: book.published_year ? parseInt(book.published_year, 10) : null,
      copies_total: book.copies_total ? parseInt(book.copies_total, 10) : null,
      copies_available: book.copies_available ? parseInt(book.copies_available, 10) : null,
    };
    res.json(formattedBook);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch book" });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const updateData = req.body;

    const existingBook = await Book.getBookById(bookId);
    if (!existingBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    const newCopiesTotal = updateData.copies_total !== undefined ? updateData.copies_total : existingBook.copies_total;
    const newCopiesAvailable = updateData.copies_available !== undefined ? updateData.copies_available : existingBook.copies_available;

    if (newCopiesAvailable > newCopiesTotal) {
      return res.status(400).json({ error: "Available copies cannot be greater than total copies." });
    }
    const newTitle = updateData.title || existingBook.title;
    const newAuthor = updateData.author || existingBook.author;
    updateData.qr_code_url = await generateQrCode(newTitle, newAuthor);
    
    const updatedBook = await Book.updateBook(bookId, updateData);
    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json({ message: "Book updated", book: updatedBook });
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(500).json({ error: "Failed to update book" });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const deleted = await Book.deleteBook(req.params.id);
    if (deleted) {
      res.json({ message: "Book deleted" });
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ error: "Failed to delete book" });
  }
};