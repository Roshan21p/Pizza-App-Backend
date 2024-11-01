<<<<<<< HEAD
=======
const express = require('express');
const { addProduct, getProduct, deleteProduct } = require('../controllers/productController');
const uploader = require('../middleware/multerMiddleware');
const { isLoggedIn, isAdmin } = require('../validation/authValidator');

const productRouter = express.Router();

productRouter.post('/', 
    isLoggedIn,
    isAdmin,
    uploader.single('productImage'),
    addProduct
    );
    
productRouter.get('/:id', getProduct)
productRouter.delete('/:id', deleteProduct)

module.exports = productRouter;
>>>>>>> c7aa9e8 (Modified backend)
