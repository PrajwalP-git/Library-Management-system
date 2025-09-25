const express= require('express');
const router= express.Router();
const multer= require('multer');
const path= require('path');
const bookcontroller= require('./bookcontroller');
const { validateBook, validateUpdateBook }= require('./bookValidation');
const handleValidationErrors= require('../middleware/validationHandler');

const storage= multer.diskStorage({
    destination: (req, file, cb)=> cb(null, path.join(__dirname,'..','Uploads','books')),
    filename: (req,file,cb)=> cb(null, Date.now()+ path.extname(file.originalname))
});

const upload= multer({storage});


router.post('/',validateBook,handleValidationErrors, bookcontroller.createBook);
router.get('/', bookcontroller.getAllBooks);
router.get('/:id', bookcontroller.getBookById);
router.put('/:id', (req, res, next) => {
    console.log("Raw Request Body:", req.body);
    next();
}, validateUpdateBook, handleValidationErrors, bookcontroller.updateBook);
router.delete('/:id', bookcontroller.deleteBook);

module.exports=router;