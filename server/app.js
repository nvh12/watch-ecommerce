const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const homeRoutes  = require('./routes/homeRoutes');
const browseRoutes = require('./routes/browseRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173' 
}));

app.use(express.json());

connectDB();

// Register Routes
app.use('/', homeRoutes);
app.use('/browse', browseRoutes);
app.use('/product', productRoutes);

module.exports = app;
