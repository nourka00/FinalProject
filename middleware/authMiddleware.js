import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export function protectAdmin(req, res, next) {
  verifyToken(req, res, () => {
    console.log('User role:', req.user.role); // Add this line
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Admin access required" });
    }
  });
}
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
 export const checkEnrollment = async (req, res, next) => {
   try {
     // Skip check for admins
     if (req.user.role === "admin") return next();

     const isEnrolled = await Purchase.findOne({
       where: {
         user_id: req.user.id,
         course_id: req.params.id, // Works for both :id and :courseId
       },
     });

     if (!isEnrolled) {
       return res.status(403).json({ message: "Not enrolled in this course" });
     }
     next();
   } catch (error) {
     res.status(500).json({ message: "Enrollment check failed" });
   }
 };