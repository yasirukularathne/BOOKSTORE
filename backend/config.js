import dotenv from 'dotenv';
dotenv.config();

export const PORT = 5555;

export const mongoDBURL = "mongodb+srv://root:root@cluster0.tdgn8.mongodb.net/books-collection?retryWrites=true&w=majority&appName=Cluster0";

export const jwtConfig = {
  secret: process.env.JWT_SECRET || "ec5e7b409743c5de6e0e9e3cd862614eae886eb47972593b5381a9ef722d5b1080d4b236a8a0259dfcedd733f41c2e2c1e575044bc4fc46545ee0325e89cfa53",
  expiresIn: '30d'
};

export const corsConfig = {
  origin: 'http://localhost:5173',
  credentials: true
};

export const AUTH_CONFIG = {
  passwordMinLength: 6,
  passwordMaxLength: 128,
  saltRounds: 10
};
