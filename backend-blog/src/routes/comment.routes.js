import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createComment, deleteComment, getComment, updateComment } from "../controllers/comment.controller.js";


const router = Router()
router.use(verifyJWT)

router.route("/create/:id").post(createComment)
router.route("/get-comment/:blogId").get(getComment)
router.route("/update-comment/:commentId").put(updateComment)
router.route("/delete-comment/:commentId").delete(deleteComment)

export default router