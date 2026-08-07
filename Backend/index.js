import express from "express"; // Import Express
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose"; // Import Mongoose
import dotenv from "dotenv"; // Import dotenv for environment variables
import cors from "cors"; // Import CORS for handling cross-origin requests
import User from './model/user.model.js'; // Import your User model

import bookRoute from "./route/book.route.js";
import userRoute from "./route/user.route.js";
import favourites from "./route/favourites.js";

const app = express();

// ✅ Get __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;
const URI = process.env.MongoDBURI;

// Middleware
app.use(cors());
app.use(express.json());
// ✅ Serve static files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
console.log("MongoDB URI:", URI);

// Connect to MongoDB
mongoose.connect(URI)
.then(() => {
    console.log("Connected to mongoDB");
})
.catch((error) => {
    console.error("Error connecting to MongoDB: ", error);
});

app.get("/", (req, res) => {
    res.send("Backend Working");
});
app.use("/books", bookRoute);
app.use("/user", userRoute);
app.use("/favourites",favourites);

//Example route to use the User model
// app.get("/users", async (req, res) => {
//     try {
//         const users = await User.find(); // Fetch users from the database
//         res.json(users);
//     } catch (error) {
//         res.status(500).send(error.message); // Send error message if something goes wrong
//     }
// });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
