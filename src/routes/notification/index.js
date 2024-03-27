const express = require('express');
const notificationController = require('../../controllers/notification.controller');
const { authenticationV2 } = require('../../auth/authUtils');
const { asyncHandler } = require('../../helpers/asyncHandler');
const router = express.Router()

router.use(authenticationV2)

router.get('', asyncHandler(notificationController.userGetListNotification))


module.exports = router