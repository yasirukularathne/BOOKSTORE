import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import BackButton from "../components/Backbutton";
import Spinner from "../components/Spinner";
import { FaExternalLinkAlt, FaEdit } from "react-icons/fa";

const ShowBook = () => {
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/books/${id}`);
        setBook(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching book:", error);
        setError("Failed to load book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <BackButton />
      <h1 className="text-3xl my-4 text-center font-bold">Book Details</h1>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {book.photo && (
            <div className="mb-4">
              <img
                src={book.photo}
                alt={book.title}
                className="w-48 h-48 object-cover rounded mx-auto"
              />
            </div>
          )}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{book.title}</h2>
            <p className="text-gray-600">By {book.author}</p>
            <p className="text-gray-500">Published: {book.publishYear}</p>
          </div>
          <div className="flex justify-between items-center mt-6">
            {book.driveLink && (
              <a
                href={book.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
              >
                Open in Drive <FaExternalLinkAlt />
              </a>
            )}
            <Link
              to={`/books/edit/${book._id}`}
              className="inline-flex items-center text-yellow-600 hover:text-yellow-700 px-4 py-2 rounded-lg border border-yellow-600 hover:bg-yellow-50"
            >
              <FaEdit className="mr-2" />
              Edit Book
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowBook;
