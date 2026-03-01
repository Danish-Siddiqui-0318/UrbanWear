import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    pageBackground,
    pageText,
    mutedText,
    secondaryBorder,
} from "../theme/colors";
import { API_BASE_URL } from "../config/api";

function TrackOrder() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchEmail, setSearchEmail] = useState("");
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState("");

    const fetchOrdersByEmail = async (e) => {
        if (e) e.preventDefault();
        if (!searchEmail) return;

        try {
            setLoading(true);
            setError("");
            const response = await axios.get(`${API_BASE_URL}/orders/customer/${searchEmail}`);
            setOrders(response.data.orders || []);
            setSearched(true);
            localStorage.setItem("urbanwear_customer_email", searchEmail);
        } catch (err) {
            setError(err.response?.data?.message || "No orders found for this email.");
            setOrders([]);
            setSearched(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const savedEmail = localStorage.getItem("urbanwear_customer_email");
        if (savedEmail) {
            setSearchEmail(savedEmail);
            // We can't call fetchOrdersByEmail directly because it needs an event or we'd have to refactor it
            const autoFetch = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/orders/customer/${savedEmail}`);
                    setOrders(response.data.orders || []);
                    setSearched(true);
                } catch (err) {
                    console.error("Auto-fetch failed", err);
                } finally {
                    setLoading(false);
                }
            };
            autoFetch();
        } else {
            setLoading(false);
        }
    }, []);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return 'text-emerald-500';
            case 'cancelled': return 'text-red-500';
            case 'shipped': return 'text-blue-500';
            case 'processing': return 'text-amber-500';
            default: return 'text-neutral-500';
        }
    };

    return (
        <div className={`min-h-screen ${pageBackground} ${pageText}`}>
            <Navbar />
            <main className="pt-28 pb-20 px-4">
                <div className="mx-auto max-w-4xl">
                    <section className="flex flex-col gap-4 mb-12">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">
                            Track Orders
                        </p>
                        <h1 className="text-4xl font-bold tracking-tight">
                            Track Your Order
                        </h1>
                        <p className={`max-w-xl text-sm ${mutedText}`}>
                            Enter your email address to view your order history and track active shipments.
                        </p>
                    </section>

                    {/* Email Search Form */}
                    <div className={`p-8 rounded-3xl border ${secondaryBorder} bg-neutral-50 mb-12`}>
                        <form onSubmit={fetchOrdersByEmail} className="flex flex-col sm:flex-row gap-4">
                            <input 
                                type="email" 
                                value={searchEmail}
                                onChange={(e) => setSearchEmail(e.target.value)}
                                placeholder="Enter your order email"
                                className="flex-1 h-14 bg-neutral-50 border border-neutral-200 rounded-2xl px-6 text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                                required
                            />
                            <button 
                                type="submit"
                                className="h-14 px-10 bg-white text-slate-950 font-bold rounded-2xl hover:bg-emerald-500 transition-all duration-300"
                            >
                                View Orders
                            </button>
                        </form>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-pulse text-emerald-500 font-bold uppercase tracking-widest">Searching...</div>
                        </div>
                    ) : searched ? (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold px-2">Order History ({orders.length})</h2>
                            
                            {error && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
                                    {error}
                                </div>
                            )}

                            {orders.length === 0 ? (
                                <div className={`p-10 rounded-3xl border ${secondaryBorder} bg-neutral-50 text-center`}>
                                    <p className={mutedText}>No orders found for this email address.</p>
                                    <Link to="/shirt" className="text-emerald-500 text-sm font-bold mt-4 inline-block hover:underline">Start Shopping</Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <div key={order._id} className={`rounded-3xl border ${secondaryBorder} bg-neutral-50 overflow-hidden transition-all duration-500 hover:border-emerald-500/30`}>
                                            <div className="p-6 border-b border-neutral-200 flex flex-wrap justify-between items-center gap-4">
                                                <div>
                                                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Order ID</p>
                                                    <p className="text-sm font-mono text-neutral-900">#{order._id}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Status</p>
                                                    <p className={`text-xs font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                                        {order.status || 'Pending'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Total</p>
                                                    <p className="text-sm font-bold text-neutral-900">Rs.{order.total}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="p-6 bg-neutral-50">
                                                <div className="flex flex-col gap-4">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-neutral-100 bg-white shadow-sm">
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-sm font-bold text-neutral-900 mb-1">{item.name}</h4>
                                                                <div className="flex items-center gap-4">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Qty:</span>
                                                                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{item.quantity}</span>
                                                                    </div>
                                                                    <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Size:</span>
                                                                        <span className="text-[10px] font-bold text-neutral-900 uppercase tracking-widest">{item.size || 'N/A'}</span>
                                                                    </div>
                                                                    <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Price:</span>
                                                                        <span className="text-[10px] font-bold text-neutral-900 uppercase tracking-widest">Rs.{item.price}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right pl-4 border-l border-neutral-100">
                                                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">Subtotal</p>
                                                                <p className="text-sm font-bold text-emerald-500">Rs.{item.price * item.quantity}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-between items-center">
                                                <p className="text-[10px] text-neutral-500 font-medium">
                                                    Placed on {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                                <button className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest hover:underline">
                                                    View Receipt
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-20 opacity-30">
                            <svg className="w-20 h-20 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <p className="text-sm font-medium">Your history will appear here</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default TrackOrder;
