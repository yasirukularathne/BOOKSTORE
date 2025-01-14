import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../components/Backbutton";
import Spinner from "../components/Spinner";
import BookShelf from "../components/BookShelf";
import { FaExternalLinkAlt } from "react-icons/fa";

const ShowBook = () => {
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get(`http://localhost:5555/books/${id}`)
      .then((response) => {
        setBook(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching book:", error);
        setError("Failed to load book details");
        setLoading(false);
      });
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <BackButton />
      <h1 className="text-3xl my-4 text-center font-bold">Book Details</h1>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <BookShelf />
        </div>

        {loading ? (
          <div className="flex justify-center mt-8">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center text-lg">{error}</div>
        ) : (
          <div className="mt-8 flex flex-col border-2 border-sky-400 rounded-xl w-full md:w-fit p-4 mx-auto bg-white shadow-lg">
            {book.photo && (
              <div className="my-4">
                <span className="text-xl mr-4 text-gray-500">Book Cover</span>
                <img
                  src={book.photo}
                  alt={book.title}
                  className="mt-2 w-48 h-48 object-cover rounded-lg shadow-md mx-auto md:mx-0"
                />
              </div>
            )}
            <div className="my-4">
              <span className="text-xl mr-4 text-gray-500">Title</span>
              <span className="font-medium">{book.title}</span>
            </div>
            <div className="my-4">
              <span className="text-xl mr-4 text-gray-500">Author</span>
              <span>{book.author}</span>
            </div>
            <div className="my-4">
              <span className="text-xl mr-4 text-gray-500">Publish Year</span>
              <span>{book.publishYear}</span>
            </div>
            {book.driveLink && (
              <div className="my-4">
                <span className="text-xl mr-4 text-gray-500">Drive Link</span>
                <a
                  href={book.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-2 inline-flex"
                >
                  Open in Drive
                  <FaExternalLinkAlt />
                </a>
              </div>
            )}
            <div className="my-4">
              <span className="text-xl mr-4 text-gray-500">Created</span>
              <span>{formatDate(book.createdAt)}</span>
            </div>
            <div className="my-4">
              <span className="text-xl mr-4 text-gray-500">Updated</span>
              <span>{formatDate(book.updatedAt)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowBook;
