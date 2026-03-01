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
import { API_BASE_URL } from "../config/api";

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
                if (response.data.sizes && response.data.sizes.length > 0) {
                    setSelectedSize(response.data.sizes[0]);
                }
                
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
        if (!selectedSize) {
            alert("Please select a size");
            return;
        }
        addToCart(product, quantity, selectedSize);
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
                                    <button className="text-[11px] text-emerald-500 hover:underline underline-offset-4">Size Guide</button>
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
                            <h2 className="text-3xl font-bold mb-10">Complete the Look</h2>
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

            <Footer className="relative z-20" />
        </div>
    );
}

export default ProductDetail;
