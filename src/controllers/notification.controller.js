const { SuccessResponse } = require("../core/success.response");
const NotificationService = require("../services/notification.service");
class NotificationController {
  pushNotificationToSystem = async(req, res, next) => {
    new SuccessResponse({
      message: "Create Comment Successfully",
      metadata: await NotificationService.pushNotificationToSystem(req.body)
    }).send(res)
  }
  userGetListNotification = async(req, res, next) => {
    new SuccessResponse({
      metadata: await NotificationService.userGetListNotification(req.query)
    }).send(res)
  }
}
module.exports = new NotificationController()