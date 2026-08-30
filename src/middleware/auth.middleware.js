import jwt from 'jsonwebtoken';
import { Student } from '../models/student.model.js';
import dotenv from 'dotenv';

dotenv.config()
// import { Student } from '../models/student.model';

const {JWT_SECRET} = process.env;

//middleware to check if token is valid
const auth = async (req, res, next) => { 
    const token = req.header("Authorization").split(" ")[1];
    console.log(`the token is ${token}`);
   
    if(!token) {
        return res.status(400).json({
            message: "No token, authorization denied"
        });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.student = await Student.findById(decoded.id).select("-password")

        if(!req.student) return res.status(401).json ({
            error: "Student not found"
        }); 
      next()
    } catch (error) {
        console.error("Auth middleware error: ", error);
        res.status(401).json ({
            message: "Token is not vaild"
        });
    }
};
//middleware to check role

const adminOnly = (req, res, next) => {
    if(req.student.role !== 'admin') {
        return res.status(404).json ({
            message: "Access Denied: Admin only"
        });
    }
    next(); 
}


export { auth, adminOnly};