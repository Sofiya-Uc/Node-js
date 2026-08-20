import { Course } from "../models/course.model.js";

const createCourse = async (req, res) => {
        const { courseTitle, courseCode, department, level, units } = req.body;

        const existingCourse = await Course.findOne({
            courseCode: courseCode.toUpperCase()
        });
        
        if (existingCourse) return res.status(404).json ({
                message: "Course already exists"
            });

        const course = await Course.create({
            courseTitle, courseCode, department, level, units
        });
        res.status(200).json ({
            message: "Course created successfully"
        });
};

export {
    createCourse
};
        
  