import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useSnackbar } from "notistack";
import BackButton from "../components/Backbutton";
import Spinner from "../components/Spinner";
import { FaImage, FaLink, FaTrash, FaDownload } from "react-icons/fa";

const EditBook = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publishYear: "",
    photo: "",
    driveLink: "",
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [downloadLoading, setDownloadLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const validateDriveLink = (link) => {
    // Remove any /u/1/ or similar from the path
    const cleanedLink = link.replace(/\/drive\/u\/\d+\//, "/drive/");

    // Standard format validation for folder links
    const driveLinkPattern = /^https:\/\/drive\.google\.com\/drive\/folders\/[a-zA-Z0-9_-]+$/;

    // Update link if valid but needs cleaning
    if (driveLinkPattern.test(cleanedLink) && link !== cleanedLink) {
      setFormData((prev) => ({ ...prev, driveLink: cleanedLink }));
      return true;
    }

    return driveLinkPattern.test(link);
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/books/${id}`);
        const book = response.data;
        setFormData({
          title: book.title,
          author: book.author,
          publishYear: book.publishYear,
          photo: book.photo,
          driveLink: book.driveLink,
        });
        setPhotoPreview(book.photo);
      } catch (error) {
        enqueueSnackbar("Error fetching book details", { variant: "error" });
      }
    };
    fetchBook();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.publishYear) {
      enqueueSnackbar("Please fill all required fields", { variant: "error" });
      return;
    }

    if (formData.driveLink && !validateDriveLink(formData.driveLink)) {
      enqueueSnackbar(
        "Invalid Google Drive link format. Please use folder link format.",
        { variant: "error" }
      );
      return;
    }

    setLoading(true);
    try {
      await api.put(`/books/${id}`, formData);
      enqueueSnackbar("Book updated successfully", { variant: "success" });
      navigate("/");
    } catch (error) {
      enqueueSnackbar("Error updating book", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setLoading(true);
      try {
        await api.delete(`/books/${id}`);
        enqueueSnackbar("Book deleted successfully", { variant: "success" });
        navigate("/");
      } catch (error) {
        enqueueSnackbar("Error deleting book", { variant: "error" });
        setLoading(false);
      }
    }
  };

  const handleDownload = async () => {
    if (!formData.driveLink) {
      enqueueSnackbar("No download link available", { variant: "error" });
      return;
    }

    setDownloadLoading(true);
    try {
      window.open(formData.driveLink, "_blank");
      enqueueSnackbar("Download started", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Error downloading book", { variant: "error" });
    } finally {
      setDownloadLoading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const handlePhotoChange = async (e) => {
    try {
      const file = e.target.files[0];
      setFileError("");

      if (!file) return;

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setFileError("File size should be less than 5MB");
        return;
      }

      setPhotoPreview(URL.createObjectURL(file));

      setLoading(true);
      const base64 = await convertToBase64(file);
      setFormData((prev) => ({ ...prev, photo: base64 }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setFileError("Error processing image");
      console.error("Error:", error);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <BackButton />
        <div className="flex items-center justify-center space-x-3 my-8">
          <h1 className="text-3xl font-bold text-gray-800">Edit Book</h1>
        </div>

        {loading && <Spinner />}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section - Left Side */}
          <div className="flex-1 bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Enter book title"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent transition duration-200"
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
                  value={formData.publishYear}
                  onChange={(e) =>
                    setFormData({ ...formData, publishYear: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Enter publish year"
                />
              </div>

              <div className="lg:hidden">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FaImage className="mr-2" /> Book Cover Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                  {fileError && (
                    <p className="mt-1 text-sm text-red-500">{fileError}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FaLink className="mr-2" /> Google Drive Link
                </label>
                <input
                  type="text"
                  value={formData.driveLink}
                  onChange={(e) =>
                    setFormData({ ...formData, driveLink: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Enter Google Drive folder link"
                />
              </div>

              <div className="flex items-center justify-between pt-6">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg 
                       hover:bg-red-600 transition duration-200"
                >
                  <FaTrash />
                  <span>Delete</span>
                </button>

                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={downloadLoading || !formData.driveLink}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg 
                         hover:bg-green-600 transition duration-200 disabled:opacity-50"
                  >
                    <FaDownload />
                    <span>{downloadLoading ? "Opening..." : "Read"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 
                         hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg 
                         hover:bg-blue-600 transition duration-200 disabled:opacity-50"
                  >
                    <span>{loading ? "Saving..." : "Save"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Photo Preview Section - Right Side */}
          <div className="hidden lg:block w-96">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <FaImage className="mr-2" /> Book Cover
              </h2>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
                {fileError && (
                  <p className="text-sm text-red-500">{fileError}</p>
                )}
                {photoPreview ? (
                  <div className="relative aspect-[3/4] w-full">
                    <img
                      src={photoPreview}
                      alt="Book Preview"
                      className="w-full h-full object-cover rounded-lg shadow-md"
                    />
                  </div>
                ) : (
                  <div className="aspect-[3/4] w-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <FaImage className="text-4xl text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBook;
