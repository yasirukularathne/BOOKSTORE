import { useState } from 'react';
import BackButton from '../components/Backbutton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const CreateBooks = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [photo, setPhoto] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const validateDriveLink = (link) => {
    // Remove any /u/1/ or similar from the path
    const cleanedLink = link.replace(/\/u\/\d+\//, '/');
    
    // Standard format validation
    const driveLinkPattern = /^https:\/\/drive\.google\.com\/drive\/folders\/[a-zA-Z0-9_-]+$/;
    
    // Update link if valid but needs cleaning
    if (driveLinkPattern.test(cleanedLink) && link !== cleanedLink) {
      setDriveLink(cleanedLink);
      return true;
    }
    
    return driveLinkPattern.test(link);
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
      setFileError('');
      
      if (!file) return;

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setFileError('File size should be less than 5MB');
        return;
      }

      setPhotoPreview(URL.createObjectURL(file));
      
      setLoading(true);
      const base64 = await convertToBase64(file);
      setPhoto(base64);
      setLoading(false);
      
    } catch (error) {
      setLoading(false);
      setFileError('Error processing image');
      console.error('Error:', error);
    }
  };

  const handleSaveBook = () => {
    if (!title || !author || !publishYear || !photo || !driveLink) {
      enqueueSnackbar('Please fill all required fields', { variant: 'error' });
      return;
    }

    if (!validateDriveLink(driveLink)) {
      enqueueSnackbar('Invalid Google Drive link format', { variant: 'error' });
      return;
    }

    const data = {
      title,
      author,
      publishYear: Number(publishYear),
      photo,
      driveLink
    };

    setLoading(true);
    axios
      .post('http://localhost:5555/books', data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Book Created successfully', { variant: 'success' });
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar(error.response?.data?.message || 'Error creating book', { variant: 'error' });
        console.error(error);
      });
  };

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Create Book</h1>
      {loading && <Spinner />}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Title</label>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Author</label>
          <input
            type='text'
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Publish Year</label>
          <input
            type='number'
            value={publishYear}
            onChange={(e) => setPublishYear(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Photo</label>
          <input
            type='file'
            accept='image/*'
            onChange={handlePhotoChange}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
          {fileError && (
            <p className='text-red-500 mt-1'>{fileError}</p>
          )}
          {photoPreview && (
            <img 
              src={photoPreview} 
              alt="Preview" 
              className='mt-4 w-32 h-32 object-cover'
            />
          )}
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Drive Link</label>
          <input
            type='text'
            value={driveLink}
            onChange={(e) => setDriveLink(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <button 
          className='p-2 bg-sky-300 m-8 hover:bg-sky-400 transition rounded-lg text-white'
          onClick={handleSaveBook}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CreateBooks;