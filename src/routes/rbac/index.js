const express = require('express');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { createNewRole, listRoles, listResource, createNewResource } = require('../../controllers/rbac.controller');

const router = express.Router()


router.post('/role', asyncHandler(createNewRole))
router.get('/roles', asyncHandler(listRoles))
router.get('/resources', asyncHandler(listResource))
router.post('/resource', asyncHandler(createNewResource))

module.exports = router