import bcrypt from 'bcrypt';
import { Student } from '../models/student.model.js';

const registerStudent = async (req, res) => {
    try {
        const {studentname, password, email, phone, age, department, level} = req.body;

        
        //basic validation
        if (!studentname || !password || !email || !phone || !age || !department || !level) {
            return res.status(400).json({
                message: "All fields are required!"
            });
        }
        
        // to vaalidate the email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if(!emailRegex.test(email)) {
            return res.status(500).json({
                message: "please provide a valid email"
            });
        }
        
        //to validate the password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        
        if(!passwordRegex.test(password)) {
            return res.status(500).json({
                message: "password must contain at least 8 characters, an uppercase letter, a lowercasre letter, a number, and a special character."
            });
        }
        //check if the student already exist
        
        const existing = await Student.findOne({
            email: email.toLowerCase() 
        });
        
        if(existing) {
            return res.status(400).json({
                message: "Student already exist!!"
            });
        }
        
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

        res.status(201).json({
            message: "Student registered successfully!",
            student: {
                id: student._id, 
                email: student.email, 
                studentname: student.studentname}
        });

    } catch (error) {
        res.status(404).json({
            message: "Internal server error is here O!!", error: error.message
        });
        
    }
};

const loginStudent = async (req, res) => {
    try {
        
        // to check if the student already exists
        const {email, password} = req.body;
        const student = await Student.findOne({
            email: email.toLowerCase()   
        });

        if(!student) {
            return res.status(400).json ({
                message: "Student not found"
            });
        }

        // to validate the password
        const isMatch = await student.comparePassword(password);
        if(!isMatch) return res.status(400).json ({
            message: "Invalid Password"
        });

        if(student.isActive !== true) return res.status(404).json ({
            message: "Student is not active"
        });

        res.status(200).json ({
            message: "Login successful",
            student: {
                id: student._id, 
                email: student.email, 
                studentname: student.studentname}
        });


    } catch (error) {
        res.status(500).json ({
            message: "Internal Server Error"
        })
        
    }

};

const getStudents = async (req, res) => {
    try {
        const {
            search,
            department,
            level,
            isActive,
            page = 1,
            limit = 10
        } = req.query;
       
        console.log("Search:", search);
        const filter = {};

// Search by student name and email
        if (search) {
            filter.$or = [
                {studentname: { $regex: search, $options: "i" } },
                { email: {$regex: search, $options: "i" } }
            ];
        }

        console.log("Filter:", filter);

        // filter by department 
        if (department) {
            filter.department = department;
        }

        //filter by level
        if (level) {
            filter.level = level;
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
        
        res.status(200).json ({
            message: "Students retrieved successfully!",
            pagination: {
                currentPage,
                limit: pageLimit,
                totalStudents,
                totalPages
            },
            students
        });

    } catch (error) {
        res.status(500).json ({
            message: "Internal Server error",
            error: error.message
        });
    }

};


const getStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id).select("-password");
        
        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json ({
            message: "Student retrieved successfully!",
            student
        })
        
    } catch (error) {
        res.status(500).json ({
            message: "Internal server error",
            error: error.message
        });
        
    }
};

const updateStudent = async (req, res) => {
        const { id } = req.params;

        const updates = req.body;

        const student = await Student.findByIdAndUpdate(
            id,
            updates,
            {returnDocument: "after", runValidators: true}
        ).select("-password");

        if(!student) {
            return res.status(404).json ({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student updated successfully",
            student
            
        });
    };

const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findByIdAndDelete(id);

        if(!student) {
            return res.status(404).json ({
                message: "Student not found"
            });
        }

        res.status(200).json ({
            message: "Student deleted successfully!"
        });

    } catch (error) {
        res.status(500).json ({
            message: "Internal Server error", error
        });
    }
};

const activeStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findByIdAndUpdate(
            id,
            { isActive: true },
            { returnDocument: "after", runValidators: true }

        ).select("-password");
        
        if(!student) {
            return res.status(404).json ({
                message: "Student not found"
            });
        }

        res.status(200).json ({
            message: `Student ${student.isActive ? "activated": "deactivated"} successfully`,
            student
        });

    } catch (error) {
        res.status(500).json ({
            message: "Internal Server error", error
        });
    }
};

const deactiveStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findByIdAndUpdate(
            id,
            {isActive: false },
            { returnDocument: "after", runValidators: true}
        );

        if(!student) {
            return res.status(404).json ({
                message: "Student not found"
            });
        }

        res.status(200).json ({
            message: "Student deactivated successfully",
            student
        });

    
    } catch (error) {
        res.status(500).json ({
            message: "Internal Server error", error
        });
    }
};


export {
    registerStudent,
    loginStudent,
    getStudents,
    getStudent,
    updateStudent,
    deleteStudent,
    activeStudent,
    deactiveStudent
}