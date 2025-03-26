const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");

// Middleware
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const bannerRoutes = require("./routes/bannerRoutes");
const productRoutes = require('./routes/productRoutes');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONT_URL,  // Frontend URL (Adjust in production)
    credentials: true,  // Allow cookies to be sent
}));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use("/uploads", express.static("uploads"));
app.use('/uploads/products', express.static('uploads/products'));
app.use('/uploads/banners', express.static('uploads/banners'));



// Routes
app.use('/api/users', userRoutes);
app.use('/api', profileRoutes);
app.use("/api/banners", bannerRoutes);
app.use('/api/products', productRoutes);



// Home Route
app.get('/', (req, res) => {
    try {
        res.send('Hello, Welcome to ecom');
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
