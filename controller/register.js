import bcrypt from 'bcrypt';
import UserReg from "../models/userreg.js";

export const addRegistration = async (req, res) => {
    try {
        const data = req.body;
        console.log('Received data:', data.phoneNumber);

        const exist = await UserReg.findOne({ phoneNumber: data?.phoneNumber });
        if (exist) {
            return res.status(400).json({ message: 'Registration already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data?.password, saltRounds);
        console.log("hashedPasswordhashedPassword",hashedPassword);

        const newRegistration = new UserReg({
            name: data?.name,
            phoneNumber: data?.phoneNumber,
            password: hashedPassword 
        });

        const response = await newRegistration.save();

        return res.status(201).json({ message: 'Registration successful', data: response });
    } catch (err) {
        console.error('Error during registration:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};
