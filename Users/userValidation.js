const { body, param } =require("express-validator");

const validateRegister = [
  body("name")
    .notEmpty().withMessage("name is required")
    .matches(/^[A-Za-z\s.'-]+$/).withMessage("name can only contain letters, spaces, periods, hyphens and single quotes"),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage("Password must be at least 8 chars, include uppercase, lowercase, number, and special character"),
];

const validateLogin= [
    body("email").notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Invalid email format"),

    body("password").notEmpty().withMessage("Password is required")
];

const validatePromoteUser=[
    param("id").isInt().withMessage("User ID must be a valid integer"),
];

const validateDemoteUser=[
    param("id").isInt().withMessage("User ID must be a valid integer")
];

const validateChangePassword = [
    body("currentPassword")
        .notEmpty().withMessage("Current password is required"),
    body("newPassword")
        .notEmpty().withMessage("New password is required")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage("New password must be at least 8 chars, include uppercase, lowercase, number, and special character"),
];

const validateForgotPassword = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),
];

const validateResetPassword = [
  body("token")
    .notEmpty().withMessage("Reset token is required"),
  body("newPassword")
    .notEmpty().withMessage("New password is required")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage("New password must be at least 8 chars, include uppercase, lowercase, number, and special character"),
];

module.exports= {
    validateRegister,
    validateLogin,
    validatePromoteUser,
    validateDemoteUser,
    validateChangePassword,
    validateForgotPassword,
    validateResetPassword
};