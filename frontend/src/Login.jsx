import React, { useState } from "react";
import { logging } from "./services/api";
import { Link } from 'react-router-dom'; // Import for navigation links

function login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [msg, Setmsg] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Login details:", formData);
    try {
      const response = await logging(formData);
      console.log(response)
      Setmsg(response);
    } catch (error) {
      console.error("Login error:", error);
      Setmsg("An error occurred during Login. Please try again later.");
    } finally {
      setFormData({
        username: "",
        password: "",
      });
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1718653158025-11a5b61178d8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
      }}
      className="w-full h-full p-10"
    >
      <div className="w-80 h-64 mx-auto my-44 bg-amber-500 p-4 rounded-3xl">
        <div className="mx-16 text-zinc-700 text-3xl font-sans md:font-serif">
          LogicLoop
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username" className="my-4 font-sans md:font-serif">
            Username:
          </label>
          <input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="rounded-md my-2 ml-6 border-gray-600"
          />
          <br />
          <label htmlFor="password" className="my-4 font-sans md:font-serif">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="rounded-md my-2 ml-7 border-gray-600"
          />

          <br />
          <button
            type="submit"
            className="rounded-md ml-24 my-3 text-xl border border-gray-600 px-4 py-0.5 bg-slate-500 text-slate-100"
          >
            {/* <Link to='http://localhost:5173/' > */}
            Login
            {/* </Link> */}
          </button>
        </form>
        <div className="ml-20">{msg}</div>
      </div>
    </div>
  );
}

export default login;
