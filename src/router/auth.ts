import { Router } from "express";
import { hasJWT } from "../middleware/has_jwt";
import { signupController, signinController, refresh, getCurrentUserController } from "../controller/auth.controller";
import { getCurrentUser } from "../utils/get_current_user";

const router = Router();

router.post("/refresh", refresh);
router.post("/signin", signinController);
router.post("/signup", signupController);
router.get("/current-user", getCurrentUserController);

router.get("/hi", hasJWT, (req, res) => {
    let userLOL = getCurrentUser(req)

    console.log(userLOL?.user_id)

    res.send("HI");
});

export default router;
