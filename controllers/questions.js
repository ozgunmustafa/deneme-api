const Question = require("../models/Question");
const CustomError =require("../helpers/errors/CustomError")
const asyncErrorWrapper = require("express-async-handler");


const createNewQuestion=asyncErrorWrapper(async(req,res,next)=>{

    const info = req.body;
    const question = await Question.create({
        //..info ya da
        title:info.title,
        content:info.content,
        user:req.user.id
    });
    res.status(200)
    .json({
        success:true,
        data:question
    });
})

const getAllQuestions=asyncErrorWrapper(async(req,res,next)=>{
    
    const questions=await Question.find();
    return res.status(200)
    .json({
        success:true,
        data:questions
    })
});

const getQuestion=asyncErrorWrapper(async(req,res,next)=>{
    const {id} = req.params;
    const question=await Question.findById(id);
    return res.status(200)
    .json({
        success:true,
        data:question
    })
});

const editQuestion=asyncErrorWrapper(async(req,res,next)=>{
    const {id} = req.params;
    const {title,content}=req.body;
    let question =await Question.findById(id);
    question.title=title;
    question.content=content;

    question=await question.save();

    return res.status(200)
    .json({
        success:true,
        data:question
    });
});

const deleteQuestion=asyncErrorWrapper(async(req,res,next)=>{
    const {id} = req.params;
    await Question.findByIdAndDelete(id);
    res.status(200)
    .json({
        success:true,
        message:"Deleted Succesfully"
    })
});
const likeQuestion=asyncErrorWrapper(async(req,res,next)=>{
    const {id} = req.params;
    let question =await Question.findById(id);

    if(question.likes.includes(req.user.id)){
        return next(new CustomError("You already like this",400))
    }
    question.likes.push(req.user.id);

    await question.save();

    return res.status(200)
    .json({
        success:true,
        data:question
    })
});
const unlikeQuestion=asyncErrorWrapper(async(req,res,next)=>{
    const {id}= req.params;
    const question =await Question.findById(id);
    if(!question.likes.includes(req.user.id)){
        return next(new CustomError("You can't undo like",400));
    }

    const index = question.likes.indexOf(req.user.id);

    question.likes.splice(index,1)
    await question.save();

    return res.status(200)
    .status.json({
        success:true, 
        data:question
    })
});



module.exports={
    createNewQuestion,
    getAllQuestions,
    getQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    unlikeQuestion
}