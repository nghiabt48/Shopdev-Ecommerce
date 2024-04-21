const { SuccessResponse } = require("../core/success.response")
const { createResource, createRole, getListRoles, getListResource } = require("../services/rbac.service")

const createNewResource = async (req, res, next) => {
  new SuccessResponse({
    metadata: await createResource(req.body)
  }).send(res)
}
const createNewRole = async (req, res, next) => {
  new SuccessResponse({
    metadata: await createRole(req.body)
  }).send(res)
}
const listRoles = async (req, res, next) => {
  new SuccessResponse({
    metadata: await getListRoles(req.body)
  }).send(res)
}
const listResource = async (req, res, next) => {
  new SuccessResponse({
    metadata: await getListResource(req.body)
  }).send(res)
}
module.exports = {
  createNewResource,
  listRoles,
  listResource,
  createNewRole
}