import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import { FaBook, FaEye, FaExternalLinkAlt } from "react-icons/fa";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/books", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBooks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <FaBook className="text-blue-500 text-3xl mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
          </div>
          <Link
            to="/books/create"
            className="w-full sm:w-auto bg-blue-500 text-white px-6 py-3 rounded-lg 
                     hover:bg-blue-600 transform hover:-translate-y-0.5 transition-all
                     duration-200 flex items-center justify-center space-x-2"
          >
            <span>Add New Book</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl 
                       transform hover:-translate-y-1 transition-all duration-200"
            >
              {book.photo ? (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={book.photo}
                    alt={book.title}
                    className="w-full h-full object-cover transform hover:scale-110 
                             transition-transform duration-200"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <FaBook className="text-gray-400 text-4xl" />
                </div>
              )}

              <div className="p-5 space-y-3">
                <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
                  {book.title}
                </h2>
                <p className="text-gray-600 text-sm">By {book.author}</p>
                <p className="text-gray-500 text-sm">
                  Published: {book.publishYear}
                </p>

                <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                  <Link
                    to={`/books/${book._id}`}
                    className="inline-flex items-center space-x-1 text-blue-500 
                             hover:text-blue-700 transition-colors duration-200"
                  >
                    <FaEye />
                    <span>View Details</span>
                  </Link>
                  {book.driveLink && (
                    <a
                      href={book.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-green-500 
                               hover:text-green-700 transition-colors duration-200"
                    >
                      <FaExternalLinkAlt />
                      <span>Read</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {books.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No books found. Add your first book!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList;
