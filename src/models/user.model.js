import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim: true,
        index:true //searching field enable keliye index True rahkna 
    },
    email: {
         type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim: true,
    },
    fullname: {
         type: String,
        required: true,
        lowercase:true,
        trim: true,
        index:true
    },
    avatar:{
       type: String, // cloudnary url
       required:true, 
    },
    coverImage: {
        type : String, //cloudnary url
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password:{
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    }
},{timestamp: true})

userSchema.pre("save", async function (next) {
    if(!this.isModifie("password")) return next();
    this.password = bcrypt.hash(this.password, 10)
    next()
})

// login ke time: user ka diya plain password DB ke hashed password se match karta hai (true/false)
userSchema.methods.isPasswordCorrect = async function (password){
    // bcrypt.compare(plain password, DB ka hashed password) -> true ya false
    return await bcrypt.compare(password, this.password )
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email: this.email,
            fullname:this.fullname
        },
        process.eventNames.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            
        },
        process.eventNames.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema) 


/*
iss code ko if statement me ku rakhagya hai  bta userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});


Thought for 2s
Thought for 2s
Yeh if kyu lagaya hai?
pre("save") hook har baar chalta hai jab bhi save() hota hai, sirf signup par nahi. Yeh if check yeh decide karta hai ki password badla hai ya nahi. Nahi badla, toh hashing skip kar do.

Iske bina kya hoga?
Maan lo user ne signup kiya, aur DB mein hashed password gaya:

password: "$2b$10$N9qo8uLOickgx2ZMRZoMye..."   // hash
Kuch din baad user ne apna avatar change kiya:

javascript
user.avatar = "new-url";
await user.save();   // pre("save") hook phir chalega
Ab agar if nahi hota, toh hook us pehle se hashed password ko hi dobara hash kar deta, yaani hash ka hash ban jata:

"$2b$10$N9qo8..."  →  "$2b$10$Xk3pQ..."   // ab yeh bilkul alag string hai
Ab user jab sahi password "mypassword" daalega, toh bcrypt.compare original hash se match hi nahi kar payega, aur login toot jayega, bina kisi error ke.

isModified("password") kya karta hai?
Yeh Mongoose ka method hai jo check karta hai ki is save mein us field ki value badli hai ya nahi.

Situation	isModified("password")	Kya hota hai
Naya user bana (signup)	true	Hash hoga
User ne password change kiya	true	Naya password hash hoga
Sirf avatar / fullname update kiya	false	Hashing skip
Line ka matlab
javascript
if (!this.isModified("password")) return next();
Isko padho: "Agar password modify NAHI hua hai, toh yahin se next() karke nikal jao." ! ka matlab "nahi" hota hai.

return isliye zaroori hai, taaki niche wali hash line chale hi na. Bina return ke next() bhi call hota aur hashing bhi ho jati.

Short mein
if check = "sirf tab hash karo jab password naya ya changed ho". Yeh nahi lagaoge toh har save() par password dobara hash hoke corrupt ho jayega. */