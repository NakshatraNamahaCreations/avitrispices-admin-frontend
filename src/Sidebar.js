/*eslint-disable*/
import React from "react";
import { useLocation } from "react-router-dom"; // To detect current route
import { 
  FaTachometerAlt, 
  FaBoxOpen, 
  FaList, 
  FaWarehouse, 
  FaShoppingCart, 
  FaUsers, 
  FaBullhorn, 
  FaChartPie, 
  FaTag
} from "react-icons/fa";
import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation(); // Get the current route path

  const routes = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "Products", path: "/products", icon: <FaBoxOpen /> },
    { name: "Categories", path: "/categories", icon: <FaList /> },
    { name: "Inventory", path: "/inventory", icon: <FaWarehouse /> },
    { name: "Orders", path: "/orders", icon: <FaShoppingCart /> },
    { name: "Customers", path: "/customers", icon: <FaUsers /> },
    { name: "Enquiry", path: "/contactpage", icon: <FaBullhorn /> },
    { name: "Blog", path: "/blog", icon: <FaBullhorn /> },

    // { name: "Offers", path: "/voucher", icon: <FaTag /> }, 
  ];
  
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h4></h4>
      </div>
      <div className="sidebar-links">
        {routes.map((route, index) => (
          <div
            key={index}
            className={`sidebar-link ${
              location.pathname === route.path ? "active" : ""
            }`}
            onClick={() => (window.location.href = route.path)} // Change route on click
          >
            <span className="sidebar-icon">{route.icon}</span>
            <span className="sidebar-text">{route.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
