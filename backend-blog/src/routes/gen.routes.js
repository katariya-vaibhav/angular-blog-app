import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { GenContent } from "../controllers/GenAi.controller.js";


const router = Router()
router.use(verifyJWT)

router.route("/gencontent").post(GenContent)


export default router