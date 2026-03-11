import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "token is missing" });
    }

    const decordedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    const user = await User.findById(decordedToken?.id).select(
      "-password"
    );

    if (!user) {
      throw new Error("invalid token ");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new Error("invalid token");
  }
});
