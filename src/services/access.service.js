const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailureRequestError, ForbiddenError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")

const Role = {
  SHOP: '0',
  WRITER: '1',
  EDITOR: '2',
  ADMIN: '3',
}
class AccessService{
  static signUp = async ({name, email, password}) => {
      // Check email existence
      const shop = await shopModel.findOne({email}).lean()
      if(shop){
        throw new BadRequestError('Error: Shop already exists')
      }
      const passwordHash = await bcrypt.hash(password, 10)
      console.log(passwordHash)
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [Role.SHOP]
      })
      if(newShop){
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey
        })
        if(!keyStore) {
          return{
            code: 'xxx',
            message: 'keyStore error'
          }
        }
        //create token pair
         const token = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
         return{
          code: 201,
          data: {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop}),
            token
          }
         }
      }
      return{
        status: 'fail',
        code: 400,
        data: null
       }
    }
  static login = async (email, password, refreshToken = null) => {
    const shop = await findByEmail({email})
    if(!shop) throw new BadRequestError('Shop not registered')
    const match = await bcrypt.compare(password, shop.password)
    if(!match) throw new AuthFailureRequestError('Password mismatch')
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')
    const { _id: userId} = shop
    const tokens = await createTokenPair({userId: userId, email}, publicKey, privateKey)

    await KeyTokenService.createKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey
    })

    return {
      shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop}),
      tokens
    }
  }
  static logOut = async(keyStore) => {
    return await KeyTokenService.removeKeyById(keyStore._id)
  }
  static handleRefreshToken = async(refreshToken) => {
    // check token used
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
    // if the token is reused
    if(foundToken) {
      // Decode to see what they are
      const { userId, email } = await verifyJWT(foundToken, foundToken.privateKey)
      // delete key
      await KeyTokenService.removeKeyByUserId(userId)
      throw new ForbiddenError("Something wrong occurred, please log in again")
    }
    // token is fine
    const userToken = await KeyTokenService.findByRefreshToken(refreshToken)
    if(!userToken) throw new AuthFailureRequestError("Shop not registered")
    const { userId, email } = await verifyJWT(refreshToken, userToken.privateKey)
    const foundShop = await findByEmail({email})
    if(!foundShop) throw new AuthFailureRequestError("Shop not registered")
    // create new token
    const tokens = await createTokenPair({userId: userId, email}, userToken.publicKey, userToken.privateKey)
    // add the refreshToken from parameter to refreshTokensUsed
    await userToken.update({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken
      }
    })
    return {
      user: { userId, email },
      tokens
    }
  }
}
module.exports = AccessService