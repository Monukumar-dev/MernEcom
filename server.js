const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); 

// Routes
app.use('/api/users', userRoutes);


// Home Route
app.get('/', (req, res) => {
    try {
        res.send('Hello, Vercel!');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});


// Catch-All Route for Undefined Routes
app.use((req, res) => {
    res.status(404).send('404: Not Found Undefined Routes Monu');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
