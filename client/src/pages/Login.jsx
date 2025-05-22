import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const { backendUrl, setIsUserLoggedIn ,getUserData} = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/signup", {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsUserLoggedIn(true);
          navigate("/");
          getUserData();
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          setIsUserLoggedIn(true);
          navigate("/");
          getUserData();
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
       console.log("Login error:", error.response?.data);
  toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div
      className="flex justify-center min-h-screen items-center px-5 sm:px-0 
   bg-gradient-to-br from-[#cbd5e1] via-[#94a3b8] to-[#64748b]

"
    >
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 top-5 cursor-pointer w-28 sm:left-20 sm:w-32"
      />
      <div className="shadow-lg w-full rounded-lg p-10 bg-slate-900 sm:w-96">
        <h2 className="text-3xl text-center font-semibold text-white mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center mb-6 text-sm text-gray-400">
          {state === "Sign Up"
            ? "Create your Account"
            : "Login to your account"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div
              className="flex mb-4 items-center w-full gap-3 rounded-full px-5
          py-2.5 bg-[#333A5C]"
            >
              <img src={assets.person_icon} alt="" />
              <input
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
                className="bg-transparent placeholder:text-gray-400 text-white outline-none"
                required
                placeholder="Full Name"
              />
            </div>
          )}
          <div
            className="flex mb-4 items-center w-full gap-3 rounded-full px-5
          py-2.5 bg-[#333A5C]"
          >
            <img src={assets.mail_icon} alt="" />
            <input
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              className="bg-transparent placeholder:text-gray-400 text-white outline-none"
              required
              placeholder="Email id"
            />
          </div>
          <div
            className="flex mb-4 items-center w-full gap-3 rounded-full px-5
          py-2.5 bg-[#333A5C]"
          >
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              className="bg-transparent placeholder:text-gray-400 text-white outline-none"
              required
              placeholder="Password"
            />
          </div>

          <p
            onClick={() => navigate("/reset-password")}
            className="text-indigo-500 cursor-pointer mb-4"
          >
            Forgot Password?
          </p>

          <button
            className="w-full py-2.5 rounded-full 
          bg-gradient-to-r from-indigo-500 to-indigo-900"
          >
            {state}
          </button>

          {state === "Sign Up" ? (
            <p className="text-gray-400 text-center mt-4 text-xs">
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                className="text-blue-400 cursor-pointer underline"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-gray-400 text-center mt-4 text-xs">
              Don't have an account?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="text-blue-400 cursor-pointer underline"
              >
                Signup here
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
