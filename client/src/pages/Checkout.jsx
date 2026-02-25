import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../hooks/useCart";
import {
    pageBackground,
    pageText,
    mutedText,
    secondaryBorder,
    primaryGradient,
    primaryBorder,
} from "../theme/colors";
import { API_BASE_URL } from "../config/api";

function Checkout() {
    const { cart, getCartTotal, clearCart, itemCount } = useCart();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        customerName: "",
        customerEmail: "",
        shippingAddress: "",
        phone: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [orderSuccess, setOrderSuccess] = useState(null);

    const subtotal = getCartTotal();
    const shipping = subtotal > 8000 ? 0 : 250;
    const total = subtotal + shipping;

    useEffect(() => {
        if (itemCount === 0 && !orderSuccess) {
            navigate("/cart");
        }
    }, [itemCount, navigate, orderSuccess]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const orderData = {
                ...formData,
                items: cart.map(item => ({
                    productId: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size,
                    image: item.image
                })),
                total,
                status: "pending"
            };

            const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
            
            setOrderSuccess(response.data.order);
            clearCart();
            // Clear cart from storage immediately to update navbar
            localStorage.removeItem("urbanwear_cart");
            window.dispatchEvent(new Event("cartUpdate"));
            
        } catch (err) {
            setError(err.response?.data?.message || "Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className={`min-h-screen ${pageBackground} ${pageText}`}>
                <Navbar />
                <main className="pt-32 pb-20 px-4">
                    <div className="mx-auto max-w-xl text-center">
                        <div className="mb-8 flex justify-center">
                            <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
                        <p className={`${mutedText} mb-2`}>
                            Thank you for your order, <span className="text-white font-bold">{orderSuccess.customerName}</span>.
                        </p>
                        <p className={`${mutedText} mb-8`}>
                            Order ID: <span className="text-emerald-500 font-mono">#{orderSuccess._id}</span>
                        </p>
                        <div className="space-y-4">
                            <Link 
                                to="/shop" 
                                className={`inline-block w-full px-10 py-4 bg-gradient-to-r ${primaryGradient} text-slate-950 font-bold rounded-2xl hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300`}
                            >
                                Continue Shopping
                            </Link>
                            <Link 
                                to="/" 
                                className="inline-block w-full text-sm font-bold text-neutral-500 hover:text-white transition-colors"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${pageBackground} ${pageText}`}>
            <Navbar />
            <main className="pt-28 pb-20 px-4">
                <div className="mx-auto max-w-6xl">
                    <h1 className="text-4xl font-bold mb-10">Checkout</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Shipping Form */}
                        <div className={`p-8 rounded-3xl border ${secondaryBorder} bg-white/5`}>
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-bold">1</span>
                                Shipping Information
                            </h2>
                            
                            {error && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-2">Full Name</label>
                                        <input 
                                            required
                                            type="text" 
                                            name="customerName"
                                            value={formData.customerName}
                                            onChange={handleInputChange}
                                            placeholder="Enter your full name"
                                            className={`w-full h-14 bg-white/5 border ${primaryBorder} rounded-2xl px-6 text-sm focus:border-emerald-500 focus:outline-none transition-colors`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-2">Email Address</label>
                                        <input 
                                            required
                                            type="email" 
                                            name="customerEmail"
                                            value={formData.customerEmail}
                                            onChange={handleInputChange}
                                            placeholder="Enter your email"
                                            className={`w-full h-14 bg-white/5 border ${primaryBorder} rounded-2xl px-6 text-sm focus:border-emerald-500 focus:outline-none transition-colors`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-2">Phone Number</label>
                                        <input 
                                            required
                                            type="tel" 
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Enter your phone number"
                                            className={`w-full h-14 bg-white/5 border ${primaryBorder} rounded-2xl px-6 text-sm focus:border-emerald-500 focus:outline-none transition-colors`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-2">Shipping Address</label>
                                        <textarea 
                                            required
                                            name="shippingAddress"
                                            value={formData.shippingAddress}
                                            onChange={handleInputChange}
                                            rows={3}
                                            placeholder="Enter your complete address"
                                            className={`w-full bg-white/5 border ${primaryBorder} rounded-2xl p-6 text-sm focus:border-emerald-500 focus:outline-none transition-colors`}
                                        />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-bold">2</span>
                                        Payment Method
                                    </h2>
                                    <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-4">
                                        <div className="w-5 h-5 rounded-full border-4 border-emerald-500 bg-slate-950"></div>
                                        <div>
                                            <p className="text-sm font-bold">Cash on Delivery (COD)</p>
                                            <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold">Available Nationwide</p>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full h-16 mt-8 bg-gradient-to-r ${primaryGradient} text-slate-950 font-bold rounded-2xl hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 flex items-center justify-center gap-3 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Processing...
                                        </div>
                                    ) : (
                                        <>
                                            Place Order (Rs.{total})
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className={`p-8 rounded-3xl border ${secondaryBorder} bg-white/5 sticky top-32`}>
                                <h2 className="text-xl font-bold mb-6">Review Items</h2>
                                
                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar mb-8">
                                    {cart.map((item) => (
                                        <div key={`${item._id}-${item.size}`} className="flex gap-4">
                                            <div className="w-16 h-20 rounded-xl overflow-hidden bg-neutral-900 flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xs font-bold truncate">{item.name}</h3>
                                                <p className={`${mutedText} text-[10px] font-bold`}>Qty: {item.quantity} • Size: {item.size}</p>
                                                <p className="text-xs font-bold text-white mt-1">Rs.{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 pt-6 border-t border-white/5 text-sm">
                                    <div className="flex justify-between">
                                        <span className={mutedText}>Subtotal</span>
                                        <span className="font-bold">Rs.{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={mutedText}>Shipping</span>
                                        <span className="font-bold">{shipping === 0 ? "FREE" : `Rs.${shipping}`}</span>
                                    </div>
                                    <div className="pt-4 border-t border-white/5 flex justify-between text-xl">
                                        <span className="font-bold">Total</span>
                                        <span className="font-bold text-emerald-500">Rs.{total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Checkout;
