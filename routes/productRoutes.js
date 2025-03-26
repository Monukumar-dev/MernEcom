const express = require('express');
const upload = require('../middleware/upload');
const { addProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');

const router = express.Router();

router.post('/add', upload, addProduct);
router.put('/:id', upload, updateProduct);
router.post('/', getProducts);
router.get('/:id', getProductById);
router.delete('/:id', deleteProduct);

module.exports = router;
