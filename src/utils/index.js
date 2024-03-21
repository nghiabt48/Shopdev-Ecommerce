'use strict'
const _ = require('lodash')
const { Types } = require('mongoose')
const convertToObjectId = id => new Types.ObjectId(id)
const getInfoData = ({fields = [], object = {}}) => {
  return _.pick(object, fields)
}
// ['a', 'b'] => {a: 0, b: 0}
const getUnselectedData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 0]))
}
// ['a', 'b'] => {a: 1, b: 1}
const getSelectedData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 1]))
}
const removeNullObject = obj => {
  // Object.keys(obj).forEach(key => {
  //   if(obj[key] && typeof obj[key] === 'object') removeNullObject(obj[key])
  //   else if(obj[key] === null) delete obj[key]
  // })
  // return obj
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') {
      removeNullObject(obj[key]);
    } else if (obj[key] === null) {
      delete obj[key];
    }
  });
  return obj;
}
const updateNestedObjectParser = obj => {
  const final = {}
  Object.keys(obj).forEach(key => {
    if(typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const response = updateNestedObjectParser(obj[key])
      Object.keys(response).forEach(keychild => {
        final[`${key}.${keychild}`] = response[keychild]
      })
    }
    else final[key] = obj[key]
  })
  return final
}
module.exports = {getInfoData, 
getUnselectedData,
removeNullObject,
updateNestedObjectParser,
convertToObjectId,
getSelectedData }