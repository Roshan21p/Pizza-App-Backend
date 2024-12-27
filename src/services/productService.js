const cloudinary = require('../config/cloudinaryConfig');
const ProductRepository = require('../repositories/productRepository');
const fs = require('fs/promises');
const InternalServerError = require('../utils/internalServerError');
const NotFoundError = require('../utils/notFoundError');
const path = require('path');

async function createProduct(productDetails) {
  // 1. We should check if an image is coming to createthe product, then we should first upload it on cloudinary

  const imagePath = productDetails.imagePath;

  if (imagePath) {
    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(imagePath, {
        folder: 'pizza/products'
      });

      var productImage = cloudinaryResponse.secure_url;
      await fs.unlink(process.cwd() + '/' + imagePath);
    } catch (error) {
      console.log(error);
      // Empty the uploads directory without deleting the uploads directory
      for (const file of await fs.readdir('uploads/')) {
        await fs.unlink(path.join('uploads/', file));
      }
      throw new InternalServerError();
    }
  }

  //2.Then use the url from cloudinary and other propduct details to add product in db
  const product = await ProductRepository.createProduct({
    ...productDetails,
    productImage: productImage
  });

  if (!product) {
    throw { reason: 'Not able to create product', statusCode: 500 };
  }

  return product;
}

async function getProductById(productId) {
  const response = await ProductRepository.getProductById(productId);

  if (!response) {
    throw new NotFoundError('Product');
  }
  return response;
}

async function getAllProductsData() {
  const response = await ProductRepository.getAllProducts();
  if (!response) {
    throw new NotFoundError('Product');
  }
  return response;
}

async function deleteProductById(productId) {
  const response = await ProductRepository.deleteProductById(productId);

  if (!response) {
    throw new NotFoundError('Product');
  }

  return response;
}

module.exports = {
  createProduct,
  getProductById,
  deleteProductById,
  getAllProductsData
};
