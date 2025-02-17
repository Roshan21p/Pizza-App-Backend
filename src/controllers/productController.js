const {
  createProduct,
  getProductById,
  deleteProductById,
  getAllProductsData,
  updateProductById
} = require('../services/productService');
const AppError = require('../utils/appError');

async function addProduct(req, res) {
  try {
    const product = await createProduct({
      productName: req.body.productName,
      description: req.body.description,
      imagePath: req.file?.path,
      price: req.body.price,
      category: req.body.category, // if category is undefined, veg will be stored
      inStock: req.body.inStock // if inStock is undefined then true will be stored
    });
    return res.status(201).json({
      success: true,
      message: 'Successfully created the Product',
      error: {},
      data: product
    });
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        data: {},
        error: error
      });
    }
    return res.status(500).json({
      success: false,
      message: error.reason,
      data: {},
      error: error
    });
  }
}

async function getProduct(req, res) {
  try {
    const response = await getProductById(req.params.id);
    return res.status(200).json({
      message: 'Successfully fetched the product',
      success: true,
      data: response,
      error: {}
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        data: {},
        error: error
      });
    }
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.reason,
      data: {},
      error: error
    });
  }
}

async function getProducts(req, res) {
  try {
    const response = await getAllProductsData();
    return res.status(200).json({
      success: true,
      message: 'Successfully fetched the product',
      error: {},
      data: response
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        data: {},
        error: error
      });
    }
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.reason,
      data: {},
      error: error
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const response = await deleteProductById(req.params.id);
    return res.status(200).json({
      message: 'Successfully deleted the product',
      success: true,
      data: response,
      error: {}
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        data: {},
        error: error
      });
    }
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.reason,
      data: {},
      error: error
    });
  }
}

async function updateProduct(req, res) {
  try {
    const response = await updateProductById(req.body, req.params.id, req.file);
    return res.status(200).json({
      message: 'Successfully updated the product details',
      success: true,
      data: response,
      error: {}
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        data: {},
        error: error
      });
    }
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.reason,
      data: {},
      error: error
    });
  }
}

module.exports = {
  addProduct,
  getProduct,
  deleteProduct,
  getProducts,
  updateProduct
};
