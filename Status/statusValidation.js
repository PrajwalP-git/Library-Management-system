const { body, param }= require("express-validator");

const validateBorrow= [
    body("user_id").notEmpty().withMessage("user_id is required")
      .isInt({min:1}).withMessage("user_id must be an positive integer"),

    body("book_id").notEmpty().withMessage("book_id is required")
      .isInt({min:1}).withMessage("book_id must be an positive integer"),
];

const validateReturn = [
  param("id").notEmpty().withMessage("Status ID is required")
    .isInt({min:1}).withMessage("Status ID must be a positive integer"),
];

module.exports = {validateBorrow, validateReturn};