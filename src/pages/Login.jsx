import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({}); // ✅ ALWAYS OBJECT
  const [serverError, setServerError] = useState(""); // ✅ separate server error
  const [loading, setLoading] = useState(false);

  /* ================= VALIDATION ================= */
  const validate = (fieldValues = { email, password }) => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/; // improved

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

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setServerError("");
    setErrors({});

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        login(data.user);
        navigate("/");
      } else {
        setServerError(data?.message || "Invalid credentials");
      }
    } catch (err) {
      setServerError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100 dark:from-[#0f172a] dark:via-[#020617] dark:to-[#020617] px-4">

      <div className="w-full max-w-md p-8 rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-2xl">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-emerald-400 flex items-center justify-center text-white font-bold">
            ⚡
          </div>
          <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
            FundSpark
          </h1>
        </div>

        <h2 className="text-xl font-semibold text-center mb-1">
          Welcome back
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mt-2 mb-6">
          Sign in to continue supporting projects
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-6" >

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email address"
            className={`w-full px-4 py-3 rounded-xl
              bg-white/80 dark:bg-white/10
              border ${errors.email ? "border-red-400" : "border-gray-200 dark:border-white/10"}
              text-gray-800 dark:text-white
              placeholder-gray-400
              outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur`}
            value={email}
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);
              validate({ email: value, password });
            }}
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs dark:text-red-400">
              {errors.email}
            </p>
          )}

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            className={`w-full px-4 py-3 rounded-xl
              bg-white/80 dark:bg-white/10
              border ${errors.password ? "border-red-400" : "border-gray-200 dark:border-white/10"}
              text-gray-800 dark:text-white
              placeholder-gray-400
              outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur`}
            value={password}
            onChange={(e) => {
              const value = e.target.value;
              setPassword(value);
              validate({ email, password: value });
            }}
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="text-red-500 text-xs dark:text-red-400">
              {errors.password}
            </p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-indigo-500 to-cyan-500
              flex items-center justify-center gap-2
              hover:scale-[1.02] transition disabled:opacity-70"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {/* SERVER ERROR */}
          {serverError && (
            <p className="text-red-500 text-sm text-center">
              {serverError}
            </p>
          )}

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-semibold">
              Sign up
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;