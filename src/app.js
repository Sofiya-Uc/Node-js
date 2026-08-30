import express from "express";

const app = express();

app.use(express.json());


import studentRouter from "./routes/student.routes.js";
import courseRouter from "./routes/course.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import asyncHandler from "./middleware/asyncHandler.js";

app.use(errorHandler);
// route declaration
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/courses", courseRouter);
// example route: http://localhost:5000/api/v1/students/register
// example route: http://localhost:5000/api/v1/posts/create
//http://localhost:5000/api/v1/courses
export default app;
