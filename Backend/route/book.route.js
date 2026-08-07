import express from "express";
import { getBook } from "../controller/book.controller.js";
import upload, { getFileUrl } from "../middilware/multer.js"; 
import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import Book from "../model/book.model.js";
import { authenticateToken } from "../controller/userAuth.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";
// Initialize router
const router = express.Router();

// // ✅ Define __dirname manually
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// // Configure Multer to store files in 'uploads' folder
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, "../uploads/")); // Save files in 'uploads/' directory
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//         cb(null, uniqueSuffix + path.extname(file.originalname)); // Rename file
//     },
// });

// const upload = multer({ storage: storage });


// **📌 Add New Book - With File Upload**
router.post("/add-book", authenticateToken, upload.fields([
    { name: "file", maxCount: 1 },  // Accept one file (Book PDF or doc)
    { name: "image", maxCount: 1 }, // Accept one image (Book cover)
]), async (req, res) => {
    try {
        // Check if user is an admin
        const user = await User.findById(req.user.id);
        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "You do not have admin access" });
        }

        // Handle file uploads
        const bookFile = req.files["file"] ? getFileUrl(req, req.files["file"][0].filename) : null;
        const bookImage = req.files["image"] ? getFileUrl(req, req.files["image"][0].filename) : null;

        // Create new book entry
        const book = new Book({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            image: bookImage,  // Save image path
            title: req.body.title,
            desc: req.body.desc,
            file: bookFile,  // Save book file path
        });

        await book.save();

        // Construct URLs
        const baseUrl = `${req.protocol}://${req.get("host")}/`;
        const downloadUrl = bookFile ? `${baseUrl}${bookFile}` : null;
        const imageUrl = bookImage ? `${baseUrl}${bookImage}` : null;

        // Send response
        res.status(201).json({ 
            message: "Book added successfully", 
            book: { ...book.toObject(), image: imageUrl, file: downloadUrl },  // ✅ Send full URLs
        });

    } catch (error) {
        console.error("🔥 Error in Add Book API:", error);  // ✅ Log the full error
        res.status(500).json({ 
            message: "Internal server error", 
            error: error.message  // ✅ Return error message
        });
    }
});


// Update books -- Admin
router.put("/update-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        const book = await Book.findByIdAndUpdate(bookid, {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            image: req.body.image,
            title: req.body.title,
            desc: req.body.desc,
            file: req.body.file,
        }, { new: true });

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json({ message: "Book updated successfully", book });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

// Delete book -- Admin
router.delete("/delete-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        const book = await Book.findByIdAndDelete(bookid);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

// Download a file by book ID
router.get("/download/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);

        if (!book || !book.file) {
            return res.status(404).json({ error: "No file found for this book" });
        }

        // ✅ Ensure correct file path
        const filePath = path.join(__dirname, "../uploads",path.basename(book.file));
        console.log("✅ File Path Attempted:", filePath);

        // ✅ Check if the file exists
        if (!fs.existsSync(filePath)) {
            console.log("❌ File does not exist:", filePath);
            return res.status(404).json({ error: "File not found" });
        }

        // ✅ Allow only PDF files for download
        if (path.extname(filePath).toLowerCase() !== ".pdf") {
            return res.status(403).json({ error: "Only PDF files can be downloaded" });
        }

        // ✅ Send the PDF file for download
        res.download(filePath, (err) => {
            if (err) {
                console.error("🔥 Error during file download:", err.message);
                return res.status(500).json({ error: "Failed to download file" });
            }
        });

    } catch (error) {
        console.error("🔥 Internal server error:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.get("/get-books-by-id/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json(book);
    } catch (error) {
        console.error("🔥 Backend error:", error);
        res.status(500).json({ message: "Server error" });
    }
});



// Get recent books
router.get("/get-recent-book", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 }).limit(8);
        return res.json({ status: "Success", data: books });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

// Get all books
router.get("/", getBook);

export default router;
