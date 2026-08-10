import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import bookRoute from "./route/book.route.js";
import userRoute from "./route/user.route.js";
import favourites from "./route/favourites.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4001;
const URI = process.env.MongoDBURI;

app.use(cors());
app.use(express.json());

app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "uploads"))
);

app.use("/books", bookRoute);
app.use("/user", userRoute);
app.use("/favourites", favourites);

app.get("/", (req, res) => {
    res.send("Bookverse Backend is Running 🚀");
});

mongoose.connect(URI)
    .then(() => {
        console.log("✅ MongoDB Connected");

        app.listen(PORT, () => {
            console.log(`✅ Server is listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ MongoDB Error:", error);
    });