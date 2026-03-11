import { Error } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../model/user.model.js";

import {
  deleteFileOnCloudinary,
  fileUploadOnCloudinary,
} from "../utils/fileupload.js";

const generateToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const token = user.genrateToken();

    return { token };
  } catch (error) {
    throw new Error("somethin went wrong while generating token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  console.log(req.body);

  if (!(username || email || password)) {
    return res
      .status(400)
      .json({ error: "Username, email, and password are required." });
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    return res.status(400).json({ error: "user already exist" });
  }

  // console.log(req.files);
  const avatarPath = req.files?.avatar[0].path;
  // console.log(avatarPath);

  if (!avatarPath) {
    return res.status(400).json({ error: "avatar path is required" });
  }

  const avatar = await fileUploadOnCloudinary(avatarPath);
  if (!avatar || !avatar.url) {
    return res.status(400).json({ error: "error while upload file..." });
  }
  // console.log(avatar);

  const user = await User.create({
    username,
    email,
    password,
    avatar: avatar.url || "",
  });

  const createdUser = await User.findById(user._id)?.select("-password");

  if (!createdUser) {
    return res.status(400).json({ error: "error while creating the user" });
  }

  res.status(201).json({
    message: "user created successfully",
    user: createdUser,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }
  const user = await User.findOne({
    $or: [{ email }, { password }],
  });
  if (!user) {
    return res.status(400).json({ error: "user not found" });
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ error: "password is incorrect" });
  }

  const { token } = await generateToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password ");

  const currentDate = Date.now();

  const option = {
    path: "/",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    expires: new Date(currentDate + 60 * 60 * 24 * 365 * 1000),
  };
  res.status(200).cookie("token", token, option).json({
    message: "user logged in successfully",
    loggedInUser,
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  const currentDate = Date.now();
  
  const option = {
    path: "/",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    expires: new Date(currentDate + 60 * 60 * 24 * 365 * 1000),
  };

  res.status(200).clearCookie("token", option).json({
    message: "user logged out successfully",
  });
});

// const genRefreshToken = asyncHandler(async (req, res) => {
//   const incomingRefreshToken = req.cookies?.refreshToken;
//   if (!incomingRefreshToken) {
//     throw new Error("refresh token is required");
//   }
//   const decordedToken = jwt.verify(
//     incomingRefreshToken,
//     process.env.REFRESH_TOKEN_SECRET
//   );
//   const user = await User.findById(decordedToken.id);
//   if (!user) {
//     throw new Error("user not found");
//   }

//   if (incomingRefreshToken !== req.cookies?.refreshToken) {
//     throw new Error("refresh token is not matched");
//   }

//   const { refreshToken, accessToken } =
//     await generateAccessTokenAndRefreshToken(user._id);

//   const option = {
//     httpOnly: true,
//     sameSite: "none",
//     secure: true,
//   };
//   res
//     .status(200)
//     .cookie("accessToken", accessToken, option)
//     .cookie("refreshToken", refreshToken, option)
//     .json({
//       message: "refresh token is generated successfully",
//       accessToken,
//       refreshToken,
//     });
// });

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    throw new Error("user not found");
  }
  const posts_lenght = user.posts.length;
  const userData = {
    user,
    posts_lenght,
  };
  res.status(200).json({
    message: "user found",
    userData,
  });
});

const updateCurrentPasswrod = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new Error("user not found");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new Error("old password is incorrect");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    message: "password updated successfully",
  });
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new Error("User not found");
  }

  let updatedFields = {};

  // If avatar is uploaded, update avatar
  if (req.files?.avatar) {
    const avatarPath = req.files.avatar[0].path;
    const avatar_public_id = user.avatar.split("/").pop().split(".")[0];
    await deleteFileOnCloudinary(avatar_public_id);
    const avatar = await fileUploadOnCloudinary(avatarPath);
    if (!avatar || !avatar.url) {
      throw new Error("Error while uploading the avatar file");
    }
    updatedFields.avatar = avatar.url;
  }

  // If username is changed, update username
  if (username && username !== user.username) {
    updatedFields.username = username;
  }

  // If email is changed, update email
  if (email && email !== user.email) {
    updatedFields.email = email;
  }

  // Update user with the modified fields
  const updateUser = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: updatedFields },
    { new: true }
  ).select("-password ");

  if (!updateUser) {
    throw new Error("update user not found");
  }

  const { token } = await generateToken(user._id);

  const currentDate = Date.now();

  const option = {
    path: "/",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    expires: new Date(currentDate + 60 * 60 * 24 * 365 * 1000),
  };

  res.status(200).cookie("token", token, option).json({
    message: "User details updated successfully",
    updateUser,
  });
});

const getUserById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const user = await User.findById(id).select("-password");
    if (!user) {
      throw new Error("user cannot fatched");
    }

    const posts_lenght = user.posts.length;

    res.status(200).json({
      message: "user fatched successfully",
      user,
      posts_lenght,
    });
  } catch (error) {
    throw new Error("user not fatched");
  }
});

const getAuthors = asyncHandler(async (req, res) => {
  try {
    const author = await User.find().select("-password");
    if (!author) {
      throw new Error("Authors not Fatched");
    }
    res.status(200).json({
      message: "Authors Fatched successfully",
      author,
    });
  } catch (error) {
    throw new Error("Authors not Fatched");
  }
});

// const google = asyncHandler(async (req, res) => {
//   const { username, email, avatar } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (user) {
//       const { accessToken, refreshToken } =
//         await generateAccessTokenAndRefreshToken(user._id);

//       const { password, ...rest } = user._doc;

//       res
//         .status(200)
//         .cookie("accessToken", accessToken, {
//           httpOnly: true,
//           sameSite: "none",
//         })
//         .cookie("refreshToken", refreshToken, {
//           httpOnly: true,
//           sameSite: "none",
//         })
//         .json(rest);
//     } else {
//       const generatedPassword =
//         Math.random().toString(36).slice(-8) +
//         Math.random().toString(36).slice(-8);

//       const user = await User.create({
//         username:
//           username.toLowerCase().split(" ").join("") +
//           Math.random().toString(9).slice(-4),
//         email,
//         avatar,
//         password: generatedPassword,
//       });

//       const createdUser = await User.findById(user._id)?.select("-password");

//       if (!createdUser) {
//         return res.status(400).json({ error: "error while creating the user" });
//       }
//       res.status(201).json({
//         message: "user created successfully",
//         user: createdUser,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.json({
//       error: error.message,
//     });
//   }
// });

export {
  registerUser,
  loginUser,
  logoutUser,
  // genRefreshToken,
  getCurrentUser,
  updateCurrentPasswrod,
  updateUserDetails,
  getUserById,
  getAuthors,
  // google,
};
