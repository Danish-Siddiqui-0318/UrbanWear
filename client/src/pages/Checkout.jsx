import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
        phone: "",
        city: "",
        postalCode: "",
        country: "Pakistan",
    });
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const subtotal = getCartTotal();
    const shipping = subtotal > 8000 ? 0 : 250;
    const total = subtotal + shipping;

    useEffect(() => {
        if (itemCount === 0 && !orderPlaced) {
            navigate("/cart");
        }
    }, [itemCount, navigate, orderPlaced]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        let err = "";
        if (name === "customerName") {
            err = value.trim().length >= 2 ? "" : "Enter at least 2 characters";
        } else if (name === "customerEmail") {
            err = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Enter a valid email";
        } else if (name === "phone") {
            err = /^[0-9+\-\s]{10,14}$/.test(value) ? "" : "Enter a valid phone";
        } else if (name === "shippingAddress") {
            err = value.trim().length >= 10 ? "" : "Enter a complete address";
        } else if (name === "city") {
            err = value.trim().length >= 2 ? "" : "Enter a valid city";
        } else if (name === "postalCode") {
            err = value && !/^\d{5}$/.test(value) ? "Enter 5 digit postal code" : "";
        }
        setFieldErrors({ ...fieldErrors, [name]: err });
    };

    const validateAll = () => {
        const checks = {
            customerName: formData.customerName.trim().length >= 2,
            customerEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail),
            phone: /^[0-9+\-\s]{10,14}$/.test(formData.phone),
            shippingAddress: formData.shippingAddress.trim().length >= 10,
            city: formData.city.trim().length >= 2,
            postalCode: formData.postalCode ? /^\d{5}$/.test(formData.postalCode) : true
        };
        const nextErrors = {
            customerName: checks.customerName ? "" : "Enter at least 2 characters",
            customerEmail: checks.customerEmail ? "" : "Enter a valid email",
            phone: checks.phone ? "" : "Enter a valid phone",
            shippingAddress: checks.shippingAddress ? "" : "Enter a complete address",
            city: checks.city ? "" : "Enter a valid city",
            postalCode: checks.postalCode ? "" : "Enter 5 digit postal code",
        };
        setFieldErrors(nextErrors);
        return Object.values(checks).every(Boolean);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!validateAll()) {
                setLoading(false);
                setError("Please fix the highlighted fields.");
                return;
            }
            const orderData = {
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.phone,
                shippingAddress: formData.shippingAddress,
                city: formData.city,
                postalCode: formData.postalCode,
                country: formData.country,
                items: cart.map(item => ({
                    product: item._id || item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size || "",
                    image: item.image || ""
                })),
                total,
                paymentMethod: paymentMethod
            };

            const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
            
            setOrderPlaced(true);
            clearCart();
            // Clear cart from storage immediately to update navbar
            localStorage.removeItem("urbanwear_cart");
            window.dispatchEvent(new Event("cartUpdate"));

            // Redirect to the new order confirmation page
            navigate("/order-confirmation", { state: { order: response.data.order } });
            
        } catch (err) {
            setError(err.response?.data?.message || "Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className={`min-h-screen ${pageBackground} ${pageText}`}>
            <Navbar />
            <main className="pt-28 pb-20 px-4">
                <div className="mx-auto max-w-6xl">
                    <h1 className="text-4xl font-bold mb-10">Checkout</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Shipping Form */}
                        <div className={`p-8 rounded-3xl border ${secondaryBorder} bg-neutral-50`}>
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
                                            className={`w-full h-14 bg-neutral-50 border ${primaryBorder} rounded-2xl px-6 text-sm focus:border-emerald-500 focus:outline-none transition-colors`}
                                        />
                                        {fieldErrors.customerName && <p className="mt-1 text-[11px] text-red-600">{fieldErrors.customerName}</p>}
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
                                            className={`w-full h-14 bg-neutral-50 border ${primaryBorder} rounded-2xl px-6 text-sm focus:border-emerald-500 focus:outline-none transition-colors`}
                                        />
                                        {fieldErrors.customerEmail && <p className="mt-1 text-[11px] text-red-600">{fieldErrors.customerEmail}</p>}
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
                                            className={`w-full h-14 bg-neutral-50 border ${primaryBorder} rounded-2xl px-6 text-sm focus:border-emerald-500 focus:outline-none transition-colors`}
                                        />
                                        {fieldErrors.phone && <p className="mt-1 text-[11px] text-red-600">{fieldErrors.phone}</p>}
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
                                            className={`w-full bg-neutral-50 border ${primaryBorder} rounded-2xl p-6 text-sm focus:border-emerald-500 focus:outline-none transition-colors`}
                                        />
                                        {fieldErrors.shippingAddress && <p className="mt-1 text-[11px] text-red-600">{fieldErrors.shippingAddress}</p>}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-2">City</label>
                                            <input 
                                                required
                                                type="text" 
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Karachi"
                                                className={`w-full h-14 bg-neutral-50 border ${primaryBorder} rounded-2xl px-6 text-sm focus:border-emerald-500 focus:outline-none transition-colors`}
                                            />
                                            {fieldErrors.city && <p className="mt-1 text-[11px] text-red-600">{fieldErrors.city}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-2">Postal Code (Optional)</label>
                                            <input 
                                                type="text" 
                                                name="postalCode"
                                                value={formData.postalCode}
                                                onChange={handleInputChange}
                                                placeholder="e.g. 75500"
                                                className={`w-full h-14 bg-neutral-50 border ${primaryBorder} rounded-2xl px-6 text-sm focus:border-emerald-500 focus:outline-none transition-colors`}
                                            />
                                            {fieldErrors.postalCode && <p className="mt-1 text-[11px] text-red-600">{fieldErrors.postalCode}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-2">Country / Region</label>
                                        <input 
                                            required
                                            type="text" 
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className={`w-full h-14 bg-neutral-100 border ${primaryBorder} rounded-2xl px-6 text-sm focus:border-emerald-500 focus:outline-none transition-colors`}
                                        />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-bold">2</span>
                                        Payment Method
                                    </h2>
                                    <div className="space-y-4">
                                        <div 
                                            onClick={() => setPaymentMethod('cod')}
                                            className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                                                paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-500/5' : `border-neutral-200 bg-neutral-50 hover:border-neutral-400`
                                            }`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-5 h-5 rounded-full border-4 flex-shrink-0 transition-all duration-300 ${paymentMethod === 'cod' ? 'border-emerald-500 bg-slate-950' : 'border-neutral-300'}`}></div>
                                                <div>
                                                    <p className="text-sm font-bold">Cash on Delivery (COD)</p>
                                                    <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold">Available Nationwide</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div 
                                            onClick={() => setPaymentMethod('easypaisa')}
                                            className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                                                paymentMethod === 'easypaisa' ? 'border-emerald-500 bg-emerald-500/5' : `border-neutral-200 bg-neutral-50 hover:border-neutral-400`
                                            }`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-5 h-5 rounded-full border-4 flex-shrink-0 transition-all duration-300 ${paymentMethod === 'easypaisa' ? 'border-emerald-500 bg-slate-950' : 'border-neutral-300'}`}></div>
                                                <div>
                                                    <p className="text-sm font-bold">EasyPaisa</p>
                                                    <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold">Online Payment</p>
                                                </div>
                                            </div>
                                            {paymentMethod === 'easypaisa' && (
                                                <div className="mt-4 p-4 bg-emerald-500/10 rounded-xl text-xs space-y-2 animate-fade-in">
                                                    <p><span className="font-bold">Title:</span>Syed Muhammed Moiz Hussain</p>
                                                    <p><span className="font-bold">Phone No:</span> 03183640056</p>
                                                    <p className="mt-2 text-emerald-800 font-semibold">(After Transaction WhatsApp Us A Screenshot With Your Order Number at 03082251508 To Confirm The Payment)</p>
                                                </div>
                                            )}
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
                            <div className={`p-8 rounded-3xl border ${secondaryBorder} bg-neutral-50 sticky top-32`}>
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
                                                <p className="text-xs font-bold text-neutral-900 mt-1">Rs.{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 pt-6 border-t border-neutral-200 text-sm">
                                    <div className="flex justify-between">
                                        <span className={mutedText}>Subtotal</span>
                                        <span className="font-bold">Rs.{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={mutedText}>Shipping</span>
                                        <span className="font-bold">{shipping === 0 ? "FREE" : `Rs.${shipping}`}</span>
                                    </div>
                                    <div className="pt-4 border-t border-neutral-200 flex justify-between text-xl">
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
