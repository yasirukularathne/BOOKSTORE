import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import { FaBook, FaSearch, FaExternalLinkAlt, FaUser } from 'react-icons/fa';

const BookStore = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAdmin, setSelectedAdmin] = useState('all');
  const booksPerPage = 12;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.get('/books/all');
        setBooks(response.data);
      } catch (error) {
        console.error('Error:', error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const admins = [...new Set(books.filter(book => book.user).map(book => book.user.name))];

  const filteredBooks = books.filter(book =>
    (selectedAdmin === 'all' || (book.user && book.user.name === selectedAdmin)) &&
    (book.title.toLowerCase().includes(search.toLowerCase()) ||
     book.author.toLowerCase().includes(search.toLowerCase()))
  );

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
            <FaBook className="inline-block mr-2" />
            BookStore
          </h1>
          <div className="flex space-x-4 w-full sm:w-auto">
            <select
              value={selectedAdmin}
              onChange={(e) => setSelectedAdmin(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Admins</option>
              {admins.map(admin => (
                <option key={admin} value={admin}>{admin}</option>
              ))}
            </select>
            <div className="relative flex-1 sm:w-64">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search books..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentBooks.map((book) => (
            <div key={book._id} className="bg-white rounded-xl shadow-lg overflow-hidden 
                                         hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
              {book.photo ? (
                <img src={book.photo} alt={book.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <FaBook className="text-4xl text-gray-400" />
                </div>
              )}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{book.title}</h2>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                    <FaUser className="mr-1" />
                    {book.user?.name}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">By {book.author}</p>
                <p className="text-gray-500 mb-4">Published: {book.publishYear}</p>
                <div className="flex justify-between items-center">
                  <Link to={`/books/${book._id}`} 
                        className="text-blue-500 hover:text-blue-700">
                    View Details
                  </Link>
                  {book.driveLink && (
                    <a href={book.driveLink}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="text-green-500 hover:text-green-700 flex items-center">
                      <FaExternalLinkAlt className="mr-1" />
                      Read
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBooks.length > booksPerPage && (
          <div className="mt-8 flex justify-center space-x-2">
            {[...Array(Math.ceil(filteredBooks.length / booksPerPage))].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === i + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookStore;