import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    pageBackground,
    pageText,
    mutedText,
} from "../theme/colors";
import { API_BASE_URL } from "../config/api";

function Trouser() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("newest");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedFit, setSelectedFit] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchTrousers = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/products/products`, {
                    params: { page: 1, limit: 100 }
                });

                // Filter products to show only trousers
                const trouserProducts = (response.data.products || []).filter(product =>
                    product.category?.toLowerCase() === "trouser" ||
                    product.category?.toLowerCase() === "trousers" ||
                    product.category?.toLowerCase() === "pants" ||
                    product.category?.toLowerCase() === "jeans" ||
                    product.name?.toLowerCase().includes("trouser") ||
                    product.name?.toLowerCase().includes("pants") ||
                    product.name?.toLowerCase().includes("jeans")
                );

                setProducts(trouserProducts);
            } catch (error) {
                console.error("Failed to fetch trousers", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrousers();
    }, []);

    // Sort products
    const sortedProducts = [...products].sort((a, b) => {
        switch(sortBy) {
            case "price-low":
                return a.price - b.price;
            case "price-high":
                return b.price - a.price;
            case "popular":
                return (b.soldCount || 0) - (a.soldCount || 0);
            default:
                return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });

    // Filter by size and fit
    const filteredProducts = sortedProducts.filter(p => {
        const matchesSize = !selectedSize || p.sizes?.includes(selectedSize);
        const matchesFit = !selectedFit || p.fit?.toLowerCase() === selectedFit.toLowerCase();
        return matchesSize && matchesFit;
    });

    // Get unique sizes
    const allSizes = [...new Set(products.flatMap(p => p.sizes || []))].sort();

    // Get unique fits
    const allFits = [...new Set(products.map(p => p.fit).filter(Boolean))];

    return (
        <div className={`min-h-screen ${pageBackground} ${pageText} relative overflow-hidden`}>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full animate-float"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}
                    ></div>
                ))}
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50% { transform: translateY(-15px) translateX(10px); }
                }
                .animate-float {
                    animation: float infinite ease-in-out;
                }
            `}</style>

            <Navbar />
            <main className="relative z-10 pt-28 pb-20 px-4">
                <div className="mx-auto max-w-7xl flex flex-col gap-10">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border border-white/5 p-8 md:p-12">
                        <div className="absolute inset-0 bg-grid-white/5"></div>
                        <div className="relative z-10 flex flex-col gap-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                                    Bottom Wear Collection
                                </p>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                                Premium{" "}
                                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                                    Trousers
                                </span>
                            </h1>

                            <p className={`max-w-2xl text-base md:text-lg ${mutedText}`}>
                                Discover our premium collection of trousers and pants. From casual chinos to formal wear, find the perfect fit for every occasion.
                            </p>

                            {/* Stats */}
                            <div className="flex items-center gap-6 mt-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{products.length}+</p>
                                        <p className="text-xs text-gray-400">Styles Available</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">Perfect Fit</p>
                                        <p className="text-xs text-gray-400">For Every Body Type</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Filters Bar */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-white/5">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="white" stroke="white" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                                <span className="text-sm font-medium text-white">Filters</span>
                            </button>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-white">Showing</span>
                                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                                    {filteredProducts.length} {filteredProducts.length === 1 ? 'Style' : 'Styles'}
                                </span>
                            </div>

                            {selectedSize && (
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                                    <span className="text-xs text-cyan-400">Size: {selectedSize}</span>
                                    <button onClick={() => setSelectedSize("")} className="text-cyan-400 hover:text-cyan-300">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {selectedFit && (
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                    <span className="text-xs text-emerald-400">Fit: {selectedFit}</span>
                                    <button onClick={() => setSelectedFit("")} className="text-emerald-400 hover:text-emerald-300">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="flex-1 lg:flex-none text-black bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm  focus:border-emerald-500 focus:outline-none"
                            >
                                <option value="newest">✨ Newest First</option>
                                <option value="price-low">💰 Price: Low to High</option>
                                <option value="price-high">💰 Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/5 animate-fadeIn">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Size Filter */}
                                <div>
                                    <h4 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-5-5A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        Filter by Size
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        {allSizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
                                                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                                                    selectedSize === size
                                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                                                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Fit Filter */}
                                {allFits.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                            </svg>
                                            Filter by Fit
                                        </h4>
                                        <div className="flex flex-wrap gap-3">
                                            {allFits.map(fit => (
                                                <button
                                                    key={fit}
                                                    onClick={() => setSelectedFit(selectedFit === fit ? "" : fit)}
                                                    className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                                                        selectedFit === fit
                                                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                                                            : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
                                                    }`}
                                                >
                                                    {fit}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Product Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="relative overflow-hidden rounded-2xl">
                                    <div className="aspect-[4/5] bg-gradient-to-br from-gray-800/50 to-gray-900/50 animate-pulse"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="relative py-20 text-center">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-3xl blur-3xl"></div>
                            <div className="relative">
                                <div className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-white/5">
                                    <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className={`text-2xl font-bold mb-2`}>No trousers found</p>
                                <p className={`text-sm ${mutedText} max-w-md mx-auto`}>
                                    {selectedSize || selectedFit
                                        ? `We couldn't find any trousers matching your criteria. Try different filters.`
                                        : "Check back later for new arrivals in our trousers collection"}
                                </p>
                                {(selectedSize || selectedFit) && (
                                    <button
                                        onClick={() => {
                                            setSelectedSize("");
                                            setSelectedFit("");
                                        }}
                                        className="mt-6 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
                                    >
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                            {filteredProducts.map((product, index) => (
                                <Link
                                    key={product._id}
                                    to={`/product/${product._id}`}
                                    className="group relative flex flex-col gap-4"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/5 shadow-2xl group-hover:shadow-emerald-500/10 transition-all duration-500">
                                        {/* Image */}
                                        <img
                                            src={product.images[0]?.url || "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1974&auto=format&fit=crop"}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                                        />

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                        {/* Badges */}
                                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                                            <div className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg">
                                                {product.category || "Trousers"}
                                            </div>
                                            {product.onSale && (
                                                <div className="px-3 py-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg">
                                                    Sale
                                                </div>
                                            )}
                                        </div>

                                        {/* Quick View */}
                                        <div className="absolute inset-x-4 bottom-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                            <div className="bg-black/80 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                                                <span className="text-xs font-medium text-white">Quick View</span>
                                            </div>
                                        </div>

                                        {/* Size Indicator */}
                                        {product.sizes && product.sizes.length > 0 && (
                                            <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-[10px] text-white border border-white/10">
                                                {product.sizes.slice(0, 3).map(size => size.toUpperCase()).join(' • ')}
                                                {product.sizes.length > 3 && ` +${product.sizes.length - 3}`}
                                            </div>
                                        )}

                                        {/* Fit Badge */}
                                        {product.fit && (
                                            <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-[10px] text-white border border-white/10">
                                                {product.fit} Fit
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2 px-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                                                    {product.category || "Trousers"}
                                                </span>
                                                {product.isFeatured && (
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {product.onSale && product.discount > 0 && (
                                                    <span className="text-xs text-gray-500 line-through">
                                                        Rs.{Math.round(product.price / (1 - (product.discountType === 'percent' ? product.discount/100 : 0)))}
                                                    </span>
                                                )}
                                                <p className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                                    Rs.{product.price}
                                                </p>
                                            </div>
                                        </div>

                                        <h3 className="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors duration-300 line-clamp-1">
                                            {product.name}
                                        </h3>

                                        {product.description && (
                                            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                                                {product.description}
                                            </p>
                                        )}

                                        {/* Style Features */}
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-xs text-gray-500">{product.fit || 'Regular'} Fit</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                            <span className="text-xs text-gray-500">Premium Quality</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Style Guide Section */}
                    {!loading && filteredProducts.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-white/5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-white/5">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-semibold text-white mb-2">How to Style</h4>
                                    <p className="text-sm text-gray-400">Pair with casual shirts or hoodies for a complete look.</p>
                                </div>

                                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-white/5">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-semibold text-white mb-2">Size Guide</h4>
                                    <p className="text-sm text-gray-400">Check our detailed size guide for the perfect fit.</p>
                                </div>

                                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-white/5">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-semibold text-white mb-2">Care Instructions</h4>
                                    <p className="text-sm text-gray-400">Machine wash cold, gentle cycle for lasting quality.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Trouser;