const User = require("../models/User");
const CustomError = require("../helpers/errors/CustomError");
const { sendJwtToClient } = require("../helpers/auth/tokenHelpers");
const {
  validateUserInput,
  comparePassword,
} = require("../helpers/input/inputHelpers");
const asyncErrorWrapper = require("express-async-handler");
const sendEmail = require("../helpers/libraries/sendMail");
const sendMail = require("../helpers/libraries/sendMail");

const register = asyncErrorWrapper(async (req, res, next) => {
  console.log(req.body);
  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  sendJwtToClient(user, res);
});

const login = asyncErrorWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!validateUserInput(email, password)) {
    return next(new CustomError("Please check your inputs", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!comparePassword(password, user.password)) {
    return next(new CustomError("Please check your credentials", 400));
  }
  sendJwtToClient(user, res);
});

const logout = asyncErrorWrapper(async (req, res, next) => {
  const { NODE_ENV } = process.env;
  return res
    .status(200)
    .cookie({
      httpOnly: true,
      expires: new Date(Date.now),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      message: "Logout successful",
    });
});

const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
  const resetEmail = req.body.email;
  const user = await User.findOne({ email: resetEmail });
  if (!user) {
    return next(new CustomError("Email not found", 400));
  }
  const resetPasswordToken = user.getResetPasswordTokenFromUser();

  await user.save();

  const resetPassword = `http://localhost:8080/api/auth/resetPassword?resetPasswordToken=${resetPasswordToken}`;

  const emailTemplate = `
  <h3>Reset Your Password </h3>
  <p> Here is reset link >> <a href='${resetPassword}' target='_blank'>Reset password</a></p>
  `;

  try {
    await sendMail({
      from: process.env.SMTP_USER,
      to: resetEmail,
      subject: "Password Reset Link",
      html: emailTemplate,
    });

    return res.status(200).json({
      success: true,
      message: "Check your inboxes",
    });
  } catch {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return next(new CustomError("Email couldnt sent.", 500));
  }
});
const resetPassword = asyncErrorWrapper(async (req, res, next) => {
  const { resetPasswordToken } = req.query;
  const { password } = req.body;
  if (!resetPasswordToken) {
    return next(new CustomError("Token is invalid", 400));
  }
  let user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    // resetPasswordExpire: { $gt : Date.now()}
  });
  if (!user) {
    return next(new CustomError("Invalid Token or Session Expired", 404));
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  return res.status(200).json({
    success: true,
    message: "Process Successful",
  });
});

const imageUpload = asyncErrorWrapper(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      profileImage: req.savedProfileImage,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Image Upload Success",
    data: user,
  });
});

const getUser = (req, res, next) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};

const editDetails = asyncErrorWrapper(async (req, res, next) => {
  const editInformation = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, editInformation, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = {
  register,
  login,
  logout,
  editDetails,
  imageUpload,
  forgotPassword,
  resetPassword,
  getUser,
};
