import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt';

//schema means structure
const studentSchema = new Schema(
    {
    studentname: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
  },
password: {
  type: String,
  required: true
}, 

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 10,
    maxlength: 30
  },

  phone: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 11
  },

  age: {
    type: Number,
    required: true,
  },

  department: {
    type: String,
    required: true
  },

  level: {
    type: Number,
    required: true,
    enum: [100, 200, 300, 400]
  },

  isActive: {
    type: Boolean,
    default: true,
  }
},
    {
    timestamps: true //this is used for both createdAt and updatedAt
  }
);
/* studentSchema.pre("save"....) is basically saying before mongoose saves this student to mongoDB,
run this function first*/

studentSchema.pre("save", async function () {
  //isModified("password") asks "has the password value changed since this document was loaded/created
   if(!this.isModified("password")) {
    return;
   }
   
   this.password = await bcrypt.hash(this.password, 10);
});

//compare password
studentSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password);
}
export const Student = mongoose.model("Student", studentSchema);