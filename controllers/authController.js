import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// In your authController.js
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, display_name } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      display_name,
      role: 'admin', // Explicitly set as admin
    });
    
    res.status(201).json({ message: "Admin registered", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, display_name } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      display_name,
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

const token = jwt.sign(
  { userId: user.id, name: user.name, role: user.role, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }, // Never return password
      raw: false // Get full model instance
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add cache busting for image URL if exists
    const userJson = user.toJSON();
    if (userJson.image_path) {
      userJson.image_path = `${userJson.image_path.split('?')[0]}?${Date.now()}`;
    }

    res.setHeader('Cache-Control', 'no-store');
    res.json({ user: userJson });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
