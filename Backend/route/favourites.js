import express from "express";
import User from "../model/user.model.js";
import Book from "../model/book.model.js";
import { authenticateToken } from "../controller/userAuth.js";

const router = express.Router();
//add bok to favourites
router.put("/add-book-to-favourites", authenticateToken , async (req, res)=> {
    try {
        const { bookid , id} =req.headers;
         // Check if user exists
        const userData = await User.findById(id);
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Check if the book is already in favourites
        const IsBookfavourites = userData.favourites.includes(bookid);
        if (IsBookfavourites) {
            return res.status(200).json({ message: "Book is already in favourites"});
        }
        
        // Add book to user's favourites
        await User.findByIdAndUpdate(id, {$push: {favourites:bookid}});
        return res.status(200).json({ message: "Book add to favourites"});
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}) 

//remove bok to favourites
router.delete("/remove-book-from-favourites", authenticateToken , async (req, res)=> {
    try {
        const { bookid , id} =req.headers;
         // Check if user exists
        const userData = await User.findById(id);
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Check if the book is already in favourites
        const IsBookfavourites = userData.favourites.includes(bookid);
        if (IsBookfavourites) {
            await User.findByIdAndUpdate(id, {$pull: {favourites:bookid}});
        }
        
        // Add book to user's favourites
        
        return res.status(200).json({ message: "Book removed from  favourites"});
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
router.get("/get-favourites-books", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;

        if (!id) {
            return res.status(400).json({ message: "User ID is required in headers" });
        }

        console.log("User ID from headers:", id);

        const userData = await User.findById(id).populate("favourites");

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Fetched user data:", userData);

        return res.json({
            status: "Success",
            data: userData.favourites,
        });
    } catch (error) {
        console.error("Error fetching favourite books:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

export default router;