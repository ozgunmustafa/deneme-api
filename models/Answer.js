const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Question =require("../models/Question")

const AnswerSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Please provide a content"],
    minlength: [10, "Must be more than 15 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required:true
  },

  question:{
    type: mongoose.Schema.ObjectId,
    ref:"Question",
    required:true
  }
});
AnswerSchema.pre("save",async function(next){
  if(!this.isModified("user")) return next();
  
  try{

    const question = await Question.findById(this.question);
    question.answers.push(this._id);
  
    await question.save();
    next();
  }catch(err){
    return next(err);
  }

})


module.exports=mongoose.model("Answer", AnswerSchema)
