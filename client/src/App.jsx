import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard/index";
import Shirt from "./pages/Shirt.jsx";
import Oversized_Shirt from "./pages/Oversized_Shirt.jsx";
import Trouser from "./pages/Trouser.jsx";
import Sale from "./pages/Sale";
import TrackOrder from "./pages/TrackOrder";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";
import OrderConfirmation from "./pages/OrderConfirmation";
import { PublicRoute, AdminRoute } from "./components/RouteGuards";
import Customize from "./pages/Customize.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shirt" element={<Shirt />} />
                <Route path="/OverSized_TShirts" element={<Oversized_Shirt />} />
                <Route path="/trousers" element={<Trouser />} />
                <Route path="/sale" element={<Sale />} />
                <Route path="/customise" element={<Customize />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/cart" element={<Cart />} />

                <Route path="/checkout" element={<Checkout />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
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
