import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Pages/login.jsx";
import Signup from "./Pages/signup.jsx";
import Home from "./Pages/Home.jsx";
import Task from './Pages/task.jsx';
import OTP from './Pages/OTP.jsx';
import Landing from './Pages/landing.jsx';
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <div className={isDark ? "dark" : "light"}>
      <Routes>
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route
          path="/"
          element={
            <Landing isDark={isDark} toggleTheme={toggleTheme} />
          }
        />

        <Route
          path="/login"
          element={
            <Login isDark={isDark} toggleTheme={toggleTheme} />
          }
        />

        <Route
          path="/signup"
          element={
            <Signup isDark={isDark} toggleTheme={toggleTheme} />
          }
        />

      <Route element={<ProtectedRoute />}>
       <Route
          path="/home"
          element={
            <Home isDark={isDark} toggleTheme={toggleTheme} />
          }
        />
       <Route
          path="/task"
          element={
            <Task isDark={isDark} toggleTheme={toggleTheme} />
          }
        />
      </Route>
        <Route
          path="/OTP"
          element={
            <OTP isDark={isDark} toggleTheme={toggleTheme} />
          }
        />
      </Routes>
    </div>
  );
};

export default App;