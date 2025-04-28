import supabase from "../config/supabase.js";
import fs from "fs";

export async function uploadPDF(fileBuffer, fileName, courseId) {
    const folderPath = `course-${courseId}/`;
    const fullPath = folderPath + fileName;
  try {
    // Upload directly from the buffer (no file system reads)
    const { data, error } = await supabase.storage
      .from("course-materials")
      .upload(fullPath, fileBuffer, {
        contentType: "application/pdf",
        upsert: true, // Overwrite if file exists
      });

    if (error) throw error;
    return supabase.storage.from("course-materials").getPublicUrl(fullPath).data
      .publicUrl;

  } catch (error) {
    console.error("Supabase Error:", error.message);
    return null;
  }
}