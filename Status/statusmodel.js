const db = require('../db');

const Status = {
  async createStatus(userId, bookId, borrowedAt) {
     const formattedBorrowedAt = new Date(borrowedAt).toISOString().slice(0, 19).replace('T', ' ');

    const sql = `
      INSERT INTO status (user_id, book_id, borrowed_at)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.query(sql, [userId, bookId, formattedBorrowedAt]);
    return result.insertId;
  },

  async updateStatus(statusId, statusData) {
    const { returned_at, is_returned } = statusData;
     const formattedReturnedAt = new Date(returned_at).toISOString().slice(0, 19).replace('T', ' ');

    const [result] = await db.query(
      "UPDATE status SET returned_at=?, is_returned=? WHERE status_id=?",
      [formattedReturnedAt, is_returned, statusId]
    );
    return result;
  },

  async getBorrowedBooksByUserId(userId) {
  const [rows] = await db.query(
    "SELECT * FROM status WHERE user_id = ?",
    [userId]
  );
  return rows;
},

  async getStatusById(id) {
    const [rows] = await db.query('SELECT * FROM status WHERE status_id=?', [id]);
    return rows[0];
  },

  async getAllStatus() {
    const [rows] = await db.query('SELECT * FROM status');
    return rows;
  },

  async updateBookCopies(bookId, change) {
    await db.query(
      "UPDATE books SET copies_available = copies_available + ? WHERE book_id = ?",
      [change, bookId]
    );
  },

  async getAvailableCopies(bookId) {
    const [rows] = await db.query(
      "SELECT copies_available FROM books WHERE book_id = ?",
      [bookId]
    );
    return rows[0];
  },
};

module.exports = Status;