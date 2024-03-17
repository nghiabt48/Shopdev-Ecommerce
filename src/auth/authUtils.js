const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const { AuthFailureRequestError, NotFoundError } = require('../core/error.response');
const { findKeyByUserId } = require('../services/keyToken.service');
const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESHTOKEN: 'x-rtoken-id'
}
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await jwt.sign(payload, publicKey, {
      expiresIn: '2 days'
    })
    const refreshToken = await jwt.sign(payload, privateKey, {
      expiresIn: '7 days'
    })
    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) console.error(`error verify::`, err)
      else console.log(`decode verify::`, decode)
    })
    return { accessToken, refreshToken }
  } catch (error) {

  }
}
const authentication = asyncHandler(async (req, res, next) => {
  // 1 - Check if userId is missing
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureRequestError('Invalid user ID')
  // 2 - get accessToken
  const keyStore = await findKeyByUserId(userId)
  if (!keyStore) throw new NotFoundError('Keystore not found')
  // 3 - Verify tokens
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new AuthFailureRequestError('Invalid Access Token')
  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey)
    if (userId !== decodeUser.userId) throw new AuthFailureRequestError('Invalid user')
    req.keyStore = keyStore
    return next()
  }
  catch (err) {
    throw err
  }
})
const authenticationV2 = asyncHandler(async (req, res, next) => {
  // 1 - Check if userId is missing
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureRequestError('Invalid user ID')
  // 2 - get accessToken
  const keyStore = await findKeyByUserId(userId)
  if (!keyStore) throw new NotFoundError('Keystore not found')
  // 3 - Verify tokens
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN]
      const decodeUser = jwt.verify(refreshToken, keyStore.privateKey)
      if (userId !== decodeUser.userId) throw new AuthFailureRequestError('Invalid user')
      req.keyStore = keyStore
      req.user = decodeUser
      req.refreshToken = refreshToken
      return next()
    }
    catch (err) {
      throw err
    }
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new AuthFailureRequestError('Invalid Request')
  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey)
    if (userId !== decodeUser.userId) throw new AuthFailureRequestError('Invalid user')
    req.keyStore = keyStore
    req.user = decodeUser
    return next()
  } catch (e) {
    throw e
  }
})
const verifyJWT = async (token, keySecret) => {
  return await jwt.verify(token, keySecret)
}
module.exports = { createTokenPair, authentication, authenticationV2, verifyJWT }