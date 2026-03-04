// components/Footer.jsx
import { Link } from "react-router-dom";
import {
    pageBackground,
    pageText,
    mutedText,
    primaryGradient,
    secondaryBorder,
    cardBackground,
} from "../theme/colors";

function Footer({ variant = "public", className = "" }) {
    const currentYear = new Date().getFullYear();

    if (variant === "admin") {
        return (
            <footer className={`w-full border-t ${secondaryBorder} ${cardBackground} ${className}`}>
                <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-3 text-[11px] sm:flex-row">
                    <p className={mutedText}>Admin dashboard • Urban Wear</p>
                    <p className={mutedText}>© {currentYear} All rights reserved.</p>
                </div>
            </footer>
        );
    }

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Shirt", path: "/shirt" },
        { name: "Oversized T-Shirts", path: "/OverSized_TShirts" },
        { name: "Trouser", path: "/trousers" },
        { name: "Sale", path: "/sale" },
        { name: "Track Order", path: "/track-order" },
    ];

    return (
        <footer
            className={`${pageBackground} ${pageText} border-t border-gray-800 ${className}`}
        >
            <div className="container mx-auto px-4 md:px-6 py-10 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 md:mb-12">
                    <div className="lg:col-span-1 text-center md:text-left">
                        <Link
                            to="/"
                            className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent inline-block mb-4 hover:scale-105 transition-transform"
                        >
                            URBAN WEAR
                        </Link>
                        <p className={`${mutedText} mb-4 max-w-md mx-auto md:mx-0`}>
                            Redefining urban fashion with sustainable, stylish, and
                            comfortable clothing for the modern trendsetter.
                        </p>

                        <div className="flex space-x-4 justify-center md:justify-start">
                            {["facebook", "instagram"].map(
                                (social) => (
                                    <a
                                        key={social}
                                        href={`https://${social}.com/urbanwearpkstore`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social}
                                        className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gradient-to-r ${primaryGradient} hover:scale-110 transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(234,164,52)] focus-visible:ring-offset-2 focus-visible:ring-offset-white`}
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            {social === "facebook" && (
                                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                            )}
                                            {social === "instagram" && (
                                                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 011.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 4.915 4.915 0 01-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />
                                            )}
                                        </svg>
                                    </a>
                                )
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="font-semibold text-neutral-900 mb-4 text-center md:text-left">Quick Links</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="group inline-flex items-center justify-between w-full rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:border-neutral-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(234,164,52)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                                    >
                                        <span>{link.name}</span>
                                        <svg className="ml-2 h-4 w-4 text-neutral-500 transition-transform group-hover:translate-x-1 group-hover:text-[rgb(234,164,52)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>


                <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 flex justify-center items-center">
                    <p className={`${mutedText} text-sm`}>
                        © {currentYear} Urban Wear. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
