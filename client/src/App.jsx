import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Shop from "./pages/Shop";
import NewArrivals from "./pages/NewArrivals";
import Collections from "./pages/Collections";
import Sale from "./pages/Sale";
import Account from "./pages/Account";
import Cart from "./pages/Cart";
import { PublicRoute, AdminRoute } from "./components/RouteGuards";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/new-arrivals" element={<NewArrivals />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/sale" element={<Sale />} />
                <Route path="/account" element={<Account />} />
                <Route path="/cart" element={<Cart />} />
                <Route
                    path="/admin/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
