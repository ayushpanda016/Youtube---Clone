import { v2 as cloudinary } from 'cloudinary'
import fs from "fs";

//fs = fileSystem defalult install hota hai node pe local file ko delete krna ke liye fs lgega (unlink) ka use 


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   secure: true,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath)=> {
    try {
        if (!localFilePath) return null
        // upload the file on Cloudinary
       
        const response= await cloudinary.uploader.upload(localFilePath, {
          resource_type:'auto'
        })
        //file has been uploded sucessfully
        
        console.log("file is uploded on cloudinary",response.url);
        return response;
        
    } catch (error) {
      fs.unlinkSync(localFilePath) //remove the locally saved temp file as the upload Operation got failed.
        
    }
}

export {uploadOnCloudinary}


