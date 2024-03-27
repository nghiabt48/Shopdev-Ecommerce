'use strict'

const { NotFoundError } = require("../core/error.response")
const { comment } = require("../models/comment.model")

/* 
  1 - Add Comment [User | Shop]
  2 - Get comment section [User | Shop]
  3 - Delete comment [User | Shop | Admin]

*/
class CommentService {
  static async createComment({ productId, userId, content, parentCommentId = null }) {
    const newComment = await comment.create({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId
    })
    let rightValue
    if (parentCommentId) {
      // reply comment
      const parentComment = await comment.findById(parentCommentId)
      if (!parentComment) throw new NotFoundError("parent comment not found")
      rightValue = parentComment.comment_right
      await comment.updateMany({
        comment_productId: productId,
        comment_right: { $gte: rightValue }
      }, {
        $inc: {
          comment_right: 2
        }
      })
      await comment.updateMany({
        comment_productId: productId,
        comment_left: { $gt: rightValue }
      }, {
        $inc: {
          comment_left: 2
        }
      })
    } else {
      const maxRight = await comment.findOne({
        comment_productId: productId
      }, 'comment_right', { sort: { comment_right: -1 } })
      if (maxRight) {
        rightValue = maxRight.comment_right + 1
      }
      else rightValue = 1
    }
    newComment.comment_left = rightValue
    newComment.comment_right = rightValue + 1
    await newComment.save()
    return newComment
  }
  static async getCommentsByParentId({ productId, parentCommentId = null, limit = 50, offset = 0 }) {
    if (parentCommentId) {
      const parent = await comment.findById(parentCommentId)
      if (!parent) throw new NotFoundError("Parent comment not found")
      const comments = await comment.find({
        comment_productId: productId,
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lte: parent.comment_right }
      }).select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1
      }).sort({ comment_left: 1 })
      return comments
    }
    const comments = await comment.find({
      comment_productId: productId,
      comment_parentId: parentCommentId
    }).select({
      comment_left: 1,
      comment_right: 1,
      comment_content: 1,
      comment_parentId: 1
    }).sort({ comment_left: 1 })
    return comments
  }
}
module.exports = CommentService