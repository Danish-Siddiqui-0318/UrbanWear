// components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
import {
    pageBackground,
    pageText,
    primaryBorder,
    mutedText,
    accentText,
} from "../theme/colors";

function Navbar({ variant = "public", name = "Admin", onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(() => {
        if (typeof window !== "undefined") {
            return location.pathname !== "/" ? true : window.scrollY > 20;
        }
        return false;
    });
    const [cartCount, setCartCount] = useState(() => {
        const savedCart = typeof window !== "undefined" ? localStorage.getItem("urbanwear_cart") : null;
        if (savedCart) {
            const cart = JSON.parse(savedCart);
            return cart.reduce((total, item) => total + item.quantity, 0);
        }
        return 0;
    });
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [navSearchQuery, setNavSearchQuery] = useState("");
    const navTextClass = scrolled ? pageText : "text-white";

    const handleNavSearch = (e) => {
        e.preventDefault();
        if (navSearchQuery.trim()) {
            navigate(`/shirt?q=${encodeURIComponent(navSearchQuery.trim())}`);
            setIsSearchOpen(false);
            setNavSearchQuery("");
        }
    };

    const updateCartCount = () => {
        const savedCart = localStorage.getItem("urbanwear_cart");
        if (savedCart) {
            const cart = JSON.parse(savedCart);
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            setCartCount(count);
        } else {
            setCartCount(0);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("cartUpdate", updateCartCount);
        if (location.pathname === "/") {
            window.addEventListener("scroll", handleScroll);
        }
        return () => {
            if (location.pathname === "/") {
                window.removeEventListener("scroll", handleScroll);
            }
            window.removeEventListener("cartUpdate", updateCartCount);
        };
    }, [location.pathname]);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Shirt", path: "/shirt" },
        { name: "Oversized T-Shirts", path: "/OverSized_TShirts" },
        { name: "Trouser", path: "/trousers" },
        { name: "Sale", path: "/sale" },
        { name: "Track Order", path: "/track-order" },
        { name: "Let's Customise", path: "/customise" },
    ];

    if (variant === "admin") {
        return (
            <header
                className={`${pageBackground} ${pageText} text-white border-b ${primaryBorder} sticky top-0 z-40`}
            >
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[rgb(234,164,52)] to-[rgb(234,164,52)] text-xs font-bold text-slate-950">
                            UW
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold tracking-tight">
                                UrbanWear Admin
                            </span>
                            <span className={`text-[11px] ${mutedText}`}>
                                Dashboard overview and management
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="hidden text-xs text-neutral-600 underline-offset-2 hover:underline sm:inline"
                        >
                            Back to store
                        </Link>
                        <div className="hidden text-right text-xs sm:block">
                            <p className={mutedText}>Signed in as</p>
                            <p className={`font-medium ${accentText}`}>{name}</p>
                        </div>
                        <button
                            onClick={onLogout}
                            className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-800 transition hover:border-neutral-500 hover:bg-neutral-100"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <>
        <nav
            className={`fixed w-full z-50 transition-all duration-500 ${
                scrolled
                    ? `${pageBackground} backdrop-blur-lg bg-opacity-90 shadow-lg py-3`
                    : "bg-transparent bg-gradient-to-b from-black/20 to-transparent py-5"
            }`}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                    <Link
                        to="/"
                        className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
                    >
                        URBAN WEAR
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) => `
                                    ${navTextClass} ${!scrolled ? 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]' : ''} transition-all duration-300 relative group font-bold
                                    ${isActive ? 'text-emerald-500' : 'hover:text-emerald-500'}
                                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        {link.name}
                                        <span className={`
                                            absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300
                                            ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}
                                        `}></span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={`${navTextClass} ${!scrolled ? 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]' : ''} hover:text-emerald-500 transition-all duration-300 relative group`}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        </button>

                        <button
                            onClick={() => navigate("/cart")}
                            className={`${navTextClass} ${!scrolled ? 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]' : ''} hover:text-emerald-500 transition-all duration-300 relative group`}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-xs text-white flex items-center justify-center animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-white focus:outline-none"
                        aria-label="Toggle navigation menu"
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                <div
                    id="mobile-menu"
                    className={`md:hidden transition-all duration-500 overflow-hidden ${
                        isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="flex flex-col space-y-4 pb-4">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) => `
                                    ${navTextClass} transition-colors py-2 block
                                    ${isActive ? 'text-emerald-500 font-bold border-l-2 border-emerald-500 pl-4' : 'hover:text-emerald-500'}
                                `}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        <div className="flex space-x-4 pt-4 border-t border-gray-700">
                            <button className={`${navTextClass} hover:text-emerald-500`}>
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={() => navigate("/cart")}
                                className={`${navTextClass} hover:text-emerald-500 relative`}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-xs text-white flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        {/* Search Overlay */}
        <div className={`fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl transition-all duration-500 ${isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center">
                <button 
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                >
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="w-full max-w-2xl animate-fade-in">
                    <p className="text-emerald-500 text-xs font-bold uppercase tracking-[0.3em] text-center mb-6">Search UrbanGear</p>
                    <form onSubmit={handleNavSearch} className="relative">
                        <input 
                            autoFocus={isSearchOpen}
                            type="text" 
                            value={navSearchQuery}
                            onChange={(e) => setNavSearchQuery(e.target.value)}
                            placeholder="Type to search..."
                            className="w-full bg-transparent border-b-2 border-white/20 py-6 text-4xl md:text-6xl font-bold text-white placeholder:text-white/10 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                        <button type="submit" className="absolute right-0 bottom-6 text-emerald-500 hover:scale-110 transition-transform">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </button>
                    </form>
                    <p className="mt-8 text-white/30 text-center text-sm">Hit Enter to see results in Shirts</p>
                </div>
            </div>
        </div>
        </>
    );
}

export default Navbar;
