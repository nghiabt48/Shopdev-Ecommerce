const { NotFoundError, ForbiddenError } = require("../core/error.response")
const { findById } = require("../services/apikey.service")

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}

const apiKey = async(req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString()
    if(!key) throw new NotFoundError('API key not found')
    
    const objKey = await findById(key)
    if(!objKey) throw new ForbiddenError('Invalid API key')
    req.objKey = objKey
    return next()
  } catch (error) {
    throw new ForbiddenError(error.message)
  }
}
const permission = (permission) => {
  return (req, res, next) => {
    if(!req.objKey.permissions){
      throw new ForbiddenError('Permission denied')
    }
    const validPermission = req.objKey.permissions.includes(permission)
    if(!validPermission) {
      throw new ForbiddenError('Permission denied')
    }
    return next()
  }
}
module.exports = { apiKey, permission }