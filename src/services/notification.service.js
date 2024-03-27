'use strict'

const { BadRequestError, NotFoundError } = require("../core/error.response")
const { notification } = require("../models/notification.model")

class NotificationService {
  static async pushNotificationToSystem({
    type = 'SHOP-01',
    senderId = 1,
    receiverId = 69,
    options = {}
  }) {
    let noti_content
    if (type === 'SHOP-01') noti_content = `[shop_name] just add a new product: [product_name]`
    else if (type === 'PROMOTION') noti_content = `[shop_name] just add a new voucher: [voucher]`

    const newNoti = await notification.create({
      noti_type: type,
      noti_content,
      noti_senderId: senderId,
      noti_receiverId: receiverId,
      noti_options: options
    })
    return newNoti
  }
  static async userGetListNotification({
    userId = 69,
    type = 'ALL',
    isRead = 0
  }) {
    const match = { noti_receiverId: userId }
    if (type !== 'ALL') match['noti_type'] = type
    return await notification.aggregate([
      {
        $match: match
      },
      {
        $project: {
          noti_senderId: 1,
          noti_receiverId: 1,
          noti_content: 1,
          noti_type: 1,
          createAt: 1
        }
      }
    ]
    )
  }
}
module.exports = NotificationService