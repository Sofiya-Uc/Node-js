//router is used to get routes in express
import { Router } from "express";
import { deactiveStudent, activeStudent, updateStudent, getStudents, getStudent, loginStudent, registerStudent, deleteStudent } from "../controllers/student.controller.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = Router();

//router 
// router.route('/register', registerStudent);
router.post('/register', registerStudent);
router.post('/login', asyncHandler(loginStudent));
router.get('/', asyncHandler(getStudents));
router.patch('/update/:id', asyncHandler(updateStudent));
router.delete('/delete/:id', asyncHandler(deleteStudent));
router.patch('/:id/active', asyncHandler(activeStudent));
router.patch('/:id/deactive', asyncHandler(deactiveStudent));
router.get('/:id', asyncHandler(getStudent));
export default router