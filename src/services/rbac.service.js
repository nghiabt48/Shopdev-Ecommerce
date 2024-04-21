const Resource = require("../models/resource.model")
const Role = require("../models/role.model")

const createResource = async ({ name = 'profile', slug = 'p0001', description = '' }) => {
  try {
    const resource = await Resource.create({
      name,
      slug,
      description
    })
    return resource
  } catch (error) {
    return error
  }
}
const getListResource = async ({ userId = 0, limit = 30, offset = 0, search = '' }) => {
  try {
    // Check admin middleware

    // get list
    const resource = Resource.aggregate([
      {
        project: {
          _id: 0,
          name: '$src_name',
          slug: '$src_slug',
          description: '$src_description',
          resourceId: '$_id',
          createdAt: 1,
        }
      }
    ])
    return resource
  } catch (error) {
    return error
  }
}
const createRole = async ({name = 'foo', slug = 'foo', description = 'foo', grants = []}) => {
  try {
    const role = await Role.create({
      role_name: name,
      role_slug: slug,
      role_description: description,
      role_grants: grants
    })
    return role
  } catch (error) {
    return error
  }
}
const getListRoles = async ({ userId = 0, limit = 30, offset = 0, search = '' }) => {
  try {
    // must be admin
    const roles = await Role.aggregate([
      {
        $unwind: '$role_grants'
      },
      {
        $lookup: {
          from: 'Resource',
          localField: 'role_grants.resource_id',
          foreignField: '_id',
          as: 'resource'
        }
      },
      {
        $unwind: '$resource'
      },
      {
        $project: {
          role: '$role_name',
          resource: '$resource.name',
          action: '$role_grants.actions',
          attributes: '$role_grants.attributes'
        }
      },
      {
        $unwind: '$action'
      },
      {
        $project: {
          _id: 0,
          role: 1,
          resource: 1,
          action: '$actions',
          attributes: 1
        }
      }
    ])
  } catch (error) {
    
  }
}
module.exports = {
  createRole,
  createResource,
  getListRoles,
  getListResource,
}