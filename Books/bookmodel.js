const db = require('../db');

const Book = {
  async createBook(bookData) {
    const sql = `
      INSERT INTO books 
      (title, author, genre_id, price, qr_code_url, isbn, publisher, published_year, language, copies_total, copies_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      bookData.title,
      bookData.author,
      bookData.genre_id,
      bookData.price,
      bookData.qr_code_url,
      bookData.isbn,
      bookData.publisher,
      bookData.published_year,
      bookData.language,
      bookData.copies_total,
      bookData.copies_available,
    ];
    const [result] = await db.query(sql, values);
    return result;
  },

  async getAllBooks() {
    const [rows] = await db.query('SELECT * FROM books');
    return rows;
  },

  async getBookById(id) {
    const [rows] = await db.query('SELECT * FROM books WHERE book_id = ?', [id]);
    return rows[0];
  },

  async updateBook(id, bookData) {
    const sql = `
      UPDATE books 
      SET title=?, author=?, genre_id=?, price=?, qr_code_url=?, isbn=?, publisher=?, published_year=?, language=?, copies_total=?, copies_available=?, updated_at=NOW()
      WHERE book_id=?
    `;
    const values = [
      bookData.title,
      bookData.author,
      bookData.genre_id,
      bookData.price,
      bookData.qr_code_url,
      bookData.isbn,
      bookData.publisher,
      bookData.published_year,
      bookData.language,
      bookData.copies_total,
      bookData.copies_available,
      id,
    ];
    const [result] = await db.query(sql, values);
    return result;
  },

  async deleteBook(id) {
    const [result] = await db.query('DELETE FROM books WHERE book_id=?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = Book;