const express = require("express");
const { route } = require("./auth");
const { getSingleUser,getAllUsers } = require("../controllers/user")
const {checkUserExist} =require("../middlewares/database/databaseErrorHelper");
const router = express.Router();

router.get("/", getAllUsers)
router.get("/:id",checkUserExist, getSingleUser)

module.exports=router