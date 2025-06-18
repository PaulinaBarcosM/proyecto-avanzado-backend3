import express from "express";
import sessionsController from "../controllers/sessions.controller.js";

const router = express.Router();

router.post("/register", sessionsController.register);
router.post("/login", sessionsController.login);
router.get("/current", sessionsController.current);
router.get("/unprotectedLogin", sessionsController.unprotectedLogin);
router.get("/unprotectedCurrent", sessionsController.unprotectedCurrent);

export default router;
