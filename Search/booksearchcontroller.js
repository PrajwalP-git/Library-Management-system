const BookSearch = require('./booksearchmodel');

exports.searchBooks = async (req, res) => {
  try {
    const filters = {
      title: req.query.title,
      author: req.query.author,
      genre_id: req.query.genre_id,
      is_available: req.query.is_available ? req.query.is_available === 'true' : null
    };

    const results = await BookSearch.search(filters);
    res.json(results);
  } catch (err) {
    console.error("Error in searchBooks:", err);
    res.status(500).json({ error: "Failed to perform search." });
  }
};