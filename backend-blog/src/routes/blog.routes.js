import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middlerware.js";
import {
  deleteBlog,
  getAllBlog,
  getBlogById,
  getOwnerBlog,
  updateBlog,
  uploadBlog,
} from "../controllers/blog.controller.js";

const router = Router();

router.route("/upload").post(verifyJWT, upload.single("image"), uploadBlog);
router.route("/getAllBlog").get(getAllBlog);
router.route("/owner-blog/:username").get(getOwnerBlog);
router.route("/get-blog/:id").get(getBlogById);
router.route("/update-blog/:id").put(
  verifyJWT,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  updateBlog
);
router.route("/delete-blog/:id").delete(verifyJWT, deleteBlog);
export default router;
