import { CourseMaterial , Course, Purchase
 } from "../models/index.js";

 
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
export const getAllAccessibleMaterials = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      // Admin sees all materials
      const materials = await CourseMaterial.findAll({
        include: [
          {
            model: Course,
            attributes: ["id", "title"],
          },
        ],
        order: [["uploaded_at", "DESC"]],
      });
      return res.json(materials);
    } else {
      // Student: only show materials for their purchased courses
      const purchases = await Purchase.findAll({
        where: {
          user_id: req.user.id,
          status: "completed",
        },
        attributes: ["course_id"],
        raw: true,
      });

      const courseIds = purchases.map((p) => p.course_id);

      if (courseIds.length === 0) return res.json([]); // No courses => no materials

      const materials = await CourseMaterial.findAll({
        where: {
          course_id: courseIds, // ✅ Filter by enrolled courses
        },
        include: [
          {
            model: Course,
            attributes: ["id", "title"],
          },
        ],
        order: [["uploaded_at", "DESC"]],
      });

      return res.json(materials);
    }
  } catch (err) {
    console.error("Error fetching materials:", err);
    res.status(500).json({
      error: "Failed to fetch materials",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
