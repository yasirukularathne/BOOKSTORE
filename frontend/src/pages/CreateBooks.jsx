import { useState } from "react";
import { FaBook, FaImage, FaLink, FaSave } from "react-icons/fa";
import BackButton from "../components/Backbutton";
import Spinner from "../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth } from "../context/AuthContext";
import compressImage from "../utils/imageCompression";

const CreateBooks = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishYear, setPublishYear] = useState("");
  const [photo, setPhoto] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const validateDriveLink = (link) => {
    // Standard format validation for both file and folder links
    const filePattern = /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\/view(\?usp=sharing)?$/;
    const folderPattern = /^https:\/\/drive\.google\.com\/drive\/(u\/\d+\/)?folders\/[a-zA-Z0-9_-]+$/;

    // Clean the link if it's a folder link with /u/{number}/
    if (folderPattern.test(link)) {
      const cleanedLink = link.replace(/\/drive\/u\/\d+\//, "/drive/");
      if (link !== cleanedLink) {
        setDriveLink(cleanedLink);
        return true;
      }
    }

    // Return true if link matches either pattern
    return filePattern.test(link) || folderPattern.test(link);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handlePhotoChange = async (e) => {
    try {
      const file = e.target.files[0];
      setFileError("");

      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        setFileError("File size should be less than 10MB");
        return;
      }

      setPhotoPreview(URL.createObjectURL(file));
      setLoading(true);

      const compressedImage = await compressImage(file);
      setPhoto(compressedImage);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setFileError("Error processing image. Please try a different image.");
      console.error("Error:", error);
    }
  };

  const handleSaveBook = () => {
    if (!title || !author || !publishYear || !photo || !driveLink) {
      enqueueSnackbar("Please fill all required fields", { variant: "error" });
      return;
    }

    if (!validateDriveLink(driveLink)) {
      enqueueSnackbar("Invalid Google Drive link format", { variant: "error" });
      return;
    }

    const data = {
      title,
      author,
      publishYear: Number(publishYear),
      photo,
      driveLink,
      user: user._id,
    };

    setLoading(true);
    axios
      .post("http://localhost:5555/books", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Book Created successfully", { variant: "success" });
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar(
          error.response?.data?.message || "Error creating book",
          { variant: "error" }
        );
        console.error(error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <BackButton />
        <div className="flex items-center justify-center space-x-3 my-8">
          <FaBook className="text-4xl text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-800">Create New Book</h1>
        </div>

        {loading && <Spinner />}

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveBook();
            }}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Enter book title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Author
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Enter author name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Publish Year
              </label>
              <input
                type="number"
                value={publishYear}
                onChange={(e) => setPublishYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter publish year"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <FaImage className="mr-2" /> Book Cover Photo
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                  {fileError && (
                    <p className="mt-1 text-sm text-red-500">{fileError}</p>
                  )}
                </div>
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg shadow-md"
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <FaLink className="mr-2" /> Google Drive Link
              </label>
              <input
                type="text"
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter Google Drive folder link"
              />
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 
                         text-white rounded-lg transition duration-200 disabled:opacity-50 
                         disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <FaSave />
                <span>{loading ? "Saving..." : "Save Book"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBooks;
