'use strict';

const { cart } = require("../cart.model");

const findCartById = async(cartId) => {
  return await cart.findOne({_id: cartId, cart_state: 'active'}).lean();
}
module.exports = {
  findCartById
}