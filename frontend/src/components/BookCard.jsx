import { Link } from "react-router-dom";
import { FaBook } from "react-icons/fa";

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <div className="wrapper">
        {book.photo ? (
          <img src={book.photo} alt={book.title} className="cover-image" />
        ) : (
          <div className="fallback-cover">
            <FaBook />
          </div>
        )}
      </div>
      <div className="content">
        <h2 className="title">{book.title}</h2>
        <p className="copy">By {book.author}</p>
        <div className="buttons">
          <Link to={`/books/${book._id}`} className="btn">
            View Details
          </Link>
          {book.driveLink && (
            <a
              href={book.driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Read Book
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
