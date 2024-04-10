const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3")
const cloudinary = require("../configs/cloudinary.config")
const { BadRequestError } = require("../core/error.response")
const { s3 } = require("../configs/s3.config")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require('crypto')
const urlPublicImage = 'https://d3u0x6s94988zk.cloudfront.net'
const generateRandomFileName = () => crypto.randomBytes(8).toString('hex')
// S3Client
const uploadImageFromLocalS3 = async({ file }) => {
  try {
    const imageName = `${generateRandomFileName()}-${file.originalname}`
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName || 'unknown',
      Body: file.buffer,
      ContentType: 'image/jpeg'
    })
    const result = await s3.send(command)
    const signedUrl = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName
    })
    const url = await getSignedUrl(s3, signedUrl, { expiresIn: 3600 });
    return {
      url: `${urlPublicImage}/${imageName}`,
      result
    }
  } catch (error) {
    throw new BadRequestError(error)
  }
}

// Cloudinary
const uploadImageFromURL = async() => {
  try {
    const imageURL = 'https://scontent.fsgn5-6.fna.fbcdn.net/v/t39.30808-6/434858673_122137123616172562_3580339151351505109_n.jpg?stp=dst-jpg_p843x403&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGWwCPwJnc8rdhqhDQaPBsFiezGQ9sTZvGJ7MZD2xNm8aWl4GjIWVhE8vwJto1qG6u9avrJC_HJb9ZQfKw7sZHf&_nc_ohc=6GvyxcXLV6QAb7EtATe&_nc_ht=scontent.fsgn5-6.fna&oh=00_AfCUrQX0vep0xC-KZnT0h_nCAJ_ZB2Zuh9ghlX16BaEosw&oe=66173626'
    const folderName = 'product/shopId', fileName = 'test'
    const result = await cloudinary.uploader.upload(imageURL, {
      folder: folderName
    })
    return result
  } catch (error) {
    console.error(error)
  }
}
const uploadImageFromLocal = async({ path, folderName = 'product/8000'}) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: 'thumb',
      folder: folderName
    })
    return {
      image_url: result.secure_url,
      shopId: 9999,
      thumb_url: await cloudinary.url(result.public_id, {
        height: 2000,
        width: 2000,
        format: 'jpg'
      })
    }
  } catch (error) {
    throw new BadRequestError(error.message)
  }
}
const uploadMultipleImagesFromLocal = async({ files, folderName = 'product/8000'}) => {
  try {
    if(!files.length) return
    const uploadURLs = []
    for(const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folderName
      })
      uploadURLs.push({
        image_url: result.secure_url,
        shopId: 9999,
        thumb_url: await cloudinary.url(result.public_id, {
          height: 300,
          width: 300,
          format: 'jpg'
        })
      })
    }
    return uploadURLs
  } catch (error) {
    throw new BadRequestError(error.message)
  }
}
module.exports = {
  uploadImageFromURL,
  uploadImageFromLocal,
  uploadMultipleImagesFromLocal,
  uploadImageFromLocalS3
}