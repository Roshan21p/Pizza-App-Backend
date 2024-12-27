const {
  getCartByUserId,
} = require('../repositories/cartRepository');
const { getProductById } = require('../repositories/productRepository');
const BadRequestError = require('../utils/badRequestError');
const NotFoundError = require('../utils/notFoundError');

async function getCart(userId) {
  const cart = await getCartByUserId(userId);

  if (!cart) {
    throw new NotFoundError('Not able to find Cart');
  }
  return cart;
}

async function modifyCart(userId, productId, shouldAdd = true) {
  const quantityValue = shouldAdd == true ? 1 : -1;
  const cart = await getCart(userId);
  const product = await getProductById(productId);
  if (!product) {
    throw new NotFoundError('Not able to find Product');
  }
  if (!product.inStock && product.quantity <= 0) {
    throw new BadRequestError(['Product not available in stock']);
  }

  //May be the product is already in the cart
  let foundProduct = false;
  cart.items.forEach((item) => {
    console.log(item);
    if (item.product._id == productId) {
      if (shouldAdd) {
        if (product.quantity >= item.quantity + 1){
          item.quantity += quantityValue;
        }
        else{
          throw new NotFoundError(
            'The quantity of the item rquested is not available',
            404
          );
        }
      } else {
        if (item.quantity > 0) {
          item.quantity += quantityValue;
          if (item.quantity == 0) {
            cart.items = cart.items.filter(
              (item) => item.product._id != productId
            );
            foundProduct = true;
            return;
          }
        } else
          throw new NotFoundError(
            'The quantity of the item rquested is not available',
            404
          );
      }
      foundProduct = true;
    }
  });
  if (!foundProduct) {
    if (shouldAdd) {
      cart.items.push({
        product: productId,
        quantity: 1
      });
    } else {
      throw new NotFoundError('Not able to find Product in the cart');
    }
  }
  await cart.save();
  return cart;
}

async function clearItemFromCart(userId, itemId) {
  const cart = await getCartByUserId(userId);
  
  if(!cart){
    throw new NotFoundError("Cart not found for this user");
  }
  
   // Filter out the item with the matching itemId
   const updatedItems = cart.items.filter((item) => item._id != itemId );

   
   // Check if the item was found and removed
   if (updatedItems.length === cart.items.length) {
   throw new NotFoundError("Item not found in the cart");
  }

  // Update the cart's items and save it
  cart.items = updatedItems;
  await cart.save();

  return cart;

}

module.exports = {
  getCart,
  modifyCart,
  clearItemFromCart
};
