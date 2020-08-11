const jwt = require("jsonwebtoken");
const CustomError = require("../../helpers/errors/CustomError");
const User = require("../../models/User");
const Question = require("../../models/Question");
const Answer = require("../../models/Answer");

const asyncErrorWrapper = require("express-async-handler");

const {
  isTokenIncluded,
  getAccessTokenFromHeader,
} = require("../../helpers/auth/tokenHelpers");
const questions = require("../../controllers/questions");

const getAccessToRoute = (req, res, next) => {
  const { JWT_SECRET_KEY } = process.env;
  if (!isTokenIncluded(req)) {
    return next(
      new CustomError("You are not authorized to access this route", 401)
    );
  }

  const accessToken = getAccessTokenFromHeader(req);

  jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(
        new CustomError("You are not authorized to access this route", 401)
      );
    }
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
    };
    next();
  });
};

const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id);
  if (user.role !== "admin") {
    return next(new CustomError("Access denied", 403));
  }
  next();
});

const getQuestionOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;
  const questionId = req.params.id;
  const question = await Question.findById(questionId);

  if (userId != question.user) {
    return next(new CustomError("Access denieed", 403));
  }
  next();
});

const getAnswerOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;
  const answerId = req.params.answer_id;
  const answer = await Answer.findById(answerId);
  

  if (userId != answer.user) {
    return next(new CustomError("Only owner can change answer", 403));
  }
  next();
});

module.exports = {
  getAccessToRoute,
  getAdminAccess,
  getQuestionOwnerAccess,
  getAnswerOwnerAccess
};
