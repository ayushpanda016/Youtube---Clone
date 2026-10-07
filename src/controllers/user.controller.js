import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiREsponse.js"

const registerUser =  asyncHandler( async (req,res) =>{
    //get user details from frontend
    // validation => mistake check (not emptty)
    //check if user alredy exist : username, email
    //check for images, check for avtar
    // upload them to cloudinary, avtar
    //create user object - create entry in db
    //remove password and refersh token field from response
    //check for user creation 
    //return res

    //get user details from frontend

    const {fullName, email, username, password}= req.body
    console.log("email", email);

    // validation => mistake check (not emptty)

    if (fullName === "") {
        throw new ApiError(400, "full name is required")
        
    }

    if (email === "") {
        throw new ApiError(400, "email is required")
        
    }
    if (username === "") {
        throw new ApiError(400, "username name is required")
        
    }
    if (password === "") {
        throw new ApiError(400, "full password is required")
        
    }
    //best approch ....
  /*  if (
        [fullName, email,  username, password].some((field)=>{
         field?.trim() === ""
        })
    ) {
       throw new ApiError(400, "All fields are required") 
    } */


    // for check User alredy exist or not exist 

   const existedUser =  User.findOne({
        $or: [{username}, { email }]
    })
    if (existedUser){
        throw new ApiError(409, "User with email or username alredy exists")
        
    }

    //check for images, check for avtar

    const avatarLocalPath =  req.files?.avatar[0]?.path
   const coverImageLocalPath =  req.files?.coverImage[0].path;

   if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required")

   }

    // upload them to cloudinary, avtar

const avatar =    await uploadOnCloudinary(avatarLocalPath)
const coverImage =await uploadOnCloudinary(coverImageLocalPath)

if (!avatar) {
    throw new ApiError(400, "Avatar image is required") 
}

 //create user object - create entry in db

const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || " ",
    email,
    password,
    username: username.toLowerCase()
})

 //remove password and refersh token field from response

const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)

if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering user" )
  
}

//check for user creation 
return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered")
    
)


})


export {registerUser}