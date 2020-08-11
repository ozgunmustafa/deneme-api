const Question = require("../models/Question");
const Answer = require("../models/Answer");
const CustomError =require("../helpers/errors/CustomError")
const asyncErrorWrapper = require("express-async-handler");

const addNewAnswerToQuestion=asyncErrorWrapper(async(req,res,next)=>{
    const {question_id}=req.params;
    const user_id=req.user.id;
    const info = req.body;
    console.log(req.body);
    console.log(question_id);
    
    const answer = await Answer.create({
        ...info,
        question:question_id,
        user:user_id

    })
    return res.status(200)
    .json({
        success:true,
        data:answer
    })


})

const getAllAnswerByQuestion=asyncErrorWrapper(async(req,res,next)=>{
    const {question_id}=req.params;
    const question =await Question.findById(question_id).populate("answers");
    const answers = question.answers;

    return res.status(200)
    .json({
        success:true,
        count:answers.length,
        data:answers
    })
})
const getAnswer=asyncErrorWrapper(async(req,res,next)=>{
    const {answer_id}=req.params;
    const answer=await Answer
    .findById(answer_id)
    .populate({
        path:"question",
        select:"title"
    })
    .populate({
        path:"user",
        select:"name profile_image"
    })
    ;

    return res.status(200)
    .json({
        success:true,
        data:answer
    })
})

const editAnswer=asyncErrorWrapper(async(req,res,next)=>{
    const {answer_id}=req.params;

    const{content}=req.body;
    let answer = await Answer.findById(answer_id);

    answer.content=content;

    await answer.save();

    return res.status(200)
    .json({
        success:true,
        data: answer
    })
  
})

const deleteAnswer=asyncErrorWrapper(async(req,res,next)=>{
    const {answer_id}=req.params;
    const {question_id} =req.params;
    await Answer.findByIdAndRemove(answer_id);

    const question = await Question.findById(question_id);

    question.answer.splice(question.answers.indexOf(answer_id));

    await question.save();

    return res.status(200)
    .json({
        success:true,
        message:"Answer deleted succesfully"
    })
  
})

const likeAnswer=asyncErrorWrapper(async(req,res,next)=>{
    const {answer_id} = req.params;
    let answer =await Answer.findById(answer_id);

    if(answer.likes.includes(req.user.id)){
        return next(new CustomError("You already like this",400))
    }
    answer.likes.push(req.user.id);

    await answer.save();

    return res.status(200)
    .json({
        success:true,
        message:"liked",
        data:answer
    })
})

const unlikeAnswer=asyncErrorWrapper(async(req,res,next)=>{
    
    const {answer_id}= req.params;
    const answer =await Answer.findById(answer_id);
    if(!answer.likes.includes(req.user.id)){
        return next(new CustomError("You can't undo like",400));
    }
    const index = answer.likes.indexOf(req.user.id);
    answer.likes.splice(index,1)
    await answer.save();

    return res.status(200)
    .json({
        success:true, 
        message:"unliked",
        data:answer
    })
})



module.exports={
    addNewAnswerToQuestion,
    getAllAnswerByQuestion,
    getAnswer,
    editAnswer,
    deleteAnswer,
    likeAnswer,
    unlikeAnswer
}