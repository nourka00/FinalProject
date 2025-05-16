import { Course } from "../models/index.js";
import { CourseMaterial } from "../models/index.js"; // Add CourseMaterial
import supabase from '../config/supabase.js'; // Adjust path as needed
import { Op } from "sequelize"; 
import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

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
    const { title, description, price, schedule, level, skills ,image} = req.body;
    const fileBuffer = req.file?.buffer; // If using multer for file upload

    const course = await Course.create({
      title,
      description,
      price,
      schedule,
      level,
      skills,
      image,
      created_at: new Date(),
      updated_at: new Date(),
    });

    if (fileBuffer) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("course-images")
        .upload(`course-${course.id}-thumbnail.png`, fileBuffer, {
          contentType: "image/png", // update if jpeg, etc.
        });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from("course-images")
        .getPublicUrl(`course-${course.id}-thumbnail.png`);

      await course.update({ image: publicData.publicUrl });
    }

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
// export const updateCourse = async (req, res) => {
//   try {
//     const course = await Course.findByPk(req.params.id);

//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }
//     const data = req.body || {}; 
//     const { title, description, price, schedule, level, skills, image } = data;

//     // Update only fields provided
//     course.title = title ?? course.title;
//     course.description = description ?? course.description;
//     course.price = price ?? course.price;
//     course.schedule = schedule ?? course.schedule;
//     course.level = level ?? course.level;
//     course.image = image ?? course.image; 
//   if (skills) {
//       const parsedSkills = JSON.parse(skills);
//       if (Array.isArray(parsedSkills)) course.skills = parsedSkills;
//     }
//     if (req.file) {
//       const { buffer, originalname, mimetype } = req.file;
//       const fileName = `course-${course.id}-${Date.now()}-${originalname}`;
//       const { error: uploadError } = await supabase.storage
//         .from("course-cover")
//         .upload(fileName, buffer, { contentType: mimetype });

//       if (uploadError) throw uploadError;

//       const { data: publicData } = supabase.storage
//         .from("course-cover")
//         .getPublicUrl(fileName);

//       course.image = publicData.publicUrl;
//     }

//     course.updated_at = new Date();

//     await course.save();

//     res.json(course);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to update course" });
//   }
// };
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update basic fields
    const { title, description, price, schedule, level, skills } = req.body;

    course.title = title ?? course.title;
    course.description = description ?? course.description;
    course.price = price ?? course.price;
    course.schedule = schedule ?? course.schedule;
    course.level = level ?? course.level;

    // Handle skills update
    if (skills) {
      try {
        const parsedSkills =
          typeof skills === "string" ? JSON.parse(skills) : skills;
        if (Array.isArray(parsedSkills)) course.skills = parsedSkills;
      } catch (e) {
        console.error("Error parsing skills:", e);
      }
    }

    // Handle image upload
    if (req.file) {
      const { buffer, originalname, mimetype } = req.file;

      // Delete old image if it exists
      if (course.image) {
        const oldImagePath = course.image.split("/").pop();
        await supabase.storage.from("course-cover").remove([oldImagePath]);
      }

      // Upload new image
      const fileName = `course-${course.id}-${Date.now()}-${originalname}`;
      const { error: uploadError } = await supabase.storage
        .from("course-cover")
        .upload(fileName, buffer, {
          contentType: mimetype,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("course-cover").getPublicUrl(fileName);

      course.image = publicUrl;
    } else if (req.body.image) {
      // Allow direct URL update if no file is uploaded
      course.image = req.body.image;
    }

    course.updated_at = new Date();
    await course.save();

    res.json(course);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      message: "Failed to update course",
      error: error.message,
    });
  }
};