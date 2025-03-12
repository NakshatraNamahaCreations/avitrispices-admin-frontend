// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Sidebar from "./Sidebar";
// import Dashboard from "./Dashboard";
// import ProductsPage from "./ProductsPage";
// import Categories from "./Component/Categories";
// import Inventory from "./Component/Inventory";
// import OrdersPage from "./Component/OrdersPage ";
// import Customer from "./Component/Customer";
// import Marketing from "./Component/Marketing";
// import Voucher from "./Component/Voucher";


// function App() {
//   return (
//     <Router>
//       <div className="app">
//         <Sidebar />
//         <div className="main-content">
//           <Routes>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/products" element={<ProductsPage />} />  
//             <Route path="/categories" element={<Categories />} /> 
//             <Route path="/inventory" element={<Inventory />} /> 
//             <Route path="/orders" element={<OrdersPage />} /> 
//             <Route path="/customers" element={<Customer />} /> 
//             <Route path="/marketing" element={<Marketing/>}/>
//             <Route path="/voucher" element={<Voucher/>}/>
//             {/* <Route path="/offers" element={<Offers/>}/> */}
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;


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
import Marketing from "./Component/Marketing";
import Voucher from "./Component/Voucher";
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
      {/* Show Header (Hidden on Login Page) */}
      {!hideSidebar && <Header />}

      {/* Show Sidebar only if authenticated and NOT on login page */}
      {isAuthenticated && !hideSidebar && <Sidebar />}

      <div className={hideSidebar ? "login-page" : "main-content"}>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Protected Routes (Redirect to Login if Not Authenticated) */}
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/products" element={isAuthenticated ? <ProductsPage /> : <Navigate to="/" />} />
          <Route path="/categories" element={isAuthenticated ? <Categories /> : <Navigate to="/" />} />
          <Route path="/inventory" element={isAuthenticated ? <Inventory /> : <Navigate to="/" />} />
          <Route path="/orders" element={isAuthenticated ? <OrdersPage /> : <Navigate to="/" />} />
          <Route path="/customers" element={isAuthenticated ? <Customer /> : <Navigate to="/" />} />
          <Route path="/marketing" element={isAuthenticated ? <Marketing /> : <Navigate to="/" />} />
          <Route path="/voucher" element={isAuthenticated ? <Voucher /> : <Navigate to="/" />} />

          {/* Redirect all unknown routes to dashboard if authenticated, else to login */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

