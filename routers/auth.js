const express=require("express");
const router= express.Router();
const {register,login,editDetails,logout,imageUpload,getUser,forgotPassword,resetPassword} = require("../controllers/auth")
const {getAccessToRoute} =require("../middlewares/auth/auth")
const profileImageUpload = require("../middlewares/libraries/profileImageUpload");

router.get("/",(req,res)=>{
    res.send("Auth Page")
})
router.post("/register",register);
router.post("/login",login);
router.get("/logout",getAccessToRoute,logout);
router.get("/profile",getAccessToRoute,getUser);
router.post("/upload",getAccessToRoute,profileImageUpload.single("profile_image"),imageUpload);
router.post("/forgotpassword",forgotPassword);
router.put("/resetpassword",resetPassword);
router.put("/edit",getAccessToRoute, editDetails);


module.exports=router;