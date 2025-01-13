import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt } from 'react-icons/fa';
import Spinner from '../components/Spinner';

const BookCard = ({ book }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
    <div className="h-64 overflow-hidden">
      <img 
        src={book.photo} 
        alt={book.title}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{book.title}</h3>
      <p className="text-gray-600 mb-4">By {book.author}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Published: {book.publishYear}</span>
        <a
          href={book.driveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <FaExternalLinkAlt className="w-4 h-4" />
        </a>
      </div>
    </div>
  </div>
);

const BooksDisplay = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/books')
      .then((response) => {
        setBooks(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Library Collection
        </h1>
        
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <Link to={`/books/${book._id}`} key={book._id}>
                <BookCard book={book} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksDisplay;