import {useState, useEffect} from "react";
import {Link, useLocation} from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    pageBackground,
    pageText,
    mutedText,
} from "../theme/colors";
import {API_BASE_URL} from "../config/api";

function Shirt() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get("category") || "shirt";

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [priceRange, setPriceRange] = useState({min: 0, max: 1000000});
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const catFromUrl = new URLSearchParams(location.search).get("category") || "shirt";
        const qFromUrl = new URLSearchParams(location.search).get("q") || "";
        setSelectedCategory(catFromUrl);
        setSearchQuery(qFromUrl);
    }, [location.search]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch all categories
                const categoriesRes = await axios.get(`${API_BASE_URL}/categories`);
                setCategories(categoriesRes.data.categories || []);

                // Fetch products specifically for "shirt" category or similar from backend
                // We'll broaden the search if needed, but primary fetch is for active shirts
                const productsRes = await axios.get(`${API_BASE_URL}/products/products`, {
                    params: { 
                        page: 1, 
                        limit: 100,
                        status: 'active'
                    }
                });
                setProducts(productsRes.data.products || []);
            } catch (error) {
                console.error("Failed to fetch shop data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter products to show only non-oversized shirts (flexible keys)
    const shirtProducts = products.filter(p => {
        const key = String(p.category || "").toLowerCase();
        const name = String(p.name || "").toLowerCase();
        
        // If category is explicitly 'shirt' or 'shirts', always show
        if (key === 'shirt' || key === 'shirts' || key === 'tshirt' || key === 't-shirt') return true;
        
        // Match "shirt" in category or name but exclude "oversized"
        const hasShirtWord = key.includes("shirt") || name.includes("shirt");
        const isOversized = key.includes("oversized") || name.includes("oversized");

        return hasShirtWord && !isOversized;
    });

    // Apply all filters
    const filteredProducts = shirtProducts
        .filter(p => {
            // Search filter
            const matchesSearch = searchQuery === "" ||
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

            // Size filter
            const matchesSize = selectedSizes.length === 0 ||
                (p.sizes && p.sizes.some(size => selectedSizes.includes(size)));

            // Price filter
            const matchesPrice = p.price >= priceRange.min && p.price <= priceRange.max;

            return matchesSearch && matchesSize && matchesPrice;
        })
        .sort((a, b) => {
            switch (sortBy) {
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

    // Get unique sizes from all shirts
    const allSizes = [...new Set(shirtProducts.flatMap(p => p.sizes || []))].sort();

    return (
        <div className={`min-h-screen ${pageBackground} ${pageText} relative overflow-hidden`}>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
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

            <style>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) translateX(0);
                    }
                    50% {
                        transform: translateY(-15px) translateX(10px);
                    }
                }

                .animate-float {
                    animation: float infinite ease-in-out;
                }
            `}</style>

            <Navbar/>
            <main className="relative z-10 pt-28 pb-20 px-4">
                <div className="mx-auto max-w-7xl flex flex-col gap-10">
                    {/* Hero Section */}
                    <section
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border border-white/5 p-8 md:p-12">
                        <div className="absolute inset-0 bg-grid-white/5"></div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="flex flex-col gap-4">
                                <div
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                                        Limited Collection
                                    </p>
                                </div>
                                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                                    Explore Our{" "}
                                    <span
                                        className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                                        Shirts
                                    </span>
                                </h1>
                                <p className={`max-w-xl text-base md:text-lg ${mutedText}`}>
                                    Discover our premium collection of shirts. From casual to formal, find the perfect
                                    fit for your style with our latest arrivals.
                                </p>

                                {/* Stats */}
                                <div className="flex items-center gap-6 mt-4">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-white">{shirtProducts.length}+</p>
                                            <p className="text-xs text-gray-400">Styles Available</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-white">Free Shipping</p>
                                            <p className="text-xs text-gray-400">On orders over Rs.5000</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div className="relative w-full md:w-96">
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search shirts by name or description..."
                                        className="w-full h-14 bg-gray-900/80 backdrop-blur-sm border text-white border-white/10 rounded-2xl pl-14 pr-12 text-sm focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                                    />
                                    <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500"
                                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                    </svg>
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M6 18L18 6M6 6l12 12"/>
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Filters Bar */}
                    <div
                        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-white/5">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="white" stroke="white" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
                                </svg>
                                <span className="text-sm font-medium text-white">Filters</span>
                            </button>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-white">Showing</span>
                                <span
                                    className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                                    {filteredProducts.length} {filteredProducts.length === 1 ? 'Shirt' : 'Shirts'}
                                </span>
                            </div>

                            {searchQuery && (
                                <div
                                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                                    <span className="text-xs text-cyan-400">"{searchQuery}"</span>
                                    <button onClick={() => setSearchQuery("")}
                                            className="text-cyan-400 hover:text-cyan-300">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M6 18L18 6M6 6l12 12"/>
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

                    {/* Expanded Filters */}
                    {showFilters && (
                        <div
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/5 animate-fadeIn">
                            {/* Size Filter */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-white flex items-center gap-2">
                                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-5-5A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                                    </svg>
                                    Size
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {allSizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => {
                                                if (selectedSizes.includes(size)) {
                                                    setSelectedSizes(selectedSizes.filter(s => s !== size));
                                                } else {
                                                    setSelectedSizes([...selectedSizes, size]);
                                                }
                                            }}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${selectedSizes.includes(size)
                                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range Filter */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-white flex items-center gap-2">
                                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    Price Range
                                </h4>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                                        placeholder="Min"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="number"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                                        placeholder="Max"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Clear Filters */}
                            <div className="flex items-end">
                                <button
                                    onClick={() => {
                                        setSelectedSizes([]);
                                        setPriceRange({min: 0, max: 1000000});
                                        setSearchQuery("");
                                    }}
                                    className="w-full px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Product Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="relative overflow-hidden rounded-2xl">
                                    <div
                                        className="aspect-[4/5] bg-gradient-to-br from-gray-800/50 to-gray-900/50 animate-pulse"></div>
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="relative py-20 text-center">
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-3xl blur-3xl"></div>
                            <div className="relative">
                                <div
                                    className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-white/5">
                                    <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <p className={`text-2xl font-bold mb-2`}>No shirts found</p>
                                <p className={`text-sm ${mutedText} max-w-md mx-auto`}>
                                    {searchQuery
                                        ? `We couldn't find any shirts matching "${searchQuery}". Try different keywords or browse our full collection.`
                                        : "Check back later for new arrivals or adjust your filters to see more options."}
                                </p>
                                <div className="flex items-center justify-center gap-4 mt-8">
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
                                        >
                                            Clear Search
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            setSelectedSizes([]);
                                            setPriceRange({min: 0, max: 1000000});
                                            setSearchQuery("");
                                        }}
                                        className="px-6 py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition-all duration-300"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                            {filteredProducts.map((product, index) => (
                                <Link
                                    key={product._id}
                                    to={`/product/${product._id}`}
                                    className="group relative flex flex-col gap-4"
                                    style={{animationDelay: `${index * 100}ms`}}
                                >
                                    <div
                                        className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/5 shadow-2xl group-hover:shadow-emerald-500/10 transition-all duration-500">
                                        {/* Image */}
                                        <img
                                            src={product.images[0]?.url || "https://images.unsplash.com/photo-1598033121419-5e6f21d85c28?q=80&w=1974&auto=format&fit=crop"}
                                            alt={product.name}
                                            className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-110 ${
                                                product.stock <= 0 ? 'opacity-40 grayscale' : ''
                                            }`}
                                        />

                                        {/* Gradient Overlay */}
                                        <div
                                            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                        {/* Status Badges */}
                                        {product.stock <= 0 ? (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span
                                                    className="px-4 py-2 bg-black/80 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/10 shadow-2xl">
                                                    Sold Out
                                                </span>
                                            </div>
                                        ) : product.onSale && (
                                            <div className="absolute top-3 left-3">
                                                <span
                                                    className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg">
                                                    Sale
                                                </span>
                                            </div>
                                        )}

                                        {/* Quick View Button */}
                                        <div
                                            className="absolute inset-x-4 bottom-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                            <div
                                                className="bg-black/80 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                                                <span className="text-xs font-medium text-white">Quick View</span>
                                            </div>
                                        </div>

                                        {/* Size Indicator */}
                                        {product.sizes && product.sizes.length > 0 && (
                                            <div
                                                className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-[10px] text-white border border-white/10">
                                                {product.sizes.slice(0, 3).join(' • ').toUpperCase()}
                                                {product.sizes.length > 3 && ` +${product.sizes.length - 3}`}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2 px-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                                                    Shirt
                                                </span>
                                                {product.isFeatured && (
                                                    <span
                                                        className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {product.onSale && product.discount > 0 && (
                                                    <span className="text-xs text-gray-500 line-through">
                                                        Rs.{Math.round(product.price / (1 - (product.discountType === 'percent' ? product.discount / 100 : 0)))}
                                                    </span>
                                                )}
                                                <p className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                                    Rs.{product.price}
                                                </p>
                                            </div>
                                        </div>

                                        <h3 className="text-base font-semibold text-black group-hover:text-emerald-400 transition-colors duration-300 line-clamp-1">
                                            {product.name}
                                        </h3>

                                        {product.description && (
                                            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                                                {product.description}
                                            </p>
                                        )}

                                        {/*/!* Rating Placeholder *!/*/}
                                        {/*<div className="flex items-center gap-1 mt-1">*/}
                                        {/*    {[1, 2, 3, 4, 5].map(star => (*/}
                                        {/*        <svg key={star} className="w-3 h-3 text-amber-400 fill-current"*/}
                                        {/*             viewBox="0 0 20 20">*/}
                                        {/*            <path*/}
                                        {/*                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>*/}
                                        {/*        </svg>*/}
                                        {/*    ))}*/}
                                        {/*    <span className="text-xs text-gray-400 ml-1">(24)</span>*/}
                                        {/*</div>*/}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Quick Filters Section */}
                    {/*{!loading && filteredProducts.length > 0 && (*/}
                    {/*    <div className="mt-8 pt-8 border-t border-white/5">*/}
                    {/*        <div className="flex items-center justify-between mb-6">*/}
                    {/*            <h3 className="text-lg font-semibold text-white">Popular Filters</h3>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>
            </main>
            <Footer/>
        </div>
    );
}

export default Shirt;
