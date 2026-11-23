import { Router } from "express";
import auth from "../controllers/auth";

const router = Router();
// URL: /auth

router.post("/login", auth.login);
router.post("/register", auth.register);
router.post("/refresh", auth.refresh);
router.get("/logout", auth.logout);

export default router;
