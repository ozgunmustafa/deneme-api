const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  addNewAnswerToQuestion,
  getAllAnswerByQuestion,
  getAnswer,
  editAnswer,
  deleteAnswer,
  likeAnswer,
  unlikeAnswer
} = require("../controllers/answer");
const { getAccessToRoute } = require("../middlewares/auth/auth");
const {
  checkAnswerExist,
} = require("../middlewares/database/databaseErrorHelper");
const { getAnswerOwnerAccess } = require("../middlewares/auth/auth");

router.post("/", getAccessToRoute, addNewAnswerToQuestion);
router.get("/", getAllAnswerByQuestion);
router.get("/:answer_id", checkAnswerExist, getAnswer);
router.get("/:answer_id/like", [checkAnswerExist,getAccessToRoute], likeAnswer);
router.get("/:answer_id/unlike", [checkAnswerExist,getAccessToRoute], unlikeAnswer);
router.put(
  "/:answer_id/edit",
  [checkAnswerExist, getAccessToRoute, getAnswerOwnerAccess],
  editAnswer
);

router.delete(
  "/:answer_id/delete",
  [checkAnswerExist, getAccessToRoute, getAnswerOwnerAccess],
  deleteAnswer
);

module.exports = router;
