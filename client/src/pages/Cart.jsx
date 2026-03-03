import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../hooks/useCart";
import {
    pageBackground,
    pageText,
    mutedText,
    secondaryBorder,
    primaryGradient,
} from "../theme/colors";

function Cart() {
    const { cart, removeFromCart, updateQuantity, getCartTotal, itemCount } = useCart();
    const navigate = useNavigate();

    const subtotal = getCartTotal();
    const shipping = 1250;
    const total = subtotal + shipping;

    if (itemCount === 0) {
        return (
            <div className={`min-h-screen ${pageBackground} ${pageText}`}>
                <Navbar />
                <main className="pt-32 pb-20 px-4">
                    <div className="mx-auto max-w-xl text-center">
                        <div className="mb-8 flex justify-center">
                            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-emerald-500">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 118 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Your bag is empty</h1>
                        <p className={`${mutedText} mb-8`}>
                            Looks like you haven't added any UrbanGear to your bag yet. 
                            Explore our latest drops and find your style.
                        </p>
                        <Link 
                            to="/shirt" 
                            className={`inline-block px-10 py-4 bg-gradient-to-r ${primaryGradient} text-slate-950 font-bold rounded-2xl hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105`}
                        >
                            Start Shopping
                        </Link>
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
                    <h1 className="text-4xl font-bold mb-10">Your Bag ({itemCount})</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-6">
                            {cart.map((item) => (
                                <div 
                                    key={`${item._id}-${item.size}`} 
                                    className={`flex flex-col sm:flex-row gap-6 p-6 rounded-3xl border ${secondaryBorder} bg-neutral-50 group relative overflow-hidden transition-all duration-500 hover:border-emerald-500/30`}
                                >
                                    <div className="w-full sm:w-32 aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-900 flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1">{item.category}</p>
                                                <h3 className="text-lg font-bold text-neutral-900 mb-1 group-hover:text-emerald-500 transition-colors">{item.name}</h3>
                                                <p className={`${mutedText} text-xs font-bold uppercase tracking-wider`}>Size: {item.size}</p>
                                            </div>
                                            <p className="text-lg font-bold text-neutral-900">Rs.{item.price * item.quantity}</p>
                                        </div>

                                        <div className="flex items-center justify-between mt-6 sm:mt-0">
                                            <div className="flex items-center rounded-xl border border-neutral-200 bg-neutral-50 h-10 px-1">
                                                <button 
                                                    onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                                                    className="w-8 h-full flex items-center justify-center hover:text-emerald-500 transition-colors"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                                                </button>
                                                <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                                                    className="w-8 h-full flex items-center justify-center hover:text-emerald-500 transition-colors"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                </button>
                                            </div>

                                            <button 
                                                onClick={() => removeFromCart(item._id, item.size)}
                                                className="text-[11px] font-bold uppercase tracking-widest text-red-500/70 hover:text-red-500 transition-colors flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className={`p-8 rounded-3xl border ${secondaryBorder} bg-neutral-50 sticky top-32`}>
                                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                                
                                <div className="space-y-4 mb-8 text-sm">
                                    <div className="flex justify-between">
                                        <span className={mutedText}>Subtotal</span>
                                        <span className="font-bold">Rs.{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={mutedText}>Shipping</span>
                                        <span className="font-bold">{shipping === 0 ? "FREE" : `Rs.${shipping}`}</span>
                                    </div>
                                    {/*{shipping > 0 && (*/}
                                    {/*    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest bg-emerald-500/10 p-2 rounded-lg text-center">*/}
                                    {/*        Free shipping on orders over Rs.8000*/}
                                    {/*    </p>*/}
                                    {/*)}*/}
                                    <div className="pt-4 border-t border-neutral-200 flex justify-between text-lg">
                                        <span className="font-bold">Total</span>
                                        <span className="font-bold text-emerald-500">Rs.{total}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => navigate("/checkout")}
                                    className={`w-full h-14 bg-gradient-to-r ${primaryGradient} text-slate-950 font-bold rounded-2xl hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3`}
                                >
                                    Proceed to Checkout
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </button>
                                
                                <p className={`mt-6 text-[11px] text-center ${mutedText}`}>
                                    Prices are inclusive of all taxes and duties.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Cart;
