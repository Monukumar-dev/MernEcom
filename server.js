const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const cors = require('cors');
const cookieParser = require("cookie-parser");

dotenv.config();
connectDB();

const app = express();
//app.use(cors());
app.use(cors({
    origin: process.env.FRONT_URL,  // Frontend URL (Adjust in production)
    credentials: true,  // Allow cookies to be sent
}));
app.use(cookieParser());
app.use(express.json()); 

// Routes
app.use('/api/users', userRoutes);
app.use('/api', profileRoutes);



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
