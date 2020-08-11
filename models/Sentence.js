const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const SentenceSchema = new mongoose.Schema({
    sentence:{
        type:String,
        required:[true,"Sentence is required"],
        minlength:[2,"Please provide a title more 2 characters"],
        unique:true
    },

    meanTR:{
        type:String,
        required:[true,"Turkish mean is required"],
        minlength:[2,"Please provide mean more 2 characters"],
    },
    likeCount:{
        type:Number
    },
    
    dislikeCount:{
        type:Number
    },
   
    createdAt:{
        type:Date,
        default:Date.now()
    },
   
})

module.exports= mongoose.model("Sentence",SentenceSchema);