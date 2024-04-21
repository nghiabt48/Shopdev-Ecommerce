const { AuthFailureRequestError } = require("../core/error.response")
const { getListRoles } = require("../services/rbac.service")

const grantAccess = (action, resource) => {
  return async(req, res, next) => {
    try {
      rbac.setGrants(await getListRoles({
        userId: 111
      }))
      const role_name = req.query.role
      const permission = await rbac.can(role_name)[action](resource)
      if(!permission.granted) throw new AuthFailureRequestError('Permission denied')
      next()
    } catch (error) {
      next(error)
    }
  }
}
module.exports = {grantAccess}