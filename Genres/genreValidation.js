const { body, param } = require("express-validator");

const validateGenre = [
    body("name")
        .notEmpty().withMessage("Genre name is required.")
        .isLength({min:3}).withMessage("Genre name must be valid with 3 characters")
        .matches(/^[A-Za-z\s/&]+$/).withMessage("Genre must be letters, spaces, forward slashes, and ampersands only"),
];

const validateUpdateGenre = [
    body("name").optional()
        .matches(/^[A-Za-z\s/&]+$/).withMessage("Genre must be letters, spaces, forward slashes, and ampersands only"),
];

module.exports= {validateGenre, validateUpdateGenre};