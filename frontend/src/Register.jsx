import React, { useState } from "react";
import { registering } from "./services/api";
import { Link } from 'react-router-dom'; // Import for navigation links

function Register() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
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

    console.log("Registration details:", formData);

    try {
      const response = await registering(formData);
      Setmsg(response);
    } catch (error) {
      console.error("Registration error:", error);
      Setmsg("An error occurred during registration. Please try again later.");
    } finally {
      setFormData({
        firstname:"",
        lastname:"",
        username: "",
        email: "",
        password: "",
      });
    }
    
  };

  return (
    <div
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1718653158025-11a5b61178d8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
      }}
      className="w-full h-full p-2"
    >
      <div className="w-80 h-96 mx-auto my-44 bg-amber-500 p-4 rounded-3xl">
        <div className="mx-16 text-zinc-700 text-3xl font-sans md:font-serif">
          LogicLoop
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="firstname" className="my-4 font-sans md:font-serif">
            First Name:
          </label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
            className="rounded-md my-2 ml-4 border-gray-600"
          />
          <br />
          <label htmlFor="lastname" className="my-4 font-sans md:font-serif">
            Last Name:
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
            className="rounded-md my-2 ml-5 border-gray-600"
          />
          <br />
          <label htmlFor="username" className="my-4 font-sans md:font-serif">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="rounded-md my-2 ml-5 border-gray-600"
          />
          <br />
          <label htmlFor="email" className="my-4 font-sans md:font-serif">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="rounded-md my-2 ml-14 border-gray-600"
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
            Register
          </button>
        </form>
        <div className="ml-20">{msg}</div>
      </div>
    </div>
  );
}

export default Register;
