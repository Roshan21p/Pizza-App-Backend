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

      if(cloudinaryResponse){
        var public_id = cloudinaryResponse.public_id;
        var secure_url = cloudinaryResponse.secure_url;
      }
      
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
    productImage: {
      public_id: public_id,
      secure_url: secure_url,
    }
  });

  if (!product) {
    throw new InternalServerError('Not able to create product');
  }

  return product;
}

async function getProductById(productId) {
  const product = await ProductRepository.getProductById(productId);

  if (!product) {
    throw new NotFoundError('Product not found or Invalid product id');
  }
  return product;
}

async function getAllProductsData() {
  const product = await ProductRepository.getAllProducts();
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  return product;
}

async function deleteProductById(productId) {
  const product = await ProductRepository.getProductById(productId);

  if (!product) {
    throw new NotFoundError('Product not found or Invalid product id.');
  }

  try {
    // Delete the productImage from cloudinary
    if(product?.productImage?.public_id){
      await cloudinary.uploader.destroy(product.productImage.public_id)
    }
  } catch (error) {
    console.log(error);
    throw new InternalServerError("Failed to delete Product assets");
  }

  await product.deleteOne();
  return product;
}

async function updateProductById(productDetails, productId, image){

  const product = await ProductRepository.findProductAndUpdate(productId, productDetails);

  if(!product){
    throw new NotFoundError("Invalid product id or product not found");
  }

  if(image){
    try {

      if(product?.productImage?.public_id){
        await cloudinary.uploader.destroy(product.productImage.public_id)
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(image?.path,{
        folder: 'pizza/products'
      })

      if(cloudinaryResponse){
        product.productImage.public_id = cloudinaryResponse.public_id;
        product.productImage.secure_url = cloudinaryResponse.secure_url;
      }

      await fs.unlink(process.cwd() + '/' + image?.path);
    } catch (error) {      
      // Empty the uploads directory without deleting the uploads directory
       for (const file of await fs.readdir('uploads/')) {
         await fs.unlink(path.join('uploads/', file));
      }
      throw new InternalServerError();
    }
  }

  await product.save();

  return product;

}
module.exports = {
  createProduct,
  getProductById,
  deleteProductById,
  getAllProductsData,
  updateProductById
};
