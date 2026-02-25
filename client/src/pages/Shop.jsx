import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    pageBackground,
    pageText,
    mutedText,
} from "../theme/colors";
import { API_BASE_URL } from "../config/api";

function Shop() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get("category") || "all";

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const catFromUrl = new URLSearchParams(location.search).get("category") || "all";
        const qFromUrl = new URLSearchParams(location.search).get("q") || "";
        setSelectedCategory(catFromUrl);
        setSearchQuery(qFromUrl);
    }, [location.search]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsRes, categoriesRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/products/products`, { params: { page: 1, limit: 100 } }),
                    axios.get(`${API_BASE_URL}/categories`)
                ]);
                setProducts(productsRes.data.products || []);
                setCategories(categoriesRes.data.categories || []);
            } catch (error) {
                console.error("Failed to fetch shop data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    return (
        <div className={`min-h-screen ${pageBackground} ${pageText}`}>
            <Navbar />
            <main className="pt-28 pb-20 px-4">
                <div className="mx-auto flex max-w-6xl flex-col gap-10">
                    {/* Header */}
                    <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex flex-col gap-4">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500">
                                Collection
                            </p>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                                Explore All UrbanGear
                            </h1>
                            <p className={`max-w-xl text-sm sm:text-base ${mutedText}`}>
                                From street-ready hoodies to essential accessories, find everything you need to define your urban style.
                            </p>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="relative w-full md:w-80">
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-12 text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                            />
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </div>
                    </section>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3 border-b border-white/5 pb-8">
                        <button 
                            onClick={() => setSelectedCategory("all")}
                            className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                                selectedCategory === "all" 
                                    ? "bg-white text-black shadow-lg shadow-white/10" 
                                    : "bg-white/5 text-white hover:bg-white/10"
                            }`}
                        >
                            All Products
                        </button>
                        {categories.filter(c => c.isActive).map(cat => (
                            <button 
                                key={cat._id}
                                onClick={() => setSelectedCategory(cat.key)}
                                className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                                    selectedCategory === cat.key 
                                        ? "bg-white text-black shadow-lg shadow-white/10" 
                                        : "bg-white/5 text-white hover:bg-white/10"
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Product Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 8].map(i => (
                                <div key={i} className="aspect-[4/5] rounded-2xl bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className={mutedText}>No products found in this category.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                            {filteredProducts.map((product) => (
                                <Link 
                                    key={product._id} 
                                    to={`/product/${product._id}`}
                                    className="group flex flex-col gap-4"
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-900 border border-white/5 shadow-lg">
                                        <img 
                                            src={product.images[0]?.url || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974&auto=format&fit=crop"} 
                                            alt={product.name}
                                            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${product.stock <= 0 ? 'opacity-40 grayscale' : ''}`}
                                        />
                                        {product.stock <= 0 ? (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                                <span className="px-4 py-2 bg-white text-black text-xs font-bold rounded-full uppercase tracking-[0.2em] shadow-xl">
                                                    Sold Out
                                                </span>
                                            </div>
                                        ) : product.onSale && (
                                            <div className="absolute top-3 left-3 px-3 py-1 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                                Sale
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1 px-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">{product.category}</p>
                                            <div className="flex items-center gap-2">
                                                {product.onSale && product.discount && (
                                                    <span className="text-[10px] text-neutral-400 line-through">
                                                        Rs.{Math.round(product.price / (1 - (product.discountType === 'percent' ? product.discount/100 : 0)))}
                                                    </span>
                                                )}
                                                <p className="text-sm font-bold text-neutral-900">Rs.{product.price}</p>
                                            </div>
                                        </div>
                                        <h3 className="text-sm font-medium text-neutral-800 group-hover:text-emerald-500 transition-colors truncate">
                                            {product.name}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Shop;
