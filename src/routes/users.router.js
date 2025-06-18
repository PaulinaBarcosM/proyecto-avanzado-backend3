import express from "express";
import usersController from "../controllers/users.controller.js";

const router = express.Router();

router.get("/", usersController.getAllUsers);
router.get("/:uid", usersController.getUser);
router.put("/:uid", usersController.updateUser);
router.delete("/:uid", usersController.deleteUser);

export default router;
