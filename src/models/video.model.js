import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
    {
        VideoFile: {
            type: String, //cloudnary url
            required: true
        },
        thumbnail: {
            type: String, //cloudnary url
            required: true
        },
        title: {
            type: String, 
            required: true
        },
        description: {
            type: String, 
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        views:{
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }

    },{timestamps: true}
)
videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)








/*mongoose-aggregate-paginate-v2 ek plugin hai jo aggregation pipeline ke result ko pages mein baant deta hai (pagination).

Pagination kya hota hai?

Maan lo tumhare paas 10,000 videos hain. Sab ek saath frontend ko bhejoge toh app slow ho jayega. Isliye hum data chhote tukdon (pages) mein bhejte hain, jaise page 1 mein 10 videos, page 2 mein agle 10, aur aise hi aage.

Yeh package kyu chahiye?

Mongoose mein normal find() ke liye mongoose-paginate-v2 hota hai. Lekin jab tum aggregate() use karte ho (lookup, match, group, sort jaise stages), toh wahan wo kaam nahi karta. Aggregate mein skip aur limit haath se lagane padte, aur total count alag se nikalna padta. Yeh package yeh sab kaam ek hi function mein kar deta hai.

Tumhare project mein watchHistory ya Video ke saath $lookup use hoga, isliye yeh kaam aayega. */