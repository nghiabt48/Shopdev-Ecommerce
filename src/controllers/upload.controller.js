const { SuccessResponse } = require("../core/success.response");
const { uploadImageFromURL } = require("../services/upload.service");
class UploadController {
  uploadFile = async(req, res, next) => {
    new SuccessResponse({
      metadata: await uploadImageFromURL(req.body)
    }).send(res)
  }
}
module.exports = new UploadController()