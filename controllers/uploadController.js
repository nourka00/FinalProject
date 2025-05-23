import path from "path";
import CourseMaterial from "../models/courseMaterial.js";
import { uploadPDF } from "../utils/uploadToSupabase.js";
import { fileURLToPath } from "url";
import { Course } from "../models/index.js";
import supabase from "../config/supabase.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function uploadCourseMaterial(req, res) {
  try {
    const file = req.file; // File is now in memory (Buffer)
    const { courseId, title, materialType } = req.body;

    // Validate course exists (important!)
    const courseExists = await Course.findByPk(courseId);
    if (!courseExists) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Upload to course-specific folder
    const folderPath = `course-${courseId}/`; // Folder for the course

    // Validate required fields
    if (!file || !courseId || !title || !materialType) {
      return res.status(400).json({
        message: "File, courseId, title, and materialType are required",
      });
    }

    // Upload directly from memory (no local file)
    const publicUrl = await uploadPDF(
      file.buffer, // Use file.buffer instead of reading from disk
      file.originalname,
      courseId
    );

    if (!publicUrl) {
      return res.status(500).json({ message: "Supabase upload failed" });
    }
    // 2. Save metadata to PostgreSQL via Sequelize
    const newMaterial = await CourseMaterial.create({
      course_id: courseId,
      title: title,
      material_type: materialType, // Must be "pdf" or "document" (per your ENUM)
      file_url: publicUrl,
      uploaded_at: new Date(),
    });

    // Respond with the saved database record
    res.status(201).json({
      message: "Upload successful",
      url: publicUrl,
      material: newMaterial, // Includes all Sequelize model fields (id, title, etc.)
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error" });

  }

}

export const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params; // Material ID

    // Get material record
    const material = await CourseMaterial.findByPk(id);
    if (!material)
      return res.status(404).json({ message: "Material not found" });

    // Extract file path from URL (e.g., "course-123/file.pdf")
    const filePath = material.file_url.split("/public/")[1];

    // Delete from Supabase
    const { error: supabaseError } = await supabase.storage
      .from("course-materials")
      .remove([filePath]);

    if (supabaseError) throw supabaseError;

    // Delete database record
    await material.destroy();

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed", error: error.message });
  }
};
