import mongoose, {Schema, SchemaTypeOptions} from "mongoose";
const courseSchema = new Schema({
    studentId: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        
        courseTitle: {
            type: String,
            required: true,
            trim: true
        },

        courseCode: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        department: {
            type: String,
            required: true,
        },

         level: {
            type: Number,
            required: true,
            enum: [100, 200, 300, 400]
        },

        units: {
            type: Number,
            required: true,
        }
});

export const Course = mongoose.model("Course", courseSchema);