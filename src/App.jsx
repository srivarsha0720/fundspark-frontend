// Main routing controller of FundSpark

import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
// Navbar (always visible)
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";


import Category from "./pages/Category";

import ProjectDetails from "./pages/ProjectDetails";
import StartProject from "./pages/StartProject";
import Signup from "./pages/Signup";

import CreatorDashboard from "./pages/CreatorDashboard";


const App = () => {
  return (
<div className="min-h-screen bg-gradient-to-br 
from-indigo-50 via-blue-50 to-cyan-50 
dark:from-[#020617] dark:via-[#020617] dark:to-[#020617] 
text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* Navbar stays on all pages */}
      <Navbar />


      {/* Page switching happens here */}
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<Home />} />

       

        {/* Create fundraiser */}
        <Route path="/start" element={<StartProject />} />

        {/* Dynamic category page */}
        <Route path="/category/:category" element={<Category />} />

        <Route path="/project/:id" element={<ProjectDetails />} />
         <Route path="/login" element={<Login />} />
        
         <Route path="/signup" element={<Signup />} />
         <Route path="/dashboard" element={<CreatorDashboard />} />
         
         
      </Routes>
    </div>
  );
};

export default App;