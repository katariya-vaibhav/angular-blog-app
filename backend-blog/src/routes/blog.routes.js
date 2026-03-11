import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";
import { upload } from "../middleware/multer.middlerware.js";
import {
  deleteBlog,
  getAllBlog,
  getBlogById,
  getOwnerBlog,
  updateBlog,
  uploadBlog,
  adminDeleteBlog,
  getBlogsWithCommentStats,
} from "../controllers/blog.controller.js";

const router = Router();

router.route("/upload").post(verifyJWT, upload.single("image"), uploadBlog);
router.route("/all").get(getAllBlog);
router.route("/owner/:username").get(getOwnerBlog);
router.route("/update/:id").put(verifyJWT, upload.single("image"), updateBlog);
router.route("/delete/:id").delete(verifyJWT, deleteBlog);
router.route("/get/:id").get(getBlogById);

// Admin routes
router.route("/admin/delete-blog/:id").delete(verifyJWT, verifyAdmin, adminDeleteBlog);
router.route("/admin/comment-stats").get(verifyJWT, verifyAdmin, getBlogsWithCommentStats);

export default router;
