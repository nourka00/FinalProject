import { CourseMaterial } from "../models/index.js";

export const createMaterial = async (req, res) => {
  try {
    const { course_id, title, material_type, file_url } = req.body;
    const material = await CourseMaterial.create({
      course_id,
      title,
      material_type,
      file_url,
      uploaded_at: new Date(),
    });
    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMaterialsByCourse = async (req, res) => {
  try {
    const materials = await CourseMaterial.findAll({
      where: { course_id: req.params.courseId },
    });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
