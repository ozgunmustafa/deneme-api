const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const crypto =require("crypto");
const Question=require("./Question");


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name field is required"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [emailRegex, "Enter a valid email address"],
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be more than 6 characters"],
    select: false,
  },
  title: {
    type: String,
  },
  about: {
    type: String,
  },
  place: {
    type: String,
  },
  website: {
    type: String,
  },
  profileImage: {
    type: String,
    default: "default.jpg",
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken:{
    type:String
  },
  resetPasswordExpire:{
    type:Date
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.methods.getResetPasswordTokenFromUser=function(){
  const randHexString=crypto.randomBytes(15).toString("hex");
  const {RESET_PASSWORD_EXPIRE} =process.env;
  

  const resetPasswordToken=crypto
  .createHash("SHA256")
  .update(randHexString)
  .digest("hex");

  this.resetPasswordToken=resetPasswordToken;
  this.resetPasswordExpire=Date.now() + parseInt(RESET_PASSWORD_EXPIRE);

  return resetPasswordToken;
};


UserSchema.methods.generateJwtFromUser = function () {
  const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;
  const payload = {
    id: this._id,
    name: this.name,
  };
  const token = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRE,
  });
  return token;
};

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) next(err);
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) next(err);
      this.password = hash;
      next();
    });
  });
});

UserSchema.post("remove", async function(){
  await Question.deleteMany({
    user:this._id
  });
})


module.exports = mongoose.model("User", UserSchema);
