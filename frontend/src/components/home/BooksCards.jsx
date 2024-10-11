/*import PropTypes from 'prop-types'; // Import PropTypes*/


import BooksSingleCard from './BooksSingleCard';

const BooksCard = ({ books }) => {
  
    return (
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {books.map((item) => (
            <BooksSingleCard key={item._id} book={item} />
          ))}
        </div>
  );
};

// PropTypes validation
BooksCard.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      publishYear: PropTypes.number.isRequired, // Changed to number
    })
  ).isRequired,
};

export default BooksCard;
