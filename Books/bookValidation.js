const { body } = require("express-validator");

const isISBN = (value) => {
    const isbnRegex = /^(978|979)?-?\d{1,5}-?\d{1,7}-?\d{1,6}-?(\d|X)$/;
    if (!value) return true; 
    if (isbnRegex.test(value.replace(/-/g, ''))) {
        return true;
    }
    throw new Error('Invalid ISBN format');
};

const validateBook = [
    body("title")
        .notEmpty().withMessage("Title is required")
        .isLength({ min: 3 }).withMessage("Title must be at least 3 characters long")
        .matches(/^[A-Za-z0-9\s:/,&-]+$/).withMessage("Title must be letters, numbers, and common punctuation"),
    body("author")
        .notEmpty().withMessage("Author name is required")
        .isLength({ min: 3 }).withMessage("Author name must be at least 3 characters long")
        .matches(/^[A-Za-z\s.,'-]+$/).withMessage("Author name can only contain letters, spaces, hyphens, and periods"),
    body("genre_id")
        .notEmpty().withMessage("Genre ID is required")
        .isInt({ min: 1 }).withMessage("Genre ID must be a valid positive integer"),
    body("price")
        .notEmpty().withMessage("Price is required")
        .isFloat({ min: 0 }).withMessage("Price must be a non-negative number"),
    body("isbn")
        .notEmpty().withMessage("ISBN is required")
        .custom(isISBN),
    body("publisher")
        .notEmpty().withMessage("Publisher name is required")
        .isLength({ min: 2 }).withMessage("Publisher name must be at least 2 characters long")
        .matches(/^[A-Za-z0-9\s.'-]+$/).withMessage("Publisher name can only contain letters, numbers, spaces, hyphens, and periods"),
    body("published_year")
        .notEmpty().withMessage("Published year is required")
        .isInt({ min: 1000, max: new Date().getFullYear() }).withMessage("Published year must be a valid year"),
    body("language")
        .notEmpty().withMessage("Language is required")
        .isAlpha().withMessage("Language must be letters only"),
    body("copies_total")
        .notEmpty().withMessage("Copies total is required")
        .isInt({ min: 0 }).withMessage("Copies total must be a non-negative integer"),
    body("copies_available")
        .notEmpty().withMessage("Copies available is required")
        .isInt({ min: 0 }).withMessage("Copies available must be a non-negative integer"),
];

const validateUpdateBook = [
    body("title").optional()
        .isLength({ min: 3 }).withMessage("Title must be at least 3 characters long")
        .matches(/^[A-Za-z0-9\s:/,&-]+$/).withMessage("Title must be letters, numbers, spaces, or common punctuation"),
    body("author").optional()
        .isLength({ min: 3 }).withMessage("Author name must be at least 3 characters long")
        .matches(/^[A-Za-z\s.,'-]+$/).withMessage("Author name can only contain letters, spaces, hyphens, and periods"),
    body("genre_id").optional()
        .isInt({ min: 1 }).withMessage("Genre ID must be a valid positive integer"),
    body("price").optional()
        .isFloat({ min: 0 }).withMessage("Price must be a non-negative number"),
    body("isbn").optional()
        .custom(isISBN),
    body("publisher").optional()
        .isLength({ min: 2 }).withMessage("Publisher name must be at least 2 characters long")
        .matches(/^[A-Za-z0-9\s.'-]+$/).withMessage("Publisher name can only contain letters, numbers, spaces, hyphens, and periods"),
    body("published_year").optional()
        .isInt({ min: 1000, max: new Date().getFullYear() }).withMessage("Published year must be a valid year"),
    body("language").optional()
        .isAlpha().withMessage("Language must be letters only"),
    body("copies_total").optional()
        .isInt({ min: 0 }).withMessage("Copies total must be a non-negative integer"),
    body("copies_available").optional()
        .isInt({ min: 0 }).withMessage("Copies available must be a non-negative integer")
        .custom(async (value, { req }) => {
            if (req.body.copies_total !== undefined) {
                if (value > req.body.copies_total) {
                    throw new Error('Available copies cannot be greater than total copies');
                }
            } else {
                const bookId = req.params.id;
                const [rows] = await db.query('SELECT copies_total FROM books WHERE book_id = ?', [bookId]);
                if (rows.length > 0 && value > rows[0].copies_total) {
                    throw new Error('Available copies cannot be greater than total copies');
                }
            }
            return true;
        }),
];

module.exports = { validateBook, validateUpdateBook };