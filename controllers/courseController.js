import { Course } from "../models/index.js";
import { CourseMaterial } from "../models/index.js"; // Add CourseMaterial
import supabase from '../config/supabase.js'; // Adjust path as needed
import { Op } from "sequelize"; 
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
  } 
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, price, schedule, level, skills } = req.body;
    const course = await Course.create({
      title,
      description,
      price,
      schedule,
      level,
      skills,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCourseMaterials = async (req, res) => {
  try {
    const courseId = req.params.id;
    const folderPath = `course-${courseId}/`;
    // First verify the course exists
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    // 2. List all files in the course folder from Supabase
    const { data: files, error } = await supabase.storage
      .from("course-materials")
      .list(folderPath);

    if (error) throw error;
    // 3. Format response
    const materials = files.map((file) => ({
      name: file.name,
      url: `${
        process.env.SUPABASE_STORAGE_URL
      }/${folderPath}${encodeURIComponent(file.name)}`,
      lastModified: file.last_modified,
    }));

    res.json({
      course: { id: course.id, title: course.title }, // Basic course info
      materials: materials || [], // Empty array if no materials
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch materials",
      error: err.message,
    });
  }
};
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 1. Delete all related materials first
    const materials = await CourseMaterial.findAll({
      where: { course_id: req.params.id },
    });

    // Delete from Supabase
    const filePaths = materials.map((m) => m.file_url.split("/public/")[1]);

    if (filePaths.length > 0) {
      const { error } = await supabase.storage
        .from("course-materials")
        .remove(filePaths);
      if (error) throw error;
    }

    // 2. Delete the course
    await course.destroy();

    res.json({ message: "Course and all materials deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      message: "Deletion failed",
      error: error.message,
    });
  }
};

///relation in courses according to skills
export const getRelatedCourses = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findByPk(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.skills || course.skills.length === 0) {
      return res.json([]); // No skills, no related courses
    }

    const relatedCourses = await Course.findAll({
      where: {
        id: { [Op.ne]: courseId }, // Not the same course
        skills: {
          [Op.overlap]: course.skills, // PostgreSQL array overlap
        },
      },
      limit: 5, // (optional) Limit to 5 related courses
    });

    res.json(relatedCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch related courses" });
  }
};

///admin can update course
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const { title, description, price, schedule, level, skills } = req.body;

    // Update only fields provided
    course.title = title ?? course.title;
    course.description = description ?? course.description;
    course.price = price ?? course.price;
    course.schedule = schedule ?? course.schedule;
    course.level = level ?? course.level;
    course.skills = skills ?? course.skills; 

    course.updated_at = new Date();

    await course.save();

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update course" });
  }
};
