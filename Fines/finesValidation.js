const { body, param }= require("express-validator");

const validateStatusId= [
  param("status_id").notEmpty().withMessage("Status ID is required")
    .isInt({min:1}).withMessage("Status ID must be an positive integer"),
];

const validateUpdateFine= [
  body("is_paid").notEmpty().withMessage("is_paid is required").isIn([0,1]),
];

module.exports= {validateStatusId, validateUpdateFine};