const express= require("express");
const router= express.Router();
const finescontroller= require('./finescontroller');
const {validateStatusId, validateUpdateFine}= require('./finesValidation');
const handleValidationErrors= require('../middleware/validationHandler');
const { authMiddleware, adminMiddleware } = require("../Users/userMiddleware");

router.post("/calculate/:status_id", authMiddleware, adminMiddleware, validateStatusId, handleValidationErrors, finescontroller.calculateFine);
router.get("/", authMiddleware, adminMiddleware, finescontroller.getAllFines);
router.patch("/:fine_id/pay", authMiddleware, finescontroller.payFine);

module.exports= router;