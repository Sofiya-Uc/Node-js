//router is used to get routes in express
import { Router } from "express";
import { registerStudent, createAdmin, loginStudent, getStudents, getStudent, updateStudent, updateStudentByAdmin, deleteStudent, activeStudent, deactiveStudent } from "../controllers/student.controller.js";
import asyncHandler from "../middleware/asyncHandler.js"; 
import { auth, adminOnly } from "../middleware/auth.middleware.js";


const router = Router();

//router , 
//http://localhost:5000/api/v1/posts/update/:id
// router.route('/register', registerStudent);
router.post('/register', asyncHandler(registerStudent));

router.post('/admin', auth, adminOnly, asyncHandler(createAdmin));

router.post('/login',  asyncHandler(loginStudent));

router.get('/', auth,adminOnly,asyncHandler(getStudents));

router.patch('/update', auth, asyncHandler(updateStudent));

router.patch('/update/:id', auth, adminOnly, asyncHandler(updateStudentByAdmin));

router.delete('/delete/:id', auth, adminOnly, asyncHandler(deleteStudent));

router.patch('/:id/active', asyncHandler(activeStudent));

router.patch('/:id/deactive', asyncHandler(deactiveStudent));

router.get('/myProfile', auth, asyncHandler(getStudent));
export default router