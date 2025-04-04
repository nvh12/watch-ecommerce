const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');

const homeRoutes  = require('./routes/homeRoutes');
const browseRoutes = require('./routes/browseRoutes');
const productRoutes = require('./routes/productRoutes');
const searchRoutes = require('./routes/searchRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

connectDB();


app.use('/', homeRoutes);
app.use('/browse', browseRoutes);
app.use('/product', productRoutes);
app.use('/search', searchRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

module.exports = app;
