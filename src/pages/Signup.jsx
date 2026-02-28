import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
 const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [errors, setErrors] = useState({});
 


const validate = (fieldValues = { name, email, password }) => {
  const newErrors = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

  if (!fieldValues.name?.trim())
    newErrors.name = "Name is required";

  if (!fieldValues.email)
    newErrors.email = "Email is required";
  else if (!emailRegex.test(fieldValues.email))
    newErrors.email = "Enter valid email";

  if (!fieldValues.password)
    newErrors.password = "Password is required";
  else if (!passRegex.test(fieldValues.password))
    newErrors.password =
      "Min 6 chars, include one letter & number";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSignup = async (e) => {
  e.preventDefault();
  if (!validate()) return;
  setLoading(true);//loader start
  setErrors({});

 

  try {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name,email, password }),
    });

    const data = await res.json();


  if (res.ok) {
      navigate("/login");
    } else {
      setErrors({server:data?.message || "Signup failed"});
    }
  } catch (err) {
    setErrors({server:"Server error.Please try again "});
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100 dark:from-[#0f172a] dark:via-[#020617] dark:to-[#020617] px-4">

  <div className="w-full max-w-md p-8 rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-2xl">
       <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
      Create Account
    </h1>

        <form onSubmit={handleSignup} className="space-y-4">
        <input
  type="text"
  placeholder="Full Name"
  className="w-full mt-6 mb-3 px-4 py-3 rounded-xl bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none"
  value={name}
 onChange={(e) => {
  const value = e.target.value;
  setName(value);
  validate({ name: value, email, password });
}}
/>
{errors.name && (
  <p className="text-red-500 text-xs mt-1">
    {errors.name}
  </p>
)}
          <input
            type="email"
            placeholder="Email"            
            className="w-full mb-3 px-4 py-3 rounded-xl bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none"
            value={email}
            onChange={(e) => {
  const value = e.target.value;
  setEmail(value);
  validate({ name, email: value, password });
  
}}
          />
          {errors.email && (
  <p className="text-red-500 text-xs mt-1">
    {errors.email}
  </p>
)}

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-3 rounded-xl bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none"
            value={password}
            onChange={(e) => {
  const value = e.target.value;
  setPassword(value);
  validate({ name, email, password: value });
}}
          />
{errors.password && (
  <p className="text-red-500 text-xs mt-1">
    {errors.password}
  </p>
)}
          <button
  disabled={loading}
  className="w-full py-3 rounded-xl font-semibold text-white
  bg-gradient-to-r from-indigo-500 to-cyan-500
  flex items-center justify-center gap-2
  hover:scale-[1.02] transition disabled:opacity-70"
>
  {loading && (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  )}

  {loading ? "Creating account..." : "Sign up"}
</button>
{errors.server && (
  <p className="text-red-500 text-sm text-center mt-2">
    {errors.server}
  </p>
)}

        </form>

        <p className="text-sm text-center mt-4">
          Already have account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;