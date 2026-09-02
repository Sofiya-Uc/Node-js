import dotenv from 'dotenv';
import connectDB from './config/database.js';
import app from './app.js';

import studentRouter from './routes/student.routes.js';
import courseRouter from './routes/course.routes.js';

dotenv.config({
    path: './.env'
});

const startServer = async () => {
    try {
        await connectDB();

        app.on("error", (error) => {
            console.log("ERROR", error);
            throw error;
        });

        app.use("/api/v1/students", studentRouter);
        app.use("/api/v1/courses", courseRouter);

        app.listen(process.env.PORT || 4000, () => {
           console.log(`server is running on port: ${process.env.PORT}`); 
        });

    } catch (error) {
        console.log("Connection failed!!!!", error);
        
    }
}

startServer();
