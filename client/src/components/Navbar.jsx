// components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    pageBackground,
    pageText,
    primaryBorder,
    mutedText,
    accentText,
} from "../theme/colors";

function Navbar({ variant = "public", name = "Admin", onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [cartCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Shop", path: "/shop" },
        { name: "New Arrivals", path: "/new-arrivals" },
        { name: "Collections", path: "/collections" },
        { name: "Sale", path: "/sale" },
    ];

    if (variant === "admin") {
        return (
            <header
                className={`${pageBackground} ${pageText} border-b ${primaryBorder} sticky top-0 z-40`}
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
        <nav
            className={`fixed w-full z-50 transition-all duration-500 ${
                scrolled
                    ? `${pageBackground} backdrop-blur-lg bg-opacity-90 shadow-lg py-3`
                    : "bg-transparent py-5"
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

                    <div className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`${pageText} hover:text-emerald-500 transition-all duration-300 relative group`}
                            >
                                {link.name}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center space-x-6">
                        <button
                            className={`${pageText} hover:text-emerald-500 transition-all duration-300 relative group`}
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

                        <Link
                            to="/account"
                            className={`${pageText} hover:text-emerald-500 transition-all duration-300 relative group`}
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
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        </Link>

                        <button
                            onClick={() => navigate("/cart")}
                            className={`${pageText} hover:text-emerald-500 transition-all duration-300 relative group`}
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
                        className="lg:hidden text-white focus:outline-none"
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
                    className={`lg:hidden transition-all duration-500 overflow-hidden ${
                        isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="flex flex-col space-y-4 pb-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`${pageText} hover:text-emerald-500 transition-colors py-2`}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="flex space-x-4 pt-4 border-t border-gray-700">
                            <button className={`${pageText} hover:text-emerald-500`}>
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
                            <Link
                                to="/account"
                                className={`${pageText} hover:text-emerald-500`}
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
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </Link>
                            <button
                                onClick={() => navigate("/cart")}
                                className={`${pageText} hover:text-emerald-500 relative`}
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
    );
}

export default Navbar;
