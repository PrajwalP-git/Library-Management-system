const express = require("express");
const router = express.Router();
const statusController = require("./statuscontroller");
const { validateBorrow, validateReturn }= require('./statusValidation');
const handleValidationErrors= require('../middleware/validationHandler');
const { authMiddleware, adminMiddleware } = require("../Users/userMiddleware");

router.post("/borrow", authMiddleware, validateBorrow, handleValidationErrors, statusController.borrowBook);
router.patch("/return/:id", authMiddleware, validateReturn, handleValidationErrors, statusController.returnBook);
router.get("/", authMiddleware, adminMiddleware, statusController.getAllStatus);
router.get("/:id", authMiddleware, adminMiddleware, statusController.getStatusById);
router.get("/user/:id", authMiddleware, statusController.getBorrowedBooks);


module.exports = router;