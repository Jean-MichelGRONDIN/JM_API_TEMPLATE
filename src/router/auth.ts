import { Router } from "express";
import { doesCurrentUserExist } from '../middleware/doesCurrentUserExist';
import { signupController, signinController, refresh, getCurrentUserController } from "../controller/auth.controller";

const router = Router();

router.post("/refresh", refresh);
router.post("/signin", signinController);
router.post("/signup", signupController);
router.get("/current-user", doesCurrentUserExist, getCurrentUserController);

export default router;
