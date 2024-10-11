import { Routes, Route } from "react-router-dom";
/*import Home from "./pages/Home";
import CreateBook from "./pages/CreateBooks";
import ShowBook from "./pages/ShowBook";
import EditBook from "./pages/EditBook";
import DeleteBook from "./pages/DeleteBook";*/
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import Footer from "./components/Footer";
import Freebook from "./components/Freebook";
import Cards from "./components/Cards";




const App = () => {
  return (
    <>
      {/* Navbar is outside the Routes so it appears on all pages */}
      <Navbar />
      <Banner />
   
      <Freebook/>
      <Cards/>
      <Footer/>

      
    </>
  );
}

export default App;
