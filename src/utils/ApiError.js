class ApiError extends Error {
  constructor(
    statusCode,
    message= "Somethings went Wrong",
    errors = [],
    stack = ""
  ){
    super(message)
    this.statusCode = statusCode
    this.data = null
    this.message = message
    this.success = false;
    this.errors = errors

    if(stack){
        this.stack = stack
    }else{
        Error.captureStackTrace(this, this.constructor)
    }

  }  
}

export {ApiError}








// // Apni custom error class banayi, jo JS ki built-in Error class se "extend" karti hai.
// // Matlab Error ki saari cheezein (message, stack) hume automatically mil jaati hain.
// class ApiError extends Error {

//   // constructor tab chalta hai jab hum "new ApiError(...)" likhte hain.
//   constructor(
//     statusCode,                        // HTTP status code, jaise 404, 401, 500
//     message = "Something went wrong",  // default message, agar koi message na diya jaaye
//     errors = [],                       // extra error details ki list (default: khaali)
//     stack = ""                         // optional stack trace (aksar khaali hi rehta hai)
//   ) {
//     // Parent class (Error) ka constructor chalata hai aur message set karta hai.
//     // Child class me "this" use karne se PEHLE super() likhna zaroori hai.
//     super(message)

//     this.statusCode = statusCode  // error middleware isi se sahi HTTP code bhejta hai
//     this.data = null              // error me koi data nahi hota, isliye null
//     this.message = message        // error ka message (super ne bhi set kiya tha, yahan clear rakha hai)
//     this.success = false          // error hai toh success hamesha false
//     this.errors = errors          // extra details ki list

//     // Stack trace = "error kis file ki kaun si line se aaya" ki history.
//     if (stack) {
//       // Agar bahar se stack diya gaya hai toh wahi use karo.
//       this.stack = stack
//     } else {
//       // Warna khud bana lo. "this.constructor" dene se trace me
//       // ApiError ka andar ka kachra nahi dikhta, sirf wo jagah dikhti hai
//       // jahan tumne error banaya (throw new ApiError(...)).
//       Error.captureStackTrace(this, this.constructor)
//     }
//   }
// }

// // Isko doosri files me import karne ke liye export kiya.
// // Use: import { ApiError } from "./ApiError.js"
// export { ApiError }