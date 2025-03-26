const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';
        
        if (req.baseUrl.includes('/api/products')) {
            uploadPath = 'uploads/products/';
        } else if (req.baseUrl.includes('/api/banners')) {
            uploadPath = 'uploads/banners/';
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// const upload = multer({ storage: storage });

const upload = multer({ storage: storage }).fields([
    { name: 'coverImage', maxCount: 1 },  // Only 1 cover image
    { name: 'thumbImages', maxCount: 5 }   // Up to 5 thumbnail images
]);


module.exports = upload;
