import { Router } from "express";
import { createCourse } from "../controllers/course.controller.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();
router.post('/', auth, createCourse);

export default router;