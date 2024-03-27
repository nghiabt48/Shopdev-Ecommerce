const { SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");
class CommentController {
  createComment = async(req, res, next) => {
    new SuccessResponse({
      message: "Create Comment Successfully",
      metadata: await CommentService.createComment(req.body)
    }).send(res)
  }
  getCommentsByParentId = async(req, res, next) => {
    new SuccessResponse({
      metadata: await CommentService.getCommentsByParentId(req.query)
    }).send(res)
  }
}
module.exports = new CommentController()