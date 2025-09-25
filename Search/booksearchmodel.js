const db = require('../db');

const BookSearch = {
  async search(filters) {
    let query = `SELECT * FROM books WHERE 1=1`;
    const params = [];

    if (filters.title) {
      query += " AND title LIKE ?";
      params.push(`%${filters.title}%`);
    }
    if (filters.author) {
      query += " AND author LIKE ?";
      params.push(`%${filters.author}%`);
    }
    if (filters.genre_id) {
      query += " AND genre_id = ?";
      params.push(filters.genre_id);
    }
    if (filters.is_available === true) {
      query += " AND copies_available > 0";
    }

    const [rows] = await db.query(query, params);
    return rows;
  }
};

module.exports = BookSearch;