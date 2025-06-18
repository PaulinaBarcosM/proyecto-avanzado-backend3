import express from "express";
import adoptionsController from "../controllers/adoptions.controller.js";

const router = express.Router();

router.get("/", adoptionsController.getAllAdoptions);
router.get("/:aid", adoptionsController.getAdoption);
router.post("/:uid/:pid", adoptionsController.createAdoption);

export default router;
