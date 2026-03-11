import { Router } from "express";
import {
  // genRefreshToken,
  getAuthors,
  getCurrentUser,
  getUserById,
  // google,
  loginUser,
  logoutUser,
  registerUser,
  updateCurrentPasswrod,
  updateUserDetails,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middlerware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);
// router.route("/google").post(google);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
// router.route("/refresh-token").post(genRefreshToken);
router.route("/get-current-user").get(verifyJWT, getCurrentUser);
router.route("/change-password").put(verifyJWT, updateCurrentPasswrod);
router.route("/change-user-details").put(
  verifyJWT,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  updateUserDetails
);
router.route("/get-user/:id").get(verifyJWT, getUserById);
router.route("/get-authors").get(getAuthors);
export default router;
