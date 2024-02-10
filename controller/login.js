import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import UserReg from "../models/userreg.js";

export async function loginUser(req, res) {
  try {
    const { phoneNumber, password } = req.body;

    const user = await UserReg.findOne({ phoneNumber: phoneNumber });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid phone number", code: 400 });
    }
    
    const passwordMatch = await bcrypt.compare(password, user?.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid password", success: false, code: 400 });
    } else {
      const token = jwt.sign({ phoneNumber: user.phoneNumber }, process.env.JWT_SECRET, { expiresIn: "1h" });

      return res.status(200).json({
        message: "Successfully logged in",
        data: user,
        accessToken: token,
        success: true,
        code: 200,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", success: false, code: 500 });
  }
}
