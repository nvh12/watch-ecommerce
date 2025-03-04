const express = require('express');
const cors = require('cors');

const homeRoutes = require('./routes/homeRoutes');
const browseRoutes = require('./routes/browseRoutes');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173' 
}));

app.use(express.json());

// Register Routes
app.use('/', homeRoutes);
app.use('/browse', browseRoutes);

module.exports = app;
