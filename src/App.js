import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from "./Sidebar";
import Header from "../src/Component/Header";
import Dashboard from "./Dashboard";
import ProductsPage from "./ProductsPage";
import Categories from "./Component/Categories";
import Inventory from "./Component/Inventory";
import OrdersPage from "./Component/OrdersPage ";
import Customer from "./Component/Customer";

import Login from "./Component/Login";

function App() {
  const isAuthenticated = !!localStorage.getItem("authToken");

  return (
    <Router>
      <MainLayout isAuthenticated={isAuthenticated} />
    </Router>
  );
}

function MainLayout({ isAuthenticated }) {
  const location = useLocation();
  const hideSidebar = location.pathname === "/";

  return (
    <div className="app">
     
      {!hideSidebar && <Header />}

    
      {isAuthenticated && !hideSidebar && <Sidebar />}

      <div className={hideSidebar ? "login-page" : "main-content"}>
        <Routes>
          <Route path="/" element={<Login />} />

        
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/products" element={isAuthenticated ? <ProductsPage /> : <Navigate to="/" />} />
          <Route path="/categories" element={isAuthenticated ? <Categories /> : <Navigate to="/" />} />
          <Route path="/inventory" element={isAuthenticated ? <Inventory /> : <Navigate to="/" />} />
          <Route path="/orders" element={isAuthenticated ? <OrdersPage /> : <Navigate to="/" />} />
          <Route path="/customers" element={isAuthenticated ? <Customer /> : <Navigate to="/" />} />
          
         
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

