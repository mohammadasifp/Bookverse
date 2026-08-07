import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1]; // Get token from headers

        if (!token) {
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }

        console.log("🔹 JWT Token Received:", token);
        console.log("🔹 Using JWT Secret Key:", process.env.JWT_SECRET);


        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // ✅ Attach user to req

        // Fetch user details from DB
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ message: "User not found." });
        }

        req.user = user; // ✅ Attach full user object to request
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token.", error: error.message });
    }
};
