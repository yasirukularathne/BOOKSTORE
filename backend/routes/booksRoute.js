import express from "express";
import { protect } from '../middleware/auth.js';
import Book from '../models/bookmodel.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Route for Save a new Book
router.post("/", async (request, response) => {
  try {
    const { title, author, publishYear, photo, driveLink } = request.body;

    if (!title || !author || !publishYear || !photo || !driveLink) {
      console.log('Missing fields:', { title, author, publishYear, photo: !!photo, driveLink });
      return response.status(400).send({
        message: "Send all required fields: title, author, publishYear, photo, driveLink",
      });
    }

    // Validate Google Drive link format
    const driveLinkPattern = /^https:\/\/drive\.google\.com\/drive\/folders\/[a-zA-Z0-9_-]+$/;
    if (!driveLinkPattern.test(driveLink)) {
      return response.status(400).send({
        message: "Invalid Google Drive link format",
      });
    }

    const newBook = {
      title,
      author,
      publishYear,
      photo,
      driveLink,
      user: request.user._id
    };

    console.log('Creating new book:', newBook);
    const book = await Book.create(newBook);

    return response.status(201).send(book);
  } catch (error) {
    console.log('Error creating book:', error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get All Books from database
router.get("/", async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.id });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for Get One Book from database by id
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const book = await Book.findById(id);

    return response.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Update a Book
router.put("/:id", async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response.status(400).send({
        message: "Send all required fields: title, author, publishYear",
      });
    }

    const { id } = request.params;

    const result = await Book.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: "Book not found" });
    }

    return response.status(200).send({ message: "Book updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Delete a book
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Book.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: "Book not found" });
    }

    return response.status(200).send({ message: "Book deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
