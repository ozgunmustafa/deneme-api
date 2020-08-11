const slugify =require("slugify");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const QuestionSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Please provide a title"],
        minlength:[15,"Please provide a title more 15 characters"],
        unique:true
    },
    content:{
        type:String,
        required:[true,"Please provide content"],
        minlength:[15,"Please provide content more 20 characters"],
    },
    slug:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    user:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"User"
    },
    likes:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"User"
        }
    ],
    answers:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"Answer"
        }
    ]
});
QuestionSchema.pre("save",function(next){
  if(!this.isModified("title")){
      next();
  }
  this.slug=this.makeSlug();
  next();
})
QuestionSchema.methods.makeSlug=function(){
    return slugify(this.title,{
        replacement:'-',
        remove :/[*+~.,()'"!:@]/g,
        lower:true
    });
}
module.exports= mongoose.model("Question",QuestionSchema);