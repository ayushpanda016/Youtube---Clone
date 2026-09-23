const asyncHandler = (requestHandler) => {
   return (req, res, next) => {
         Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
   }
 }

export {asyncHandler}


// const asyncHandler = (fn) => async (req,res,next) => {
//      try {
//          await fn(req, res, next)
//     } catch (error){
//         res.status(error.code || 500).json({
//              success: false,
//              message:error.message
//          })
//      }
//   }

    








//     Har controller me try/catch likhna pade toh code repeat hota rehta hai. asyncHandler ek wrapper hai jo ye kaam ek baar me sabke liye kar deta hai.

// 2. Code kaise bana hai
// js
// const asyncHandler = (requestHandler) => {      // (A) bahar wala function
//     return (req, res, next) => {                // (B) andar wala function
//         Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))   // (C)
//     }
// }

// (A) (requestHandler) => { ... }
// Ye ek function leta hai jiska naam requestHandler hai. Ye tumhara controller hai, jaise async (req, res) => {...}.

// (B) return (req, res, next) => { ... }
// Bahar wala function ek naya function return karta hai. Express ko route pe aisa hi function chahiye jo (req, res, next) le, isliye return hone wala function isi shape ka hai.

// (C) Promise wali line. Isko andar se bahar ki taraf padho:

// requestHandler(req, res, next): tumhara controller chalao. Ye async hai, toh turant ek Promise return karta hai.
// Promise.resolve(...): us result ko Promise me lapet deta hai. Agar wo pehle se Promise hai toh waise hi rehta hai. Ye safety ke liye hai, taaki aage .catch hamesha chal sake.
// .catch((err) => next(err)): agar Promise reject hua (controller me error aaya ya throw hua), toh next(err) call ho jaata hai. next(err) Express se bolta hai: "ye error hai, isko error-handling middleware tak le jao."
// 3. Chalta kaise hai (timeline)

// Step 1: jab server start hota hai (route define hota hai):

// js
// app.get("/users", asyncHandler(async (req, res) => {
//     const users = await User.find()
//     res.json(users)
// }))

// Yahan asyncHandler(...) usi waqt call ho jaata hai. Tumhara controller requestHandler ban ke andar chala jaata hai, aur asyncHandler (B) wala function return karta hai. Ab Express ke paas /users ke liye ye (B) wala function hai:

// js
// (req, res, next) => {
//     Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
// }

// Yaani tumhara controller abhi chala nahi, bas wrapper ke andar band hai.

// Step 2: jab request aati hai:

// Express (B) chalata hai. (B) tumhara controller requestHandler(req, res, next) chalata hai.

// Sab theek raha: controller ne res.json(users) bhej diya. Promise resolve hua, .catch chala hi nahi.
// Error aaya: Promise reject hua, .catch chala, next(err) ne error Express ke error middleware ko pass kar diya.