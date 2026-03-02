// pages/Home.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  pageBackground,
  pageText,
  primaryGradient,
  mutedText,
} from "../theme/colors";
import { API_BASE_URL } from "../config/api";
import mainPage from "../assets/mainPage.png";

// Import category images - FIXED PATHS
import shirtsImg from "../assets/shirts.png";
import trousersImg from "../assets/trousers.png";
import oversizedImg from "../assets/overSized.png"; // Fixed: using correct path

function Home() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState({});
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [announcement, setAnnouncement] = useState(null);
  const [heroSlides, setHeroSlides] = useState([]);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const productsRef = useRef(null);
  const statsRef = useRef(null);

  // Fetch announcement data
  const getAnnouncement = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/announcement/`);
      if (response.data.success && response.data.announcement) {
        setAnnouncement(response.data.announcement);
      }
    } catch (error) {
      console.error("Failed to fetch announcement", error);
    }
  };

  // Fetch all products and calculate category counts
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await axios.get(`${API_BASE_URL}/products/products`, {
        params: { page: 1, limit: 1000 },
      });

      const products = response.data.products || [];

      // Calculate counts for each category
      const shirtCount = products.filter(
        (p) =>
          p.category?.toLowerCase() === "shirt" ||
          p.category?.toLowerCase() === "shirts",
      ).length;

      const oversizedCount = products.filter(
        (p) =>
          p.category?.toLowerCase() === "oversized" ||
          p.category?.toLowerCase() === "oversized-shirt" ||
          p.category?.toLowerCase() === "oversized shirts" ||
          p.category?.toLowerCase() === "oversized_shirt",
      ).length;

      const trouserCount = products.filter(
        (p) =>
          p.category?.toLowerCase() === "trouser" ||
          p.category?.toLowerCase() === "trousers" ||
          p.category?.toLowerCase() === "pants" ||
          p.category?.toLowerCase() === "jeans",
      ).length;


      // Using local images from assets folder
      const categoryData = [
        {
          name: "T-Shirts",
          route: "/shirt",
          image: shirtsImg, // Using local image
          count: shirtCount,
          color: "from-teal-500",
          displayName: "T-Shirts",
        },
        {
          name: "Oversized",
          route: "/OverSized_TShirts",
          image: oversizedImg, // Using local image
          count: oversizedCount,
          color: "from-emerald-500",
          displayName: "Oversized Shirts",
        },
        {
          name: "Trousers",
          route: "/trousers",
          image: trousersImg, // Using local image
          count: trouserCount,
          color: "from-emerald-500",
          displayName: "Trousers",
        },
      ];

      setCategories(categoryData);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      // Fallback categories if API fails - using local images
      const fallbackCategories = [
        {
          name: "T-Shirts",
          route: "/shirt",
          image: shirtsImg,
          count: 0,
          color: "from-teal-500",
          displayName: "T-Shirts",
        },
        {
          name: "Oversized",
          route: "/OverSized_TShirts",
          image: oversizedImg,
          count: 0,
          color: "from-emerald-500",
          displayName: "Oversized Shirts",
        },
        {
          name: "Trousers",
          route: "/trousers",
          image: trousersImg,
          count: 0,
          color: "from-emerald-500",
          displayName: "Trousers",
        },
      ];
      setCategories(fallbackCategories);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    getAnnouncement();
    fetchCategories();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    const refs = [heroRef, featuresRef, productsRef, statsRef];
    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);


  useEffect(() => {
    async function loadFeatured() {
      try {
        setLoadingFeatured(true);
        const response = await axios.get(`${API_BASE_URL}/products/products`, {
          params: { isFeatured: true, limit: 4, _t: Date.now() },
        });
        const allProducts = response.data.products || [];

        // CRITICAL SAFETY FILTER: Only keep products where isFeatured is truly true
        const filteredProducts = allProducts.filter(
          (p) => p.isFeatured === true,
        );

        setFeaturedProducts(
          filteredProducts.map((product) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            image:
              product.images && product.images[0]
                ? product.images[0].url
                : "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974&auto=format&fit=crop",
            category: product.category,
            isNew: product.onSale,
            isFeatured: product.isFeatured,
          })),
        );
      } catch (error) {
        console.error("Failed to fetch featured products", error);
        setFeaturedProducts([]);
      } finally {
        setLoadingFeatured(false);
      }
    }

    async function loadHeroSlides() {
      try {
        const response = await axios.get(`${API_BASE_URL}/hero-slides`);
        if (response.data.success) {
          setHeroSlides(response.data.slides || []);
        }
        setActiveHeroIndex(0);
      } catch (error) {
        console.error("Failed to fetch hero slides", error);
        setHeroSlides([]);
      }
    }

    loadFeatured();
    loadHeroSlides();
  }, [location.pathname]);

  useEffect(() => {
    if (!heroSlides || heroSlides.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [heroSlides]);

  const activeSlide =
    heroSlides && heroSlides.length > 0 ? heroSlides[activeHeroIndex] : null;

  return (
    <div className={`min-h-screen ${pageBackground} ${pageText}`}>
      <Navbar />

      {/* Announcement Banner */}
      {/*{announcement && announcement.isActive && announcement.message && (*/}
      {/*    <div*/}
      {/*        className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs sm:text-sm py-2 px-4 text-center font-medium">*/}
      {/*        {announcement.message}*/}
      {/*    </div>*/}
      {/*)}*/}

      <section
        ref={heroRef}
        id="hero"
        className="relative min-h-[70vh] md:h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src={
              activeSlide && activeSlide.imageUrl
                ? activeSlide.imageUrl
                : mainPage
            }
            alt={
              activeSlide && activeSlide.title
                ? activeSlide.title
                : "Urban fashion"
            }
            className="w-full h-full object-cover animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-teal-900/60 to-transparent"></div>
        </div>

        <div
          className={`relative z-10 text-center px-4 transform transition-all duration-1000 ${
            isVisible.hero
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 animate-slide-down">
            {activeSlide && activeSlide.title ? (
              activeSlide.title
            ) : (
              <>
                Welcome to{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent block mt-2">
                  Urban Wear
                </span>
              </>
            )}
          </h1>

          {/* Hero Subtitle - Shows announcement message or default text */}
          <p
            className={`text-base sm:text-lg md:text-2xl mb-8 max-w-2xl mx-auto ${pageText} animate-slide-up text-cyan-50`}
          >
            {announcement && announcement.isActive && announcement.message
              ? announcement.message
              : activeSlide && activeSlide.subtitle
                ? activeSlide.subtitle
                : "Discover the latest in streetwear fashion. Sustainable, comfortable, and always on trend."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            {activeSlide &&
            activeSlide.buttonLabel &&
            activeSlide.buttonLink ? (
              <Link
                to={activeSlide.buttonLink}
                className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r ${primaryGradient} text-slate-950 font-semibold rounded-full hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105`}
              >
                {activeSlide.buttonLabel}
              </Link>
            ) : (
              <Link
                to="/shirt"
                className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r ${primaryGradient} text-slate-950 font-semibold rounded-full hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105`}
              >
                Shop Now
              </Link>
            )}
            <Link
              to="/collections"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              View Collections
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden sm:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2 animate-scroll"></div>
          </div>
        </div>
      </section>

      {/* Categories Section - Dynamic from API */}
      <section ref={featuresRef} id="categories" className="py-20 px-4">
        <div className="container mx-auto">
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              isVisible.features
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-100"
            }`}
          >
            <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
            <p className={`${mutedText} max-w-2xl mx-auto`}>
              Explore our curated collections designed for the modern urban
              lifestyle
            </p>
          </div>

          {loadingCategories ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="relative h-64 sm:h-72 md:h-80 lg:h-96 rounded-2xl overflow-hidden"
                >
                  <div className="w-full h-full bg-white/5 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <Link
                  key={category.name}
                  to={category.route}
                  className={`group relative h-64 sm:h-72 md:h-80 lg:h-96 rounded-2xl overflow-hidden transform transition-all duration-700 hover:scale-105 hover:shadow-2xl ${
                    isVisible.features
                      ? "translate-y-0 opacity-100"
                      : "translate-y-20 opacity-100"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974&auto=format&fit=crop"; // Fallback image
                    }}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${category.color} to-transparent opacity-60 group-hover:opacity-70 transition-opacity`}
                  ></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl sm:text-2xl font-bold mb-1">
                      {category.displayName}
                    </h3>
                    <p className="text-white/80 text-sm sm:text-base">
                      {category.count}{" "}
                      {category.count === 1 ? "Product" : "Products"}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-3 transform translate-x-20 group-hover:translate-x-0 transition-transform duration-300">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section
        ref={productsRef}
        id="products"
        className="py-20 px-4 bg-white/5"
      >
        <div className="container mx-auto">
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              isVisible.products
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Featured Products
            </h2>
            <p className={`${mutedText} max-w-2xl mx-auto`}>
              Hand-picked styles that are trending right now
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingFeatured ? (
              [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-4/5 rounded-xl bg-white/5 animate-pulse"
                />
              ))
            ) : featuredProducts.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className={mutedText}>
                  No featured products available at the moment.
                </p>
              </div>
            ) : (
              featuredProducts.map((product, index) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className={`group bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 hover:scale-105 ${
                    isVisible.products
                      ? "translate-y-0 opacity-100"
                      : "translate-y-20 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-60 sm:h-72 md:h-80 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {product.isNew && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-linear-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-semibold rounded-full">
                        New Arrival
                      </span>
                    )}
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-emerald-500">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4">
                    <p className={`text-sm ${mutedText} mb-1`}>
                      {product.category.toUpperCase()}
                    </p>
                    <h3 className="font-semibold mb-2 line-clamp-1">
                      {product.name.charAt(0).toUpperCase() +
                        product.name.slice(1)}
                    </h3>{" "}
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-emerald-500">
                        Rs.{product.price}
                      </span>
                      <div className="px-4 py-2 bg-linear-to-r from-emerald-500 to-teal-500 text-slate-950 text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 group-hover:scale-105">
                        View
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      <Footer className="relative z-20" />

      <style>{`
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
