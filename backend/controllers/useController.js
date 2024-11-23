import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

const createToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Added token expiry
};

// Register user
const registerUser = async (req, res) => {
   const { name, password, email } = req.body;
   try {
      // Checking if user already exists
      const exists = await userModel.findOne({ email });
      if (exists) {
         return res.status(400).json({ success: false, message: "User already exists" });
      }

      // Validating email format & strong password
      if (!validator.isEmail(email)) {
         return res.status(400).json({ success: false, message: "Please enter a valid email" });
      }

      if (password.length < 8) {
         return res.status(400).json({ success: false, message: "Please enter a strong password" });
      }

      // Hashing user password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new userModel({
         name,
         email,
         password: hashedPassword
      });

      const user = await newUser.save();
      const token = createToken(user._id);
      res.status(201).json({ success: true, token });

   } catch (error) {
      console.error("Error during user registration:", error);
      res.status(500).json({ success: false, message: error.message || "Server error" }); // Enhanced error message
   }
};

// Login user
const loginUser = async (req, res) => {
   const { email, password } = req.body;
   try {
      // Check if user exists
      const user = await userModel.findOne({ email });
      if (!user) {
         return res.status(400).json({ success: false, message: "User not found" });
      }

      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(400).json({ success: false, message: "Incorrect password" });
      }

      const token = createToken(user._id);
      res.status(200).json({ success: true, token });

   } catch (error) {
      console.error("Error during user login:", error);
      res.status(500).json({ success: false, message: error.message || "Server error" });
   }
};

export { loginUser, registerUser };
