const cloudinary = require("../configs/cloudinary.config")

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
module.exports = {
  uploadImageFromURL
}