const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const WordSchema = new mongoose.Schema({
    word:{
        type:String,
        required:[true,"Please provide a word"],
        minlength:[2,"Please provide a title more 2 characters"],
        unique:true
    },

    meanTR:{
        type:String,
        required:[true,"Please provide content"],
        minlength:[2,"Please provide mean more 2 characters"],
    },
    slug:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    sentences:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"Sentences"
    }
})

module.exports= mongoose.model("Word",WordSchema);