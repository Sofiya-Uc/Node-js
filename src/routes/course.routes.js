import { Router } from "express";
import { createCourse } from "../controllers/course.controller.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = Router();
router.post('/', createCourse);

export default router;