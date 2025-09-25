const express = require('express');
const router = express.Router();
const booksearchcontroller = require('./booksearchcontroller');

router.get('/', booksearchcontroller.searchBooks);

module.exports = router;
