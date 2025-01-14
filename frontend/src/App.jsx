import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import Home from './pages/Home';
import CreateBooks from './pages/CreateBooks';
import ShowBook from './pages/ShowBook';
import EditBook from './pages/EditBook';
import DeleteBook from './pages/DeleteBook';
import BooksDisplay from './pages/BooksDisplay';
import CSSPlayground from './pages/CSSPlayground';
import Register from './pages/Register';
import { SnackbarProvider } from 'notistack';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';

const App = () => {
  return (
    <ErrorBoundary>
      <SnackbarProvider>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="books" element={<BooksDisplay />} />
                      <Route path="books/create" element={<CreateBooks />} />
                      <Route path="books/:id" element={<ShowBook />} />
                      <Route path="books/edit/:id" element={<EditBook />} />
                      <Route path="books/delete/:id" element={<DeleteBook />} />
                    </Routes>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </AuthProvider>
      </SnackbarProvider>
    </ErrorBoundary>
  );
};

export default App;
