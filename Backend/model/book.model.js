import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    image: String,
    title: String,
    desc:{
        type: String,
        required: true,
    },
    file: {
        type: String,
        required: [true, "Please provide a file"],
        validate: {
          validator: function (value) {
            // You can add custom validation for the file path here, for example:
            return value && value.endsWith(".pdf");
          },
          message: "File must be a .pdf",
        },
      },
}); 
const Book = mongoose.model("Book", bookSchema);

export default Book;