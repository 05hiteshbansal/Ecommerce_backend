const User = require("../models/user");
const BigPromise = require("../middleware/big_promise");
const CustomError = require("../utils/coustom_error");
const cookie_token = require("../utils/cookie_token");
const fileupload = require("express-fileupload");
const cloudinary = require("cloudinary");
const { reset } = require("nodemon");
const mail = require("../utils/send_email");
const crypto = require("crypto");
exports.signup = BigPromise(async (req, res, next) => {
  // photo in frontend
  let result;
  if (req.files) {
    let file = req.files.photo;
    console.log(file);
    result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "users",
      width: 150,
      crop: "scale",
    });
  }

  const { name, email, password } = req.body;
  if (!(email || name || password)) {
    return next(new CustomError("Please send all fields", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      Secure_url: result.secure_url,
    },
  });
  cookie_token(user, res);
});

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;
  if (!(email || password)) {
    return next(new CustomError("Please provide a email or password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new CustomError("not registered", 400));
  }

  const correctPass = await user.isValidatePassword(password);

  if (!correctPass) {
    return next(new CustomError("incorrect Password", 400));
  }

  cookie_token(user, res);
});

exports.logout = BigPromise((req, res, next) => {
  //delete the token
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "loged out successfully",
  });

  //res.send("successful")
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!email) {
    return next(new CustomError("no user exist with this email", 400));
  }

  const forgotToken = user.getPasswordToken();
  console.log(forgotToken);
  await user.save({ validateBeforeSave: false });

  const url = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgotToken}`;
  const message = `copy this link in a url  ${url}`;

  try {
    await mail({
      to: user.email,
      subject: "password reset Email",
      message,
    });

    res.status(200).json({
      success: true,
      message: "send successfully",
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new CustomError(error, 500));
  }
});

exports.forgotReset = BigPromise(async (req, res, next) => {
  const token = req.params.token;
  const encrypt_token = crypto.createHash("sha256").update(token).digest("hex");
  //console.log(encrypt_token)

  const user = await User.findOne({
    forgotPasswordToken: encrypt_token,
    forgotPasswordExpire: { $gt: Date.now() },
  }); //
  //console.log(user)
  if (!user) {
    return next(new CustomError("Token is invalid or expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new CustomError("not same", 400));
  }

  user.password = req.body.password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpire = undefined;
  await user.save();

  console.log(user, token);

  // send the token
  cookie_token(user, res);
});

// will do it later and try too solve the bug

exports.userDetailUpdate = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

exports.changePassword = BigPromise(async (req, res, next) => {
  const userId = req.user.id;
  console.log(userId);
  const user = await User.findById({ userId }).select("+password");
  const IsCorrectPassword = await user.isValidatePassword(req.body.oldPassword);

  if (!IsCorrectPassword) {
    return next(new CustomError("old password is incorrect", 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  cookie_token(user, res);
});

exports.userDetail = BigPromise(async (req, res, next) => {
  console.log(req.user.id , 500)
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

// not done

exports.updateUser = BigPromise(async (req, res, next) => {
  const userId = req.user.id;
  console.log(userId);
  const user = await User.findByIdAndUpdate(userId, data).select("+password");

  user.password = req.body.newPassword;
  await user.save();

  cookie_token(user, res);
});

// admin routes

exports.adminAllUser = BigPromise(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    success: true,
    user,
  });
});

exports.managerAllUser = BigPromise(async (req, res, next) => {
  const user = await User.find({ role: "user" });
  res.status(200).json({
    success: true,
    user,
  });
});

exports.adminOneUser = BigPromise(async (req, res, next) => {
  const user =await User.findById(req.params.id)
  
   if(!user){
    next(new CustomError("no user found",400))
   }

  res.status(200).json({
    success: true,
    user,
  });
});
