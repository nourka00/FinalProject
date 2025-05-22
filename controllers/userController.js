import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import supabase from "../config/supabase.js";
export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
  try {
    const { display_name } = req.body;
    const userId = req.userId;

    const updates = { updated_at: new Date() };
    if (display_name) updates.display_name = display_name;

    let publicUrl = null; // Declare publicUrl here so it's available in the whole function

    if (req.file) {
      const { originalname, buffer } = req.file;
      // Upload to Supabase
      const fileName = `${Date.now()}-${originalname}`;
      const fileExt = req.file.originalname.split(".").pop();

      const { error: uploadError } = await supabase.storage
        .from("userprof")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        return res
          .status(500)
          .json({ error: "Image upload failed", details: uploadError.message });
      }

      // Get public URL
      publicUrl = supabase.storage.from("userprof").getPublicUrl(fileName)
        .data.publicUrl;

      updates.image_path = publicUrl;
    }

    const [updated] = await User.update(updates, {
      where: { id: userId },
    });

    if (!updated) return res.status(404).json({ message: "User not found" });

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] }, raw: false
    });
    if (publicUrl) {
      user.image_path = `${publicUrl}?${Date.now()}`;
      await user.save();
    }

    res.json({
      user: {
        ...user.toJSON(),
        // Only add timestamp if we have a new image
        image_path: publicUrl ? `${publicUrl}?${Date.now()}` : user.image_path,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updatePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect current password" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.updated_at = new Date();
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
