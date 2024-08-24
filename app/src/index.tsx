import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthRoute from "./components/auth/AuthRoute";

import './index.css';

import LoginPage from "./pages/login/login";
import RegisterPage from "./pages/register/register";
import HomePage from "./pages/home/home";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AuthRoute />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
