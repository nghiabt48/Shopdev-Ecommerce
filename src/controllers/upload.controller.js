const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const { uploadImageFromURL, uploadImageFromLocal, uploadMultipleImagesFromLocal, uploadImageFromLocalS3 } = require("../services/upload.service");
class UploadController {
  uploadFile = async(req, res, next) => {
    new SuccessResponse({
      metadata: await uploadImageFromURL(req.body)
    }).send(res)
  }
  uploadFileThumb = async(req, res, next) => {
    const { file } = req
    if(!file) throw new BadRequestError('No file to upload')
    new SuccessResponse({
      metadata: await uploadImageFromLocal({
        path: file.path
      })
    }).send(res)
  }
  uploadMultipleFiles = async(req, res, next) => {
    const { files } = req
    if(!files.length) throw new BadRequestError('No file to upload')
    new SuccessResponse({
      metadata: await uploadMultipleImagesFromLocal({
        files
      })
    }).send(res)
  }
  uploadFileFromLocalS3 = async(req, res, next) => {
    const { file } = req
    if(!file) throw new BadRequestError('No file to upload')
    new SuccessResponse({
      metadata: await uploadImageFromLocalS3({
        file
      })
    }).send(res)
  }
}
module.exports = new UploadController()