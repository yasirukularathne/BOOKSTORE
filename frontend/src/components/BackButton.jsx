import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import PropTypes from "prop-types";

const BackButton = ({ destination = "/" }) => {
  return (
    <div className="flex">
      <Link
        to={destination}
        className="flex items-center space-x-2 px-6 py-2 bg-blue-900 hover:bg-blue-7000 
                   text-white rounded-lg transition duration-200 
                   disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        aria-label="Go back"
      >
        <BsArrowLeft className="text-xl" />
        <span className="hidden sm:inline">Back</span>
      </Link>
    </div>
  );
};

BackButton.propTypes = {
  destination: PropTypes.string,
};

export default BackButton;
