import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../containers/login";
import VoiceBot from "../containers/voiceBot/VoiceBot";
import Home from "../containers/home";
import Logout from "../containers/logout";
import AddAvailability from "../containers/addAvailability";

const Router = () => {
  const { loading } = useContext(AuthContext);

  return (
    <>
      {loading ? (
        <div className="page-loader-container"><div className="loading__anim"></div></div>
      ) : (
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/add_availability" element={<AddAvailability />} />
            <Route path="/book_appointment" element={<VoiceBot />} />
            <Route path="/logout" element={<Logout />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      )}
    </>
  );
};

export default Router;