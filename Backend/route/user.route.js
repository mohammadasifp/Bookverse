import express from "express";
import { login, signup} from "../controller/user.controller.js";
import { authenticateToken } from "../controller/userAuth.js";
import User from "../model/user.model.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// Get user information securely using authenticated token
router.get("/get-user-information", authenticateToken, async (req, res) => {
    try {
      // Instead of extracting from headers, get user ID from the token (decoded by middleware)
      const userId = req.user.id;
  
      // Find user and exclude password
      const user = await User.findById(userId).select("-password");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user info:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
export default router;