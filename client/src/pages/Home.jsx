// pages/Home.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { pageBackground, pageText, primaryGradient, mutedText } from '../theme/colors';
import { API_BASE_URL } from '../config/api';

function Home() {
    const [isVisible, setIsVisible] = useState({});
    const [counts, setCounts] = useState({ customers: 0, products: 0, years: 0, stores: 0 });
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loadingFeatured, setLoadingFeatured] = useState(true);
    const [announcement, setAnnouncement] = useState(null);
    const [heroSlides, setHeroSlides] = useState([]);
    const [activeHeroIndex, setActiveHeroIndex] = useState(0);
    
    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const productsRef = useRef(null);
    const statsRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsVisible(prev => ({ ...prev, [entry.target.id]: entry.isIntersecting }));
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        const refs = [heroRef, featuresRef, productsRef, statsRef];
        refs.forEach(ref => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isVisible.stats) {
            const targets = { customers: 50000, products: 1000, years: 5, stores: 12 };
            const duration = 2000;
            const steps = 60;
            const increment = {};
            
            Object.keys(targets).forEach(key => {
                increment[key] = targets[key] / (duration / (1000 / steps));
            });

            let current = { customers: 0, products: 0, years: 0, stores: 0 };
            const timer = setInterval(() => {
                let completed = true;
                Object.keys(targets).forEach(key => {
                    if (current[key] < targets[key]) {
                        current[key] = Math.min(current[key] + increment[key], targets[key]);
                        completed = false;
                    }
                });
                
                setCounts({ ...current });

                if (completed) clearInterval(timer);
            }, 1000 / steps);

            return () => clearInterval(timer);
        }
    }, [isVisible.stats]);

    useEffect(() => {
        async function loadFeatured() {
            try {
                setLoadingFeatured(true);
                const response = await axios.get(`${API_BASE_URL}/products/products`, {
                    params: { isFeatured: true, limit: 4 },
                });
                const products = response.data.products || [];

                setFeaturedProducts(
                    products.map((product) => ({
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        image:
                            product.images && product.images[0]
                                ? product.images[0].url
                                : "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974&auto=format&fit=crop",
                        category: product.category,
                        isNew: product.onSale,
                    }))
                );
            } catch (error) {
                console.error("Failed to fetch featured products", error);
                setFeaturedProducts([]);
            } finally {
                setLoadingFeatured(false);
            }
        }

        async function loadAnnouncement() {
            try {
                const response = await axios.get(`${API_BASE_URL}/announcement`);
                setAnnouncement(response.data.announcement || null);
            } catch {
                setAnnouncement(null);
            }
        }

        async function loadHeroSlides() {
            try {
                const response = await axios.get(`${API_BASE_URL}/hero-slides`);
                setHeroSlides(response.data.slides || []);
                setActiveHeroIndex(0);
            } catch {
                setHeroSlides([]);
            }
        }

        loadFeatured();
        loadAnnouncement();
        loadHeroSlides();
    }, []);

    useEffect(() => {
        if (!heroSlides || heroSlides.length <= 1) {
            return;
        }

        const interval = setInterval(() => {
            setActiveHeroIndex((prev) => (prev + 1) % heroSlides.length);
        }, 7000);

        return () => clearInterval(interval);
    }, [heroSlides]);

    const categories = [
        { name: 'Hoodies', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop', count: 45, color: 'from-emerald-500' },
        { name: 'T-Shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop', count: 89, color: 'from-teal-500' },
        { name: 'Trousers', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1974&auto=format&fit=crop', count: 34, color: 'from-emerald-500' },
        { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop', count: 56, color: 'from-teal-500' },
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Verified Buyer',
            content: 'The quality of Urban Wear hoodies is unmatched. I get compliments every time I wear them!',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1494790108777-466d853c8845?q=80&w=1974&auto=format&fit=crop'
        },
        {
            name: 'Mike Chen',
            role: 'Streetwear Enthusiast',
            content: 'Finally found a brand that combines comfort with style perfectly. My go-to for daily wear.',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'
        },
        {
            name: 'Emma Rodriguez',
            role: 'Fashion Blogger',
            content: 'The attention to detail and sustainable practices make Urban Wear stand out. Love their new collection!',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop'
        }
    ];

    const highlights = [
        {
            title: 'Free Shipping',
            subtitle: 'On orders over Rs.8000',
        },
        {
            title: 'Sustainable Fabrics',
            subtitle: 'Ethically sourced materials',
        },
        {
            title: 'Easy Returns',
            subtitle: '30-day hassle-free returns',
        },
    ];

    const activeSlide = heroSlides && heroSlides.length > 0 ? heroSlides[activeHeroIndex] : null;

    return (
        <div className={`min-h-screen ${pageBackground} ${pageText}`}>
            <Navbar />
            
            {announcement && announcement.isActive && announcement.message && (
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs sm:text-sm py-2 px-4 text-center">
                    {announcement.message}
                </div>
            )}

            <section 
                ref={heroRef}
                id="hero"
                className="relative h-screen flex items-center justify-center overflow-hidden"
            >
                <div className="absolute inset-0">
                    <img 
                        src={
                            activeSlide && activeSlide.imageUrl
                                ? activeSlide.imageUrl
                                : "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
                        }
                        alt={activeSlide && activeSlide.title ? activeSlide.title : "Urban fashion"}
                        className="w-full h-full object-cover animate-ken-burns"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-teal-900/60 to-transparent"></div>
                </div>
                
                <div className={`relative z-10 text-center px-4 transform transition-all duration-1000 ${
                    isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-slide-down">
                        {activeSlide && activeSlide.title ? (
                            activeSlide.title
                        ) : (
                            <>
                                Define Your
                                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent block mt-2">
                                    Urban Style
                                </span>
                            </>
                        )}
                    </h1>
                    <p className={`text-xl md:text-2xl mb-8 max-w-2xl mx-auto ${mutedText} animate-slide-up`}>
                        {activeSlide && activeSlide.subtitle
                            ? activeSlide.subtitle
                            : "Discover the latest in streetwear fashion. Sustainable, comfortable, and always on trend."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
                        {(activeSlide && activeSlide.buttonLabel && activeSlide.buttonLink) ? (
                            <Link 
                                to={activeSlide.buttonLink}
                                className={`px-8 py-4 bg-gradient-to-r ${primaryGradient} text-slate-950 font-semibold rounded-full hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105`}
                            >
                                {activeSlide.buttonLabel}
                            </Link>
                        ) : (
                            <Link 
                                to="/shop" 
                                className={`px-8 py-4 bg-gradient-to-r ${primaryGradient} text-slate-950 font-semibold rounded-full hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105`}
                            >
                                Shop Now
                            </Link>
                        )}
                        <Link 
                            to="/collections" 
                            className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                        >
                            View Collections
                        </Link>
                    </div>

                    {heroSlides && heroSlides.length > 1 && (
                        <div className="mt-6 flex justify-center gap-2">
                            {heroSlides.map((slide, index) => (
                                <button
                                    key={slide._id || index}
                                    type="button"
                                    onClick={() => setActiveHeroIndex(index)}
                                    className={`h-2 w-2 rounded-full border border-white/60 transition ${
                                        index === activeHeroIndex ? "bg-white" : "bg-transparent"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1 h-2 bg-white rounded-full mt-2 animate-scroll"></div>
                    </div>
                </div>
            </section>

            <section className="px-4 -mt-10 relative z-20">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {highlights.map((item, index) => (
                            <div
                                key={item.title}
                                className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 px-5 py-4 flex items-center gap-4 shadow-lg/30 transition-transform duration-500 hover:-translate-y-1 hover:shadow-emerald-500/20 animate-glow"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950">
                                    {index === 0 && (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M5 6h14M7 14h10M9 18h6" />
                                        </svg>
                                    )}
                                    {index === 1 && (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a7 7 0 017 7c0 4-4 9-7 11-3-2-7-7-7-11a7 7 0 017-7z" />
                                        </svg>
                                    )}
                                    {index === 2 && (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M6 7v10a2 2 0 002 2h8a2 2 0 002-2V7" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">{item.title}</p>
                                    <p className={`text-xs ${mutedText}`}>{item.subtitle}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-4 mt-6">
                <div className="container mx-auto">
                    <div className="relative overflow-hidden rounded-full bg-white/5 border border-white/10">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent" />
                        <div className="relative flex items-center gap-6 px-6 py-3 text-xs md:text-sm font-medium text-white/80 whitespace-nowrap animate-marquee">
                            {[
                                'New drop: City Lights Collection',
                                'Members get early access to limited pieces',
                                'Earn points on every purchase with Urban Rewards',
                                'Now shipping to 12+ global cities',
                            ].map((text) => (
                                <span key={text} className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                                    {text}
                                </span>
                            ))}
                            {[
                                'New drop: City Lights Collection',
                                'Members get early access to limited pieces',
                                'Earn points on every purchase with Urban Rewards',
                                'Now shipping to 12+ global cities',
                            ].map((text) => (
                                <span key={`${text}-duplicate`} className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                                    {text}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section 
                ref={featuresRef}
                id="categories"
                className="py-20 px-4"
            >
                <div className="container mx-auto">
                    <div className={`text-center mb-12 transition-all duration-1000 ${
                        isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                        <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
                        <p className={`${mutedText} max-w-2xl mx-auto`}>
                            Explore our curated collections designed for the modern urban lifestyle
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                            <Link
                                key={category.name}
                                to={`/shop/${category.name.toLowerCase()}`}
                                className={`group relative h-96 rounded-2xl overflow-hidden transform transition-all duration-700 hover:scale-105 hover:shadow-2xl ${
                                    isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                                }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <img 
                                    src={category.image} 
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} to-transparent opacity-60 group-hover:opacity-70 transition-opacity`}></div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                                    <p className="text-white/80">{category.count} Products</p>
                                </div>
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-3 transform translate-x-20 group-hover:translate-x-0 transition-transform duration-300">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section 
                ref={productsRef}
                id="products"
                className="py-20 px-4 bg-white/5"
            >
                <div className="container mx-auto">
                    <div className={`text-center mb-12 transition-all duration-1000 ${
                        isVisible.products ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                        <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
                        <p className={`${mutedText} max-w-2xl mx-auto`}>
                            Hand-picked styles that are trending right now
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loadingFeatured ? (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-[4/5] rounded-xl bg-white/5 animate-pulse" />
                            ))
                        ) : featuredProducts.length === 0 ? (
                            <div className="col-span-full text-center py-10">
                                <p className={mutedText}>No featured products available at the moment.</p>
                            </div>
                        ) : (
                            featuredProducts.map((product, index) => (
                                <Link
                                    key={product.id}
                                    to={`/product/${product.id}`}
                                    className={`group bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 hover:scale-105 ${
                                        isVisible.products ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                                    }`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div className="relative h-80 overflow-hidden">
                                        <img 
                                            src={product.image} 
                                            alt={product.name}
                                            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${product.stock <= 0 ? 'opacity-40 grayscale' : ''}`}
                                        />
                                        {product.stock <= 0 ? (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                                <span className="px-4 py-2 bg-white text-black text-xs font-bold rounded-full uppercase tracking-[0.2em] shadow-xl">
                                                    Sold Out
                                                </span>
                                            </div>
                                        ) : product.isNew && (
                                            <span className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-semibold rounded-full">
                                                New Arrival
                                            </span>
                                        )}
                                        <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-emerald-500">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <p className={`text-sm ${mutedText} mb-1`}>{product.category}</p>
                                        <h3 className="font-semibold mb-2">{product.name}</h3>
                                        <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-emerald-500">Rs.{product.price}</span>
                                        <div className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 group-hover:scale-105">
                                            View Details
                                        </div>
                                    </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section 
                ref={statsRef}
                id="stats"
                className="py-20 px-4 relative overflow-hidden"
            >
                <div className="absolute inset-0 opacity-10">
                    <img 
                        src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop" 
                        alt="Pattern"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container mx-auto relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: 'Happy Customers', value: counts.customers, suffix: '+' },
                            { label: 'Products', value: counts.products, suffix: '+' },
                            { label: 'Years of Excellence', value: counts.years, suffix: '' },
                            { label: 'Store Locations', value: counts.stores, suffix: '' },
                        ].map((stat, index) => (
                            <div
                                key={stat.label}
                                className={`text-center transform transition-all duration-1000 ${
                                    isVisible.stats ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                                }`}
                                style={{ transitionDelay: `${index * 200}ms` }}
                            >
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-2">
                                    {Math.round(stat.value)}{stat.suffix}
                                </div>
                                <div className={`${mutedText}`}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-4 bg-white/5">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
                        <p className={`${mutedText} max-w-2xl mx-auto`}>
                            Join thousands of satisfied customers who love Urban Wear
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={testimonial.name}
                                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 hover:scale-105 animate-fade-in-up"
                                style={{ animationDelay: `${index * 200}ms` }}
                            >
                                <div className="flex items-center mb-4">
                                    <img 
                                        src={testimonial.image} 
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover mr-4"
                                    />
                                    <div>
                                        <h4 className="font-semibold">{testimonial.name}</h4>
                                        <p className={`text-sm ${mutedText}`}>{testimonial.role}</p>
                                    </div>
                                </div>
                                <div className="flex mb-3">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className={`${mutedText} italic`}>"{testimonial.content}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-teal-900"></div>
                <div className="absolute inset-0 opacity-20">
                    <img 
                        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop" 
                        alt="Pattern"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container mx-auto relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-pulse">
                        Ready to Upgrade Your Style?
                    </h2>
                    <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                        Join the Urban Wear community today and get 15% off your first order
                    </p>
                    <Link 
                        to="/shop" 
                        className="inline-block px-8 py-4 bg-white text-emerald-900 font-semibold rounded-full hover:shadow-xl hover:shadow-white/30 transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white"
                    >
                        Shop Now
                    </Link>
                </div>
            </section>

            <Footer />

            <style jsx>{`
                @keyframes kenBurns {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.1); }
                }
                .animate-ken-burns {
                    animation: kenBurns 20s ease infinite alternate;
                }
                
                @keyframes scroll {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(15px); opacity: 0; }
                }
                .animate-scroll {
                    animation: scroll 2s ease infinite;
                }
                
                @keyframes slideDown {
                    0% { transform: translateY(-50px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-down {
                    animation: slideDown 1s ease forwards;
                }
                
                @keyframes slideUp {
                    0% { transform: translateY(50px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slideUp 1s ease forwards;
                    animation-delay: 0.3s;
                    opacity: 0;
                }
                
                @keyframes fadeIn {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fadeIn 1s ease forwards;
                    animation-delay: 0.6s;
                    opacity: 0;
                }
                
                @keyframes fadeInUp {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    opacity: 0;
                    animation: fadeInUp 0.8s ease forwards;
                }
                @keyframes glow {
                    0% { box-shadow: 0 12px 25px rgba(16, 185, 129, 0.15); transform: translateY(0); }
                    100% { box-shadow: 0 18px 40px rgba(16, 185, 129, 0.3); transform: translateY(-2px); }
                }
                .animate-glow {
                    animation: glow 2.5s ease-in-out infinite alternate;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 18s linear infinite;
                }
            `}</style>
        </div>
    );
}

export default Home;
