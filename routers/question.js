const express = require("express");
const answer = require("./answer")
const router = express.Router();
const {
  checkQuestionExist,
} = require("../middlewares/database/databaseErrorHelper");
const {
  createNewQuestion,
  getAllQuestions,
  getQuestion,
  editQuestion,
  deleteQuestion,
  likeQuestion,
  unlikeQuestion
} = require("../controllers/questions");
const {
  getAccessToRoute,
  getQuestionOwnerAccess,
} = require("../middlewares/auth/auth");

router.get("/", getAllQuestions);
router.get("/:id", checkQuestionExist, getQuestion);
router.get("/:id/like",[getAccessToRoute, checkQuestionExist], likeQuestion);
router.get("/:id/unlike",[getAccessToRoute, checkQuestionExist], unlikeQuestion);
router.post("/ask", getAccessToRoute, createNewQuestion);
router.put(
  "/edit/:id",
  [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
  editQuestion
);
router.delete(
  "/delete/:id",
  [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
  deleteQuestion
);

router.use("/:question_id/answers",checkQuestionExist, answer)

module.exports = router;
