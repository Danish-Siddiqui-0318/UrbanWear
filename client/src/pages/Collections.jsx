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

function Collections() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/categories`);
                setCategories(response.data.categories || []);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Static images for categories if not provided by backend
    const categoryImages = {
        hoodies: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop',
        tshirts: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop',
        trousers: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1974&auto=format&fit=crop',
        accessories: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop',
        jackets: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop'
    };

    return (
        <div className={`min-h-screen ${pageBackground} ${pageText}`}>
            <Navbar />
            <main className="pt-28 pb-20 px-4">
                <div className="mx-auto flex max-w-6xl flex-col gap-10">
                    <section className="flex flex-col gap-4">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500">
                            Collections
                        </p>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Curated Looks for the Urban Soul
                        </h1>
                        <p className={`max-w-xl text-sm sm:text-base ${mutedText}`}>
                            Explore our signature collections designed for the rhythm of city life. From heavyweight essentials to technical street gear.
                        </p>
                    </section>

                    {loading ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="aspect-[16/9] rounded-3xl bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {categories.filter(c => c.isActive).map((category) => (
                                <Link
                                    key={category._id}
                                    to={`/shop?category=${category.key}`}
                                    className="group relative aspect-[16/10] overflow-hidden rounded-3xl bg-neutral-900 border border-white/5"
                                >
                                    <img 
                                        src={categoryImages[category.key] || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974&auto=format&fit=crop'} 
                                        alt={category.name}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-8">
                                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2">Category</p>
                                        <h2 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                            {category.name}
                                        </h2>
                                    </div>
                                    <div className="absolute top-6 right-6 h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
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

export default Collections;
