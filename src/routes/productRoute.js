const express = require('express');
const {
  addProduct,
  getProduct,
  deleteProduct,
  getProducts,
  updateProduct
} = require('../controllers/productController');
const uploader = require('../middleware/multerMiddleware');
const { isLoggedIn, isAdmin } = require('../validation/authValidator');

const productRouter = express.Router();

productRouter.post(
  '/',
   isLoggedIn,
   isAdmin,
  uploader.single('productImage'),
  addProduct
);

productRouter.get('/:id', getProduct);
productRouter.get('/', getProducts);
productRouter.put('/:id',isLoggedIn,  isAdmin, uploader.single('productImage'), updateProduct);
productRouter.delete('/:id',isLoggedIn, isAdmin, deleteProduct);

module.exports = productRouter;
