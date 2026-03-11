import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";
import { createComment, deleteComment, getComment, updateComment, getAllComments, adminDeleteComment } from "../controllers/comment.controller.js";


const router = Router()
router.use(verifyJWT)

router.route("/create/:id").post(createComment)
router.route("/get-comment/:blogId").get(getComment)
router.route("/update-comment/:commentId").put(updateComment)
router.route("/delete-comment/:commentId").delete(deleteComment)

// Admin Routes
router.route("/admin/comments").get(verifyAdmin, getAllComments)
router.route("/admin/delete-comment/:commentId").delete(verifyAdmin, adminDeleteComment)

export default router