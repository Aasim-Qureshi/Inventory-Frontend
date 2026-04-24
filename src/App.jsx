import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import InventoryPage from "./pages/InventoryPage";
import TransactionsPage from "./pages/TransactionsPage";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="topnav">
          <NavLink to="/" className="topnav-brand">
            <span className="dot" />
            CementWorks
          </NavLink>
          <div className="topnav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              Inventory
            </NavLink>
            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              Transactions
            </NavLink>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<InventoryPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
