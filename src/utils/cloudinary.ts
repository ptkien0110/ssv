import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'Tikpii',
      format: 'jpeg',
      public_id: uuidv4()
    }
  }
})

const uploadCloud = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

export default uploadCloud
