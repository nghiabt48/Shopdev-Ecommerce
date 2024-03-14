const apikeyModel = require('../models/apikey.model')
const findById = async(key) => {
  // const newKey = await apikeyModel.create({ key: crypto.randomBytes(64).toString('hex')})
  // console.log(newKey)
  const objKey = await apikeyModel.findOne({key, status: true}).lean()
  return objKey;
}
module.exports = { findById }