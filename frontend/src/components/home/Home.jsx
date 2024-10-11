import React from 'react'
import Navbar from '../Navbar';
import Banner from '../Banner';
import Footer from '../Footer';

function home() {
  return (
    <>
      <Navbar />
      <Banner />
   
      <Freebook/>
      <Cards/>
      <Footer/>
    </>
  );
}

export default home
