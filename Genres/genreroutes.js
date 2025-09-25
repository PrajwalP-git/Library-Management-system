const express = require('express');
const router = express.Router();
const genrecontroller = require('./genrecontroller');
const { validateGenre, validateUpdateGenre } = require('./genreValidation');
const handleValidationErrors = require('../middleware/validationHandler');
const { authMiddleware } = require('../Users/userMiddleware');

router.post('/', authMiddleware, validateGenre, handleValidationErrors, genrecontroller.create);
router.get('/', genrecontroller.getAll);
router.get('/:id', genrecontroller.getById);
router.put('/:id', authMiddleware, validateUpdateGenre, handleValidationErrors, genrecontroller.update);
router.delete('/:id', authMiddleware, genrecontroller.remove);

module.exports = router;