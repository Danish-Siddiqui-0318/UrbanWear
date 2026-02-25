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

function NewArrivals() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/products/products`, {
                    params: { page: 1, limit: 20 }
                });
                // Sort by createdAt or just take the latest 12
                const latest = (response.data.products || []).slice(0, 12);
                setProducts(latest);
            } catch (error) {
                console.error("Failed to fetch new arrivals", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNewArrivals();
    }, []);

    return (
        <div className={`min-h-screen ${pageBackground} ${pageText}`}>
            <Navbar />
            <main className="pt-28 pb-20 px-4">
                <div className="mx-auto flex max-w-6xl flex-col gap-10">
                    <section className="flex flex-col gap-4">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500">
                            New Arrivals
                        </p>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Fresh Drops Just Landed
                        </h1>
                        <p className={`max-w-xl text-sm sm:text-base ${mutedText}`}>
                            Stay ahead of the curve. Discover our latest collection of premium streetwear, updated weekly for the urban explorer.
                        </p>
                    </section>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-[4/5] rounded-2xl bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                            {products.map((product) => (
                                <Link 
                                    key={product._id} 
                                    to={`/product/${product._id}`}
                                    className="group flex flex-col gap-4"
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-900 border border-white/5 shadow-lg">
                                        <img 
                                            src={product.images[0]?.url || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974&auto=format&fit=crop"} 
                                            alt={product.name}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                            New
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 px-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">{product.category}</p>
                                            <p className="text-sm font-bold text-neutral-900">Rs.{product.price}</p>
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

export default NewArrivals;
