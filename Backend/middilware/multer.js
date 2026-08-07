import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Ensure "uploads" directory exists
const uploadPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);  // ✅ Save files in "uploads/" folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // ✅ Rename file
    },
});

// ✅ File Filter (Allow only PDFs for books)
const fileFilter = (req, file, cb) => {
    if (file.fieldname === "file" && path.extname(file.originalname).toLowerCase() !== ".pdf") {
        return cb(new Error("Only PDF files are allowed for books"), false);
    }
    cb(null, true);
};

// ✅ Initialize Multer with file filter
const upload = multer({ storage: storage, fileFilter });

// ✅ Function to Get Full File URL
export const getFileUrl = (req, filename) => {
    if (!filename) return null;
    return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

export default upload;
