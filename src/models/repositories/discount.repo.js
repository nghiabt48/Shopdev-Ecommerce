'use strict';

const { getUnselectedData, getSelectedData } = require("../../utils");

const findAllDiscountCodeUnselected = async({ limit = 50, page = 1, sort = 'ctime', filter, unselect, model}) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1} : { _id: 1}
  const documents = await model.find( filter )
  .sort(sortBy)
  .skip(skip)
  .limit(limit)
  .select(getUnselectedData(unselect))
  .lean()
  return documents
}
const findAllDiscountCodeSelected = async({ limit = 50, page = 1, sort = 'ctime', filter, select, model}) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1} : { _id: 1}
  const documents = await model.find( filter )
  .sort(sortBy)
  .skip(skip)
  .limit(limit)
  .select(getSelectedData(select))
  .lean()
  return documents
}
const checkDiscountExists = async({model, filter}) => {
  return await model.findOne(filter).lean()
}
module.exports = {
  findAllDiscountCodeUnselected,
  findAllDiscountCodeSelected,
  checkDiscountExists
}