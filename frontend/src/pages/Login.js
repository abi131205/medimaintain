import React, { useState } from "react";
import API from "../services/api";

function Login({ setIsLoggedIn }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const res = await API.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      console.log(res.data);

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login successful");

      setIsLoggedIn(true);

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Login failed"
      );
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 via-white to-emerald-100">

    <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl p-10 w-[400px] border border-white/30">

      <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent mb-8">
        MediMaintain 🏥
      </h2>

      <div className="space-y-5">

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full p-4 rounded-2xl border border-white/40 bg-white/60 backdrop-blur-md focus:ring-2 focus:ring-cyan-400 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full p-4 rounded-2xl border border-white/40 bg-white/60 backdrop-blur-md focus:ring-2 focus:ring-cyan-400 outline-none"
        />

        <button
          onClick={handleLogin}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-lg hover:scale-105 transition duration-300 shadow-xl"
        >
          Login
        </button>

      </div>

    </div>

  </div>
  );
}
export default Login;