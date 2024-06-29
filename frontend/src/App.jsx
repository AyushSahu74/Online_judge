import React from "react";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import Problemset from "./Problemset.jsx";
import User_profile from "./User_profile.jsx";
import ProblemDetails from "./ProblemDetails.jsx";
import Me from "./Me.jsx";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Problemset />} />
        <Route path="/user" element={<User_profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/problem/:slug" element={<ProblemDetails />} />
        <Route path="/me" element={<Me />} />
      </Routes>
    </Router>
  );
}

export default App;
