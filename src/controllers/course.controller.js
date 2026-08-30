import { Course } from "../models/course.model.js";
import { Student } from "../models/student.model.js";

const createCourse = async (req, res) => {

       const studentId = req.student;
        const { courseTitle, courseCode, department, level, units } = req.body;


        const student = Student.findById({_id: studentId});

        if(!student) return res.status(404).json ({
            message: "Student not found"
        });

        const existingCourse = await Course.findOne({
            courseCode: courseCode.toUpperCase()
        });
        
        if (existingCourse) return res.status(404).json ({
                message: "Course already exists"
            });

        const course = await Course.create({
            studentId, courseTitle, courseCode, department, level, units
        });
        res.status(200).json ({
            message: "Course created successfully",
            course,
        });
};

export {
    createCourse
};
        
  