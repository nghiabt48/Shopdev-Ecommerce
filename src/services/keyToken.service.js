const { Types } = require("mongoose");
const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
    try {
      // const token = await keytokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey
      // })
      // return token? token.publicKey : null;
      const filter = { user: userId}, update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken}, options = { upsert: true, new: true} 
      const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error
    }
  }
  static findKeyByUserId = async(userId) => {
    return await keytokenModel.findOne({user: Types.ObjectId(userId)}).lean()  
  }
  static removeKeyById = async(userId) => {
    return await keytokenModel.deleteOne({id}).lean()  
  }
  static findByRefreshTokenUsed = async(refreshToken) => {
    return await keytokenModel.findOne({ refreshTokensUsed: refreshToken}).lean()  
  }
  static findByRefreshToken = async(refreshToken) => {
    return await keytokenModel.findOne({ refreshToken }) 
  }
  static removeKeyByUserId = async(userId) => {
    return await keytokenModel.findOneAndDelete({user: userId}).lean()  
  }
}
module.exports = KeyTokenService;