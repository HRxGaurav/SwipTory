import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();


const register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(422).json({ error: "Please fill in all fields properly" });
    }

    try {
        const userExist = await User.findOne({ username });

        if (userExist) {
            return res.status(422).json({ error: "User already registered" });
        } else {
            const hashPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, password: hashPassword });            
            await newUser.save();
            const userLogin = await User.findOne({ username })
            const token = jwt.sign({ userID: userLogin._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' })
            res.status(201).json({ message: "User registered successfully", username:username, token:token, id:userLogin._id });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ error: 'Please fill the data' })
        }

        const userLogin = await User.findOne({ username })
        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            if (!isMatch) {
                res.status(400).json({ error: "Invalid Credentials" });
            } else {
                // Generate JWT Token
                const token = jwt.sign({ userID: userLogin._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' }) 
                res.status(200).json({ message: "User Logged in successfully", token: token, username:userLogin.username, id:userLogin._id })
            }
        } else {
            res.status(400).json({ error: "Invalid Credentials" })
        }

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
}

const loggedIn= async (req, res) => {
    const token = req.header('Authorization');
    if (!token) {
      res.status(401).json({ message: 'failed' });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      res.status(200).json({ message: 'success', user: decoded.userID });
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };



export default { login, register, loggedIn};
