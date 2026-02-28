import React from "react"; // importing react
import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const categories = [
  "All",
  "Art",
  "Technology",
  "Startups",
  "Social Causes",
  "Education",
  "Healthcare",
  "Environment",
  "Food",
  "Gaming",
  "Music",
  "Film",
  "Design",
  "Fashion",
  "Community",
  "Others",
]; // project categories list

const Navbar = () => {
  const {user,logout}=useAuth();
const navigate=useNavigate();
const location = useLocation();
const [dark, setDark] = useState(() => {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme ? savedTheme === "dark" : true;
});

useEffect(() => {
  if (dark) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");   // ⭐ save
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");  // ⭐ save
  }
}, [dark]);

const toggleDark = () => {
  const html = document.documentElement;

  html.classList.toggle("dark");

  const isDark = html.classList.contains("dark");
  localStorage.theme = isDark ? "dark" : "light";

  setDark(isDark);
};

if (location.pathname === "/login" || location.pathname === "/signup") {
  return null;
}


  
  return (
    <div className="sticky top-0 z-50 glass">
      {/* sticky navbar */}

      {/* ===== TOP NAVBAR ===== */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo */}
       <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
  FundSpark
</h1>
        {/* gradient brand logo */}

        {/* Search Bar */}
        
        {/* responsive search bar */}

        {/* Right Buttons */}
        <div className="flex flex-wrap gap-2 justify-start md:justify-end">
          {/* 🌙 DARK MODE BUTTON */}
         <button
  onClick={() => setDark(!dark)}
  className="relative w-14 h-7 flex items-center bg-gray-300 dark:bg-grey-700 rounded-full p-1 transition"
>
  <div
    className={`w-5 h-5 flex items-center justify-center text-xs bg-white rounded-full shadow-md transform transition ${
      dark ? "translate-x-7" : ""
    }`}
  >
    {dark ? "🌙" : "☀"}
  </div>
</button>
         <button
  onClick={() =>
    user
      ? navigate("/start")
      : navigate("/login", { state: { from: "/start" } })
  }
  className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition font-medium"
>
  Start Project
</button>
{user && (
  <button
    onClick={() => navigate("/dashboard")}
    className="mr-4 px-4 py-1.5 rounded-full font-semibold text-white
bg-gradient-to-r from-indigo-500 to-cyan-500
hover:from-indigo-600 hover:to-cyan-600
shadow-md hover:shadow-lg transition"
  >
    Dashboard
  </button>
)}
       {user ? (
    <button
      onClick={logout}
      className="bg-red-500 text-white px-4 py-1.5 rounded-lg"
    >
      Logout
    </button>
  ) : (
    <button
      onClick={() => navigate("/login")}
      className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg"
    >
      Login
    </button>
  )}
</div>
      </div>

      {/* ===== CATEGORY BAR ===== */}
      <div className="max-w-7xl mx-auto px-6 pb-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div className="flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          {categories.map((item) => (
  <Link
    key={item}

    /* convert category name into URL-friendly format
       "Social Causes" → social-causes */
    to={`/category/${item.toLowerCase().replace(" ", "-")}`}

    className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-cyan-400 relative group transition capitalize"
  >
    {item}

    {/* underline animation */}
    <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full"></span>
  </Link>
))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;