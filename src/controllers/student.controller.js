import studentService from '../service/student.service.js';


const registerStudent = async (req, res) => {
        const {studentname, password, email, phone, age, department, level} = req.body;
        const student = await studentService.registerStudent({studentname, password, email, phone, age, department, level});

         res.status(201).json({
            message: "Student registered successfully, check your email for verification code",
            student: {
                id: student._id, 
                email: student.email, 
                studentname: student.studentname}
        }); 
};

const verifyEmail = async(req, res) => {
      const {email, code} = req.body;

      if(!email || !code){

      }

      const student = await studentService.verifyEmail({email, code});

      res.status(201).json ({
        messsage: "Email Verification is successfull!",
        student
  
         });
};



const createAdmin = async (req, res) => {
    const {studentname, password, email, age, phone} = req.body;
    const student = await studentService.createAdmin({studentname, password, email, age, phone});

    res.status(201).json ({
        message: "Student register successfully",
        student: {
            id: student._id,
            studentname: student.studentname,
            email: student.email
        }
    });
}

const loginStudent = async (req, res) => {
        // to check if the student already exists
        const {email, password} = req.body;
        const { student, token } = await studentService.loginStudent({email, password});

        res.status(200).json ({
            message: "Login successful",
            student: {
                id: student._id, 
                email: student.email, 
                studentname: student.studentname,
                token
            }
        });
    };

const getStudents = async (req, res) => {

    console.log("this is the stuident")
        const {search, department, level, isActive, page = 1, limit = 10} = req.query;
        const { students, currentPage, pageLimit,totalStudents, totalPages }  = await studentService.getStudents({
            search, department, level, isActive, page, limit});
        
        res.status(200).json ({
            message: "Student retrieved successfully!",
            pagination: {
                currentPage,
                limit: pageLimit,
                totalStudents,
                totalPages
            },
            students
        });
};


const getStudent = async (req, res) => {
        const  id = req.student._id;
        const student = await studentService.getStudent({ id });

        res.status(200).json ({
            message: "Student retrieved successfully!",
            student
        });
        
    };

const updateStudent = async (req, res) => {
        const id  = req.student._id;
        const updates = req.body;

        const student = await studentService.updateStudent({ id, updates });

        res.status(200).json({
            message: "Student updated successfully",
            student
            
        });
    };

const updateStudentByAdmin = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const student = await studentService.updateStudentByAdmin({id, updates});

    res.status(200).json ({
        message: "Student updated successfully",
        student
    });

};

const deleteStudent = async (req, res) => {
        const { id }  = req.params;
        const student = await studentService.deleteStudent({ id });

        res.status(200).json ({
            message: "Student deleted successfully!"
        });
};

const activeStudent = async (req, res) => {
        const { id } = req.params;
        const student = await studentService.activeStudent({ id });

        res.status(200).json ({
            message: `Student ${student.isActive ? "activated": "deactivated"} successfully`,
            student
        });
};

const deactiveStudent = async (req, res) => {
        const { id } = req.params;

        res.status(200).json ({
            message: "Student deactivated successfully",
            student
        });
};


export {
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
}