const express = require('express');
const cors= require('cors');
const path= require('path');
const dotenv = require('dotenv');
const db = require('./db');
const userRoutes= require('./Users/userRoutes');
const bookRoutes= require('./Books/bookRoutes');
const genreroutes= require('./Genres/genreroutes');
const statusRoutes= require('./Status/statusRoutes');
const booksearchRoutes= require('./Search/booksearchRoutes');
const finesRoutes= require('./Fines/finesRoutes');


dotenv.config();

const app = express();
app.use(express.json());
const corsOptions= {
    origin: 'http://localhost:5173'
};
app.use(cors(corsOptions));


app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/Uploads', express.static(path.join(__dirname,'Uploads')));
app.use('/api/genres', genreroutes);
app.use('/api/status', statusRoutes);
app.use('/api/booksearch', booksearchRoutes);
app.use('/api/fines', finesRoutes);


app.get('/', (req,res)=>{
    res.send('Library Management System API running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
});