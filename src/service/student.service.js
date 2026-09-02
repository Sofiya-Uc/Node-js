import bcrypt from 'bcrypt';
import { Student } from '../models/student.model.js';
import { Token } from '../models/token.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sendMail from '../utils/mail.js';

dotenv.config()

const registerStudent = async (data) => {
//basic validation
const {studentname, password, email, phone, age, department, level} = data;
        if (!studentname || !password || !email || !phone || !age || !department || !level) {
            const err = new Error("All fields are required!");
            err.statusCode = 400;
            throw err;
        }
        // to vaalidate the email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if(!emailRegex.test(email)) {
            const err = new Error("Please provide a valid email");
            err.statusCode = 400;
            throw err;
        }
        
        //to validate the password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        
        if(!passwordRegex.test(password)) {
            const err = new Error("password must contain at least 8 characters, an uppercase letter, a lowercasre letter, a number, and a special character.");
            err.statusCode = 400;
            throw err;
        }
        //check if the student already exist
        const existing = await Student.findOne({
            email: email.toLowerCase() 
        });
        if(existing) {
            const err = new Error("Email already exist!");
            err.statusCode = 400;
            throw err;
        }

        const token = Math.floor(1000 + Math.random()*9000)
        
        const student = await Student.create({
            studentname,
            password: password,
            email: email.toLowerCase(),
            phone,
            age,
            department,
            level,
            loggedIn: false
        });

        const createToken =  await Token.create({
            studentId: student._id,
            code: token,
        });

        await sendMail(email, "Verify email", `Your registration was successful, use this code to verify your email: ${token}`);
        return student;
};

const verifyEmail = async(data) => {
      const {email, code} = data

      const student = await Student.findOne({email})

      if(student.isVerified === true){
        const err = new Error("Email is already verified");
        err.statusCode = 400;
        throw err;
      }

    //   console.log(`THE STUDENT ID IS ${student._id}`)
      
      const storedToken = await Token.findOne({studentId: student._id});

      console.log(`the entered code is ${code}`)
      console.log(`the stored token ${storedToken.code}`)

      if(code !== storedToken.code){
        const err = new Error("Invalid Token");
        err.statusCode = 400;
        throw err;
      }
      student.isVerified = true;

      await student.save()

      await Token.deleteOne({_id: storedToken._id});

      return student;
};

const createAdmin = async (data) => {
    const {studentname, password, email, age, phone} = data;
    if (!studentname || !password || !email ||!age || !phone) {
        const err = new Error("All fields are required");  
        err.statusCode = 400;
        throw err;
    }
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            const err = new Error("Invalid Email");
            err.statusCode = 400;
            throw err;
        }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/; 
    if(!passwordRegex.test(password)) {
        const err = new Error("password must contain at least 8 characters, an uppercase letter, a lowercasre letter, a number, and a special character.");
        err.statusCode = 400;
        throw err;
    } 
    const existing = await Student.findOne({
        email: email.toLowerCase()
    });
    if(existing) {
        const err = new Error("Student already exist!");
        err.statusCode = 400;
        throw err;
    }
 const student = await Student.create({
    studentname,
    password: password,
    email: email.toLowerCase(),
    age,
    phone,
    role: "admin",
    loggedIn: false
 });  
 return student;
};

const loginStudent = async (data) => {
    const {JWT_SECRET} = process.env;
        
    const {email, password} = data;
        const student = await Student.findOne({ email: email.toLowerCase() });
    
            if(!student) {
                const err = new Error("Student not found");
                err.statusCode = 400;
                throw err;
            }
            // to validate the password
            const isMatch = await student.comparePassword(password);
            if(!isMatch) {
                const err = new Error("Invaild password");
                err.statusCode = 400;
                throw err;
            }
    
            if(student.isActive !== true) {
                const err = new Error("Student is not active");
                err.statusCode = 400;
                throw err;
            }

            if(student.isVerified !== true) {
                const err = new Error("Email is not verified");
                err.statusCode = 400;
                throw err;
            }
            
            const token = jwt.sign(
                { id: student._id, email: student.email, role: student.role},
                JWT_SECRET,
                {expiresIn: "1h"}
            )
            return{student, token};
    };

const getStudents = async(data) => {
    const {search, email, department, level, isActive, page = 1, limit = 10} = data;
     const filter = {};

    filter.role = {$ne: "admin" };

// Search by student name and email
        if (search) {
            filter.$or = [
                {studentname: { $regex: search, $options: "i" } },
                { email: {$regex: search, $options: "i" } }
            ];
            
        }
console.log("Filter being used:", JSON.stringify(filter));
        // filter by department 
        if (department) {
            filter.department = { $regex: `^${department}$`, $options: "i" };
        }
        //filter by level
        if (level) {
            filter.level = level;
        }
        //filter by isActive
        if (isActive !== undefined) {
            filter.isActive = isActive;
        }
        //pagination
        const currentPage = Number(page);
        const pageLimit = Number(limit);

        const skip = (currentPage - 1) * pageLimit;
        
        // to get all students
        const students = await Student.find(filter)
            .select("-password")
            .skip(skip)
            .limit(pageLimit); 

          const totalStudents = await Student.countDocuments(filter);

        // Calculate total pages
        const totalPages = Math.ceil(totalStudents / pageLimit);
    return { 
        students,
        currentPage,
        pageLimit,
        totalStudents,
        totalPages 
    }; 

};

const getStudent = async (data) => {
    const { id } = data;
        const student = await Student.findById(id).select("-password");
        
        if (!student) {
            const err = new Error("Student not found");
            err.statusCode = 400;
            throw err;
        }
        return student;
};

const updateStudent = async (data) => {
    const { id, updates } = data;
    const allowedFields = ['studentname', 'phone', 'age'];

    const safeUpdates = {};

    for (const field of allowedFields) {
        if (updates[field] !== undefined) safeUpdates[field] = updates[field];
    }

    const student = await Student.findByIdAndUpdate(id, safeUpdates, {new: true, 
        runValidators: true }).select("-password");

       if(!student) {
            const err = new Error("Student not found!");
            err.statusCode = 400;
            throw err;
        }
        return student;
};

const updateStudentByAdmin = async (data) => {
    const {id, updates} = data;
    const adminAllowedFields = ['department', 'level', 'role'];
    const safeUpdates = {};
   // i used for here instead of foreach because i can stop the loop early and exist the whole function inside the loop
    for (const field of adminAllowedFields) {
        if(updates[field] !== undefined) safeUpdates[field]= updates[field];
    }
    const student = await Student.findByIdAndUpdate(id, safeUpdates, {returnDocument: 'after', 
        runValidators: true }).select("-password");

       if(!student) {
            const err = new Error("Student not found!");
            err.statusCode = 400;
            throw err;
        }
        return student;

};

const deleteStudent = async (data) => {
    const { id } = data;
       const student = await Student.findByIdAndDelete(id);
       
        if(!student) {
            const err = new Error("Student not found");
            err.statusCode = 400;
            throw err;
        }
        return student;
};

const activeStudent = async (data) => {
    const { id } = data;

    const student = await Student.findByIdAndUpdate(
            id,
            { isActive: true },
            { returnDocument: "after", runValidators: true }).select("-password");
        
        if(!student) {
            const err = new Error("Student not found");
            err.statusCode = 400;
            throw err;
        }
};

const deactiveStudent = async (data) => {
    const { id } = data;
    const student = await Student.findByIdAndUpdate(
            id,
            {isActive: false },
            { returnDocument: "after", runValidators: true});

        if(!student) {
            const err = new Error("Student not found");
            err.statusCode = 400;
            throw err;
        }
};

const studentService = {
    registerStudent,
    verifyEmail,
    createAdmin,
    loginStudent,
    getStudents,
    getStudent,
    updateStudent,
    updateStudentByAdmin,
    deleteStudent,
    activeStudent,
    deactiveStudent
};

export default studentService;