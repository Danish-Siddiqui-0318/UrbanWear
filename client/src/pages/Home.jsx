import { useState } from "react";
import { Link } from "react-router-dom";
import { primaryGradient } from "../theme/colors";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
    const [selectedCategory, setSelectedCategory] = useState("all");

    const heroSlides = [
        {
            title: "New Collection Drop",
            subtitle: "Urban Streetwear 2024",
            description: "Express your style with our latest hoodies and apparel",
            cta: "Shop Now",
            image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            color: "from-[rgb(234,164,52)] to-[rgb(214,144,32)]"
        },
        {
            title: "Limited Edition",
            subtitle: "Artist Collaboration",
            description: "Exclusive designs from top street artists",
            cta: "Explore",
            image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            color: "from-blue-500 to-purple-500"
        }
    ];

    const categories = [
        { id: "all", name: "All", icon: "👕" },
        { id: "hoodies", name: "Hoodies", icon: "🧥" },
        { id: "tshirts", name: "T-Shirts", icon: "👕" },
        { id: "jackets", name: "Jackets", icon: "🧥" },
        { id: "accessories", name: "Accessories", icon: "🧢" },
    ];

    const featuredProducts = [
        {
            id: 1,
            name: "Classic Black Hoodie",
            price: 49.99,
            originalPrice: 69.99,
            image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "hoodies",
            isNew: true,
            isSale: true
        },
        {
            id: 2,
            name: "Urban Graphic Tee",
            price: 29.99,
            image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "tshirts",
            isNew: true
        },
        {
            id: 3,
            name: "Oversized Sweatshirt",
            price: 59.99,
            originalPrice: 79.99,
            image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "hoodies",
            isSale: true
        },
        {
            id: 4,
            name: "Cargo Pants",
            price: 64.99,
            image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "bottoms"
        },
        {
            id: 5,
            name: "Vintage Wash Hoodie",
            price: 54.99,
            image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "hoodies",
            isNew: true
        },
        {
            id: 6,
            name: "Snapback Cap",
            price: 24.99,
            image: "https://images.unsplash.com/photo-1588850566907-9ec5f7484296?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "accessories"
        },
        {
            id: 7,
            name: "Denim Jacket",
            price: 89.99,
            originalPrice: 119.99,
            image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "jackets",
            isSale: true
        },
        {
            id: 8,
            name: "Graphic Hoodie",
            price: 59.99,
            image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "hoodies"
        }
    ];

    const filteredProducts = selectedCategory === "all" 
        ? featuredProducts 
        : featuredProducts.filter(p => p.category === selectedCategory);

    const collections = [
        {
            title: "Street Essentials",
            description: "Build your everyday wardrobe",
            image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            link: "/collections/essentials"
        },
        {
            title: "Limited Drops",
            description: "Exclusive pieces, limited quantities",
            image: "https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            link: "/collections/limited"
        },
        {
            title: "Summer Vibes",
            description: "Lightweight styles for warm days",
            image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            link: "/collections/summer"
        }
    ];

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            <Navbar />
            <main className="flex-1">
                <section className="relative h-[600px] overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src={heroSlides[0].image}
                        alt="Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
                
                <div className="relative h-full flex items-center justify-center text-center text-white px-4">
                    <div className="max-w-3xl">
                        <span className="inline-block px-4 py-1 rounded-full bg-[rgb(234,164,52)] text-xs font-semibold uppercase tracking-wider mb-6">
                            New Arrivals
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-4">
                            {heroSlides[0].title}
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-neutral-200">
                            {heroSlides[0].description}
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                to="/shop"
                                className={`px-8 py-3 rounded-lg bg-gradient-to-r ${primaryGradient} text-white font-medium hover:shadow-lg transition-shadow`}
                            >
                                Shop Now
                            </Link>
                            <Link
                                to="/collections"
                                className="px-8 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white font-medium hover:bg-white/30 transition-colors"
                            >
                                Explore
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Slide Indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
                    <button className="w-2 h-2 rounded-full bg-white" />
                    <button className="w-2 h-2 rounded-full bg-white/50" />
                </div>
                </section>

                <section className="py-8 bg-white border-b border-neutral-200 sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                                    ${selectedCategory === category.id
                                        ? `bg-gradient-to-r ${primaryGradient} text-white shadow-md`
                                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                    }`}
                            >
                                <span>{category.icon}</span>
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
                </section>

                <section className="py-16 max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-neutral-900">Featured Products</h2>
                        <p className="text-neutral-600 mt-2">Check out our latest drops</p>
                    </div>
                    <Link 
                        to="/shop" 
                        className="text-[rgb(234,164,52)] hover:text-[rgb(214,144,32)] font-medium flex items-center gap-1"
                    >
                        View All
                        <span>→</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.slice(0, 4).map((product) => (
                        <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="relative aspect-square overflow-hidden bg-neutral-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {product.isNew && (
                                    <span className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                                        NEW
                                    </span>
                                )}
                                {product.isSale && (
                                    <span className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                                        SALE
                                    </span>
                                )}
                                <button className="absolute bottom-3 left-3 right-3 bg-white text-neutral-900 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity font-medium text-sm shadow-lg">
                                    Quick View
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-neutral-900 mb-1">{product.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-[rgb(234,164,52)]">
                                        ${product.price}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-sm text-neutral-400 line-through">
                                            ${product.originalPrice}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                </section>

                <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-neutral-900">Shop by Collection</h2>
                        <p className="text-neutral-600 mt-2">Curated styles for every occasion</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {collections.map((collection, index) => (
                            <Link
                                key={index}
                                to={collection.link}
                                className="group relative h-96 overflow-hidden rounded-2xl"
                            >
                                <img
                                    src={collection.image}
                                    alt={collection.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <h3 className="text-2xl font-bold mb-2">{collection.title}</h3>
                                    <p className="text-sm text-neutral-200 mb-4">{collection.description}</p>
                                    <span className="inline-flex items-center text-sm font-semibold group-hover:gap-2 transition-all">
                                        Shop Now <span className="text-lg">→</span>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                </section>

                <section className="py-16 border-y border-neutral-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl mb-3">🚚</div>
                            <h3 className="font-semibold text-neutral-900 mb-1">Free Shipping</h3>
                            <p className="text-sm text-neutral-600">On orders over $50</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-3">↩️</div>
                            <h3 className="font-semibold text-neutral-900 mb-1">Easy Returns</h3>
                            <p className="text-sm text-neutral-600">30-day return policy</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-3">🔒</div>
                            <h3 className="font-semibold text-neutral-900 mb-1">Secure Payment</h3>
                            <p className="text-sm text-neutral-600">100% secure transactions</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-3">💬</div>
                            <h3 className="font-semibold text-neutral-900 mb-1">24/7 Support</h3>
                            <p className="text-sm text-neutral-600">Always here to help</p>
                        </div>
                    </div>
                </div>
                </section>

                <section className="py-16 bg-gradient-to-r from-neutral-100 to-neutral-200">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-4">Join the UrbanWear Community</h2>
                    <p className="text-neutral-600 mb-8">
                        Subscribe for exclusive drops, early access, and 10% off your first order
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:border-[rgb(234,164,52)] transition-colors"
                        />
                        <button className={`px-6 py-3 rounded-lg bg-gradient-to-r ${primaryGradient} text-white font-medium hover:shadow-lg transition-shadow`}>
                            Subscribe
                        </button>
                    </div>
                </div>
                </section>

                <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-neutral-900">Follow Us @UrbanWear</h2>
                        <p className="text-neutral-600 mt-2">Tag us for a chance to be featured</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((item) => (
                            <a
                                key={item}
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative aspect-square overflow-hidden rounded-xl"
                            >
                                <img
                                    src={`https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`}
                                    alt="Instagram post"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-2xl">📸</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default Home;
