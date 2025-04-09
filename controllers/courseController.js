import { Course } from "../models/index.js";

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, price, schedule, level } = req.body;
    const course = await Course.create({
      title,
      description,
      price,
      schedule,
      level,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
