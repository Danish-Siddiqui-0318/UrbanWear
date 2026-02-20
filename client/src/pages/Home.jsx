import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pageBackground, pageText, cardBackground, mutedText } from "../theme/colors";
import { fetchProducts } from "../api/products";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FALLBACK_PRODUCTS = [
    {
        _id: "sample-1",
        name: "EMOTIONAL DAMAGE",
        price: 2790,
    },
    {
        _id: "sample-2",
        name: "J. WICK",
        price: 2790,
    },
    {
        _id: "sample-3",
        name: "HANG ON.",
        price: 2790,
    },
    {
        _id: "sample-4",
        name: "DID YOU DIE?",
        price: 2790,
    },
];

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        let isMounted = true;
        fetchProducts({ page: 1, limit: 8 })
            .then((data) => {
                if (isMounted) {
                    setProducts(data.products || []);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err.message || "Failed to load products");
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const sourceProducts = products.length ? products : FALLBACK_PRODUCTS;
    const filteredProducts =
        searchQuery.trim().length === 0
            ? sourceProducts
            : sourceProducts.filter((product) =>
                  (product.name || "")
                      .toLowerCase()
                      .includes(searchQuery.trim().toLowerCase()),
              );

    return (
        <div className={`min-h-screen ${pageBackground} ${pageText}`}>
            <div className="mx-auto flex h-full max-w-5xl flex-col px-3 pb-6 pt-3 sm:px-4">
                <Navbar
                    onSearchClick={() => {
                        setShowSearch((prev) => !prev);
                    }}
                />

                {showSearch && (
                    <div className="mt-3">
                        <div className="relative mx-auto max-w-md">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                className="w-full rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs text-neutral-900 outline-none ring-[rgba(234,164,52,0.4)] placeholder:text-neutral-400 focus:border-[rgb(234,164,52)] focus:ring-2"
                                placeholder="Search products by name"
                            />
                            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-400">
                                🔍
                            </span>
                        </div>
                    </div>
                )}

                <nav className="mt-1 flex gap-4 overflow-x-auto border-b border-neutral-200 pb-2 text-xs font-medium text-neutral-600 sm:text-sm">
                    <button type="button" className="whitespace-nowrap">
                        Home
                    </button>
                    <button type="button" className="whitespace-nowrap">
                        T-Shirts
                    </button>
                    <button type="button" className="whitespace-nowrap">
                        Oversized / Drop Shoulders
                    </button>
                    {/* Removed hoodies tab */}
                </nav>

                <main className="mt-4 flex-1">
                    <section className="flex items-center justify-between text-xs text-neutral-600">
                        <button type="button" className="inline-flex items-center gap-1">
                            <span className="text-lg">≡</span>
                            <span>Filter</span>
                        </button>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-300 text-neutral-700"
                            >
                                ≡
                            </button>
                            <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-300 bg-neutral-800 text-white"
                            >
                                ☐
                            </button>
                        </div>
                    </section>

                    <section className="mt-4">
                        {loading && (
                            <p className={`text-center text-xs ${mutedText}`}>Loading products...</p>
                        )}
                        {error && !loading && (
                            <p className="text-center text-xs text-red-500">{error}</p>
                        )}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            {filteredProducts.map((product) => (
                                <article
                                    key={product._id}
                                    className={`overflow-hidden rounded-3xl border border-neutral-200 ${cardBackground} pb-3`}
                                >
                                    <div className="relative aspect-square overflow-hidden">
                                        <div className="absolute inset-0 bg-neutral-900" />
                                        <div className="relative flex h-full w-full items-center justify-center">
                                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                                                UrbanWear
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-sm"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="mt-2 px-2 text-xs sm:px-3">
                                        <h3 className="line-clamp-2 font-semibold text-neutral-900">
                                            {product.name || "Product"}
                                        </h3>
                                        <p className="mt-1 text-[11px] font-medium text-neutral-600">
                                            Rs.{product.price ?? "0.00"}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {!loading && filteredProducts.length === 0 && !error && (
                            <p className="mt-4 text-center text-xs text-neutral-500">
                                No products match your search.
                            </p>
                        )}
                    </section>

                    <Footer />
                </main>
            </div>
        </div>
    );
}

export default Home;
