import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";

import CreateBooks from "./pages/CreateBooks";
import ShowBook from "./pages/ShowBook";
import EditBook from "./pages/EditBook";
import BookStore from './pages/BookStore';
import { SnackbarProvider } from "notistack";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import BookList from "./pages/BookList";

const App = () => {
  return (
    <ErrorBoundary>
      <SnackbarProvider>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/bookstore" element={<BookStore />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <BookList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Routes>
                      <Route path="books/create" element={<CreateBooks />} />
                      <Route path="books/:id" element={<ShowBook />} />
                      <Route path="books/edit/:id" element={<EditBook />} />
                      
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
