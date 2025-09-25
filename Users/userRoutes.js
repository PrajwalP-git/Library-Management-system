const express= require("express");
const router= express.Router();
const usercontroller= require('./usercontroller');
const { authMiddleware, adminMiddleware }= require("./userMiddleware");
const { validateRegister, validateLogin,validateDemoteUser, validatePromoteUser, validateChangePassword, validateForgotPassword, validateResetPassword }= require("./userValidation");
const handleValidationErrors= require('../middleware/validationHandler');

router.post('/register', validateRegister, handleValidationErrors, usercontroller.register);
router.post('/login', validateLogin, handleValidationErrors, usercontroller.login);
router.get('/', authMiddleware, adminMiddleware, usercontroller.getAllUsers);
router.get('/:id', usercontroller.getUserById);
router.patch('/promote/:id', authMiddleware, adminMiddleware, validatePromoteUser, handleValidationErrors, usercontroller.promoteUser);
router.patch('/demote/:id', authMiddleware, adminMiddleware, validateDemoteUser, handleValidationErrors, usercontroller.demoteUser);
router.patch('/change-password', authMiddleware, validateChangePassword, handleValidationErrors, usercontroller.changePassword);
router.post('/forgot-password', validateForgotPassword, handleValidationErrors, usercontroller.forgotPassword);
router.post('/reset-password', validateResetPassword, handleValidationErrors, usercontroller.resetPassword);

module.exports=router;