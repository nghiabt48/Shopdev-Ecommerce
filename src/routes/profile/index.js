const express = require('express');
const { grantAccess } = require('../../middlewares/rbac');

const router = express.Router()

// admin
router.get('/viewAny', grantAccess('readAny', 'profile'))

// shop
router.get('/viewOwn', grantAccess('readOwn', 'profile'))



module.exports = router