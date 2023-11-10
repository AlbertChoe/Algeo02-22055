import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import Navbar from './component/Navbar';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Firstpage from './component/Firstpage';
import Aboutus from './component/AboutUs';
import Search from './component/Search';
import Search2 from './component/Search2';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div>
    {/* <Navbar/> */}
    <Router>
      
    <App />
    
      <Routes>
        <Route path="/Search" element={<Search2 />} />
        <Route path="/AboutUs" element={<Aboutus />} />
        <Route path="/" element={<Firstpage />} />
        {/* // Define other routes here */}
      </Routes>
    </Router>
   
  </div>
);

