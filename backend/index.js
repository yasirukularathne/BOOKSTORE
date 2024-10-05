import booksRoute from './routes/booksRoute.js';  // Correct to singular to match the file name
import express from "express";
import mongoose from 'mongoose';
import { PORT, mongoDBURL } from './config.js';



const app = express();

// Middleware to parse JSON (needed for parsing POST request bodies)
app.use(express.json());

// Define the routes
app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send('Welcome to MERN stack Tutorial');
});

app.use('/books', booksRoute);  // Keep it singular here as well

// Connect to MongoDB
mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('App is connected to the database');
        // Listen to the server only after MongoDB connection is established
        app.listen(PORT, () => {
            console.log(`App is listening on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });
