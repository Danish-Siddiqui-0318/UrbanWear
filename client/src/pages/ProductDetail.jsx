import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../hooks/useCart";
import {
    pageBackground,
    pageText,
    mutedText,
    primaryGradient,
} from "../theme/colors";
import { API_BASE_URL, WHATSAPP_NUMBER, WHATSAPP_COUNTRY_CODE, SITE_URL } from "../config/api";

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeImage, setActiveImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const { addToCart } = useCart();
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [showZoom, setShowZoom] = useState(false);
    const [sizeError, setSizeError] = useState("");
    const [showSizeGuide, setShowSizeGuide] = useState(false); // State for size guide modal

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomPos({ x, y });
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/products/products/${id}`);
                setProduct(response.data);
                setActiveImage(0); // Reset to first image when product changes
                setSelectedSize("");

                // Fetch related products (same category)
                const relatedResponse = await axios.get(`${API_BASE_URL}/products/products`, {
                    params: { page: 1, limit: 5 }
                });
                const filteredRelated = (relatedResponse.data.products || [])
                    .filter(p => p._id !== id && p.category === response.data.category)
                    .slice(0, 4);
                setRelatedProducts(filteredRelated);

            } catch (err) {
                setError(err.response?.data?.message || "Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = () => {
        setSizeError("");
        if (!selectedSize) {
            setSizeError("Please select a size before adding to the cart.");
            return;
        }
        addToCart(product, quantity, selectedSize);
    };

    const handleWhatsAppOrder = () => {
        setSizeError("");
        if (!selectedSize) {
            setSizeError("Please select a size before ordering on WhatsApp.");
            return;
        }

        const baseSite = SITE_URL || window.location.origin;
        const productUrl = `${baseSite}/product/${id}`;
        const message = `${productUrl}\n\nHi, I'm interested in ordering the following product:\n\n*Product:* ${product.name}\n*Size:* ${selectedSize.toUpperCase()}\n*Quantity:* ${quantity}\n*Price:* Rs.${product.price}\n\nCould you please confirm the order and provide payment details?`;
        const cc = WHATSAPP_COUNTRY_CODE ? WHATSAPP_COUNTRY_CODE.replace(/[^\d]/g, "") : "";
        let phone = WHATSAPP_NUMBER && WHATSAPP_NUMBER.replace(/[^\d]/g, "");
        if (phone && phone.startsWith("0") && cc) {
            phone = `${cc}${phone.slice(1)}`;
        }
        const base = phone ? `https://wa.me/${phone}` : `https://wa.me/`;
        const whatsappUrl = `${base}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    };

    if (loading) {
        return (
            <div className={`min-h-screen ${pageBackground} ${pageText} flex items-center justify-center`}>
                <div className="animate-pulse text-xl font-medium text-emerald-500">Loading UrbanWear...</div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className={`min-h-screen ${pageBackground} ${pageText}`}>
                <Navbar />
                <main className="pt-32 pb-20 px-4 text-center">
                    <h1 className="text-2xl font-bold mb-4">{error || "Product not found"}</h1>
                    <Link to="/shirt" className="text-emerald-500 hover:underline">Back to Store</Link>
                </main>
                <Footer className="relative z-20" />
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${pageBackground} ${pageText}`}>
            <Navbar />

            <main className="pt-28 pb-20 px-4">
                <div className="mx-auto max-w-6xl">
                    {/* Breadcrumbs */}
                    {(() => {
                        const key = (product.category || "").toLowerCase();
                        let crumbPath = "/sale";
                        let crumbLabel = "Sale";
                        if (key.includes("hoodie")) {
                            crumbPath = "/shirt";
                            crumbLabel = "Shirts";
                        } else if (key.includes("t-shirt") || key.includes("tshirts") || key.includes("shirt")) {
                            crumbPath = "/OverSized_TShirts";
                            crumbLabel = "Oversized T-Shirts";
                        } else if (key.includes("trouser") || key.includes("pants")) {
                            crumbPath = "/trousers";
                            crumbLabel = "Trousers";
                        }
                        return (
                            <nav className="flex items-center gap-2 text-xs mb-8 text-neutral-500 uppercase tracking-widest">
                                <Link to="/" className="hover:text-emerald-500 transition-colors">Home</Link>
                                <span>/</span>
                                <Link to={crumbPath} className="hover:text-emerald-500 transition-colors">{crumbLabel}</Link>
                                <span>/</span>
                                <span className="text-neutral-300">{product.category}</span>
                            </nav>
                        );
                    })()}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mb-16 md:mb-20">
                        {/* Image Gallery */}
                        <div className="flex flex-col-reverse md:flex-row gap-4 h-fit">
                            {/* Thumbnails Sidebar */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex md:flex-col gap-3 md:w-20 overflow-x-auto md:overflow-y-auto custom-scrollbar no-scrollbar py-1">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`flex-shrink-0 w-16 md:w-full aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all duration-300 transform ${
                                                activeImage === idx
                                                    ? 'border-emerald-500 shadow-lg shadow-emerald-500/40 scale-105'
                                                    : 'border-neutral-200 opacity-70 hover:opacity-100 hover:border-neutral-300 hover:scale-105'
                                            }`}
                                        >
                                            <img src={img.url} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main Image */}
                            <div
                                className="flex-1 aspect-[4/5] overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-200 shadow-2xl cursor-zoom-in relative group"
                                onMouseMove={handleMouseMove}
                                onMouseEnter={() => setShowZoom(true)}
                                onMouseLeave={() => setShowZoom(false)}
                            >
                                <img
                                    src={(product.images && product.images.length > 0 && product.images[activeImage]?.url) || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974&auto=format&fit=crop"}
                                    alt={product.name}
                                    className={`w-full h-full object-cover animate-fade-in transition-transform duration-300 ${showZoom ? 'scale-[2]' : 'scale-100'}`}
                                    style={{
                                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                                    }}
                                />

                                {/* Image Navigation Overlays (Mobile/Quick) */}
                                {product.images && product.images.length > 1 && (
                                    <>
                                        {/* Arrows */}
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setActiveImage(prev => (prev === 0 ? product.images.length - 1 : prev - 1)); }}
                                                className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-emerald-500 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                            </button>
                                        </div>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setActiveImage(prev => (prev === product.images.length - 1 ? 0 : prev + 1)); }}
                                                className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-emerald-500 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                            </button>
                                        </div>

                                        {/* Dots */}
                                        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5">
                                            {product.images.map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeImage === idx ? 'bg-emerald-500 w-4' : 'bg-white/30'}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            <div className="mb-6">
                                <p className="text-emerald-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">{product.category}</p>
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">{product.name}</h1>
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-3xl font-bold text-neutral-900">Rs.{product.price}</span>
                                    {product.onSale && (
                                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full border border-emerald-500/20">
                                            Special Offer
                                        </span>
                                    )}
                                </div>

                                {/* Dynamic Stock Indicator */}
                                <div className="mb-8">
                                    {product.stock <= 0 ? (
                                        <div className="flex items-center gap-2 text-red-500 bg-red-500/10 w-fit px-4 py-2 rounded-xl border border-red-500/20">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-xs font-bold uppercase tracking-wider">Out of Stock</span>
                                        </div>
                                    ) : product.stock < 5 ? (
                                        <div className="flex items-center gap-2 text-amber-600 bg-amber-500/10 w-fit px-4 py-2 rounded-xl border border-amber-500/20 animate-pulse">
                                            <span className="text-lg">🔥</span>
                                            <span className="text-xs font-bold uppercase tracking-wider">
                                                Only {product.stock} pieces left! Don't miss out.
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-500/10 w-fit px-4 py-2 rounded-xl border border-emerald-500/20">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-xs font-bold uppercase tracking-wider">In Stock & Ready to Ship</span>
                                        </div>
                                    )}
                                </div>

                                <p className={`text-base leading-relaxed ${mutedText} mb-8`}>
                                    {product.description || "No description available for this premium UrbanWear piece. Designed for style and comfort in the city."}
                                </p>
                            </div>

                            {/* Size Selection */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm font-bold uppercase tracking-wider text-neutral-900">Select Size</p>
                                    <button
                                        onClick={() => setShowSizeGuide(true)}
                                        className="text-[11px] text-emerald-500 hover:underline underline-offset-4"
                                    >
                                        Size Guide
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes && product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`h-12 min-w-[3rem] px-4 flex items-center justify-center rounded-xl border font-bold text-xs transition-all duration-300 ${
                                                selectedSize === size
                                                    ? 'bg-white border-neutral-300 text-black shadow-lg shadow-neutral-200 scale-105'
                                                    : 'border-neutral-200 hover:border-emerald-500/50 hover:text-emerald-500'
                                            }`}
                                        >
                                            {size.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                                {sizeError && <p className="text-red-500 text-xs mt-2">{sizeError}</p>}
                            </div>

                            {/* Quantity & Add to Cart */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                                <div className={`flex items-center rounded-2xl border border-neutral-200 h-12 sm:h-14 bg-neutral-50 ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={product.stock <= 0}
                                        className="w-12 h-full flex items-center justify-center hover:text-emerald-500 transition-colors disabled:hover:text-current"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                                    </button>
                                    <span className="w-10 text-center font-bold text-sm">{product.stock <= 0 ? 0 : quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                                        disabled={product.stock <= 0}
                                        className="w-12 h-full flex items-center justify-center hover:text-emerald-500 transition-colors disabled:hover:text-current"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock <= 0}
                                    className={`flex-1 h-14 font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 ${
                                        product.stock <= 0
                                            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                            : `bg-gradient-to-r ${primaryGradient} text-slate-950 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98]`
                                    }`}
                                >
                                    {product.stock <= 0 ? (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                            Sold Out
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 118 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                            Add to Bag
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleWhatsAppOrder}
                                    disabled={product.stock <= 0}
                                    className={`flex-1 h-14 font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 ${
                                        product.stock <= 0
                                            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                            : `bg-green-500 text-white hover:shadow-xl hover:shadow-green-500/30 hover:scale-[1.02] active:scale-[0.98]`
                                    }`}
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.46 3.48 1.34 4.94l-1.48 5.45 5.59-1.45c1.41.83 3.02 1.26 4.7 1.26h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.2 15.88c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.42-.54-.42h-.46c-.18 0-.46.06-.7.3.24.24-.94.9-1.14 2.1-.2 1.2.62 2.44.7 2.62.08.18 1.48 2.26 3.6 3.2.5.22.9.36 1.22.46.5.16.96.14 1.32.08.4-.06 1.22-.5 1.4-1 .18-.5.18-.92.12-1-.06-.08-.22-.12-.46-.24z"/></svg>
                                    Buy with WhatsApp
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className={`grid grid-cols-2 gap-4 pt-8 border-t border-neutral-200 ${mutedText}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-wider">Fast Delivery</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A3.323 3.323 0 0010.603 2L4.107 9.335A1.75 1.75 0 003.25 10.5v.5c0 .083.005.165.014.247l1.5 10.5A1.75 1.75 0 006.5 22h11a1.75 1.75 0 001.736-1.503l1.5-10.5a1.75 1.75 0 00-.014-.247v-.5a1.75 1.75 0 00-.857-1.165z" /></svg>
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-wider">Authentic Gear</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <section className="pt-16 md:pt-20 border-t border-neutral-200">
                            <h2 className="text-3xl font-bold mb-10">Goes well with...</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((p) => (
                                    <Link
                                        key={p._id}
                                        to={`/product/${p._id}`}
                                        className="group block bg-neutral-50 rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-500 border border-neutral-200"
                                    >
                                        <div className="aspect-[4/5] overflow-hidden">
                                            <img
                                                src={p.images[0]?.url}
                                                alt={p.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <p className={`text-[10px] uppercase tracking-widest text-emerald-500 mb-1`}>{p.category}</p>
                                            <h3 className="font-bold text-sm mb-2 truncate text-neutral-800 group-hover:text-emerald-500 transition-colors">{p.name}</h3>
                                            <p className="text-emerald-500 font-bold">Rs.{p.price}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            {/* Size Guide Modal */}
            {showSizeGuide && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div
                        className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl max-w-2xl w-full border border-emerald-500/20 shadow-2xl animate-scaleIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-emerald-500/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-5-5A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Size Guide</h3>
                                    <p className="text-sm text-gray-400">Find your perfect fit</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowSizeGuide(false)}
                                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-gray-400 hover:text-white"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content - Size Chart */}
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                    <tr className="border-b border-emerald-500/20">
                                        <th className="pb-4 text-sm font-bold text-emerald-400 uppercase tracking-wider">Size</th>
                                        <th className="pb-4 text-sm font-bold text-emerald-400 uppercase tracking-wider">Chest</th>
                                        <th className="pb-4 text-sm font-bold text-emerald-400 uppercase tracking-wider">Length</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                    <tr className="group hover:bg-emerald-500/5 transition-colors">
                                        <td className="py-4 text-sm font-medium text-white">Small</td>
                                        <td className="py-4 text-sm text-gray-300">19"</td>
                                        <td className="py-4 text-sm text-gray-300">26"</td>
                                    </tr>
                                    <tr className="group hover:bg-emerald-500/5 transition-colors">
                                        <td className="py-4 text-sm font-medium text-white">Medium</td>
                                        <td className="py-4 text-sm text-gray-300">20"</td>
                                        <td className="py-4 text-sm text-gray-300">27"</td>
                                    </tr>
                                    <tr className="group hover:bg-emerald-500/5 transition-colors">
                                        <td className="py-4 text-sm font-medium text-white">Large</td>
                                        <td className="py-4 text-sm text-gray-300">21"</td>
                                        <td className="py-4 text-sm text-gray-300">28"</td>
                                    </tr>
                                    <tr className="group hover:bg-emerald-500/5 transition-colors">
                                        <td className="py-4 text-sm font-medium text-white">One XL</td>
                                        <td className="py-4 text-sm text-gray-300">22"</td>
                                        <td className="py-4 text-sm text-gray-300">29"</td>
                                    </tr>
                                    <tr className="group hover:bg-emerald-500/5 transition-colors">
                                        <td className="py-4 text-sm font-medium text-white">Two XL</td>
                                        <td className="py-4 text-sm text-gray-300">24"</td>
                                        <td className="py-4 text-sm text-gray-300">30"</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Size Guide Tips */}
                            <div className="mt-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white mb-1">How to Measure</p>
                                        <p className="text-xs text-gray-400">
                                            Chest: Measure around the fullest part of your chest, keeping the tape parallel to the floor.<br />
                                            Length: Measure from the highest point of the shoulder to the hem.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end p-6 border-t border-emerald-500/20">
                            <button
                                onClick={() => setShowSizeGuide(false)}
                                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add animation styles */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease forwards;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease forwards;
                }
            `}</style>

            <Footer className="relative z-20" />
        </div>
    );
}

export default ProductDetail;