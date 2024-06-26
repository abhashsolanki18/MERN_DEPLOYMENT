import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Popup from "./Popup";

function Signup() {
  const history = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios
        .post("https://mern-deployment-backend.vercel.app/signup", {
          email,
          name,
          password,
        })
        .then((res) => {
          if (res.data === "exist") {
            setPopupMessage("User already exists");
            setIsPopupOpen(true);
            setRedirectToLogin(true);
          } else if (res.data === "notexist") {
            history("/upload", { state: { id: email } });
          }
        })
        .catch((e) => {
          setPopupMessage("Wrong details");
          setIsPopupOpen(true);
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    if (redirectToLogin) {
      history("/login");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">Signup</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 100 8V4a8 8 0 010 16z"
                  ></path>
                </svg>
                <span>Loading...</span>
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">Already have an account?</p>
          <Link
            to="/login"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
      <Popup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        message={popupMessage}
      />
    </div>
  );
}

export default Signup;
