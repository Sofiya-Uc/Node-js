import mongoose, {Schema, SchemaTypeOptions} from "mongoose";
const tokenSchema = new Schema({
    studentId: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        code: {
            type: Number,
            required: true
        }
}, {timestamps: true});

export const Token = mongoose.model("Token", tokenSchema);