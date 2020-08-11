const express = require("express");
const {getAccessToRoute,getAdminAccess} =require("../middlewares/auth/auth")
const {checkUserExist} =require("../middlewares/database/databaseErrorHelper");
const {blockUser,deleteUser} =require("../controllers/admin")
const router = express.Router();

router.use([getAccessToRoute,getAdminAccess]);


router.get("/block/:id",checkUserExist, blockUser);
router.delete("/delete-user/:id",checkUserExist, deleteUser);



module.exports=router