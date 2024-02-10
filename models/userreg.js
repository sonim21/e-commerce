import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
});

const UserReg = mongoose.model('Registration', registrationSchema);
export default UserReg;
