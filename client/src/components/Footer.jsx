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

function Footer({ variant = "public" }) {
    const currentYear = new Date().getFullYear();

    if (variant === "admin") {
        return (
            <footer className={`w-full border-t ${secondaryBorder} ${cardBackground}`}>
                <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-3 text-[11px] sm:flex-row">
                    <p className={mutedText}>Admin dashboard • Urban Wear</p>
                    <p className={mutedText}>© {currentYear} All rights reserved.</p>
                </div>
            </footer>
        );
    }

    const footerSections = [
        {
            title: "Shop",
            links: [
                { name: "Hoodies", path: "/shop/hoodies" },
                { name: "T-Shirts", path: "/shop/t-shirts" },
                { name: "Trousers", path: "/shop/trousers" },
                { name: "Accessories", path: "/shop/accessories" },
                { name: "New Arrivals", path: "/new-arrivals" },
            ],
        },
        {
            title: "Help",
            links: [
                { name: "Size Guide", path: "/size-guide" },
                { name: "Shipping Info", path: "/shipping" },
                { name: "Returns", path: "/returns" },
                { name: "FAQs", path: "/faqs" },
                { name: "Contact Us", path: "/contact" },
            ],
        },
        {
            title: "About",
            links: [
                { name: "Our Story", path: "/about" },
                { name: "Sustainability", path: "/sustainability" },
                { name: "Careers", path: "/careers" },
                { name: "Press", path: "/press" },
                { name: "Blog", path: "/blog" },
            ],
        },
    ];

    return (
        <footer
            className={`${pageBackground} ${pageText} border-t border-gray-800`}
        >
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    <div className="lg:col-span-2">
                        <Link
                            to="/"
                            className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent inline-block mb-4 hover:scale-105 transition-transform"
                        >
                            URBAN WEAR
                        </Link>
                        <p className={`${mutedText} mb-4 max-w-md`}>
                            Redefining urban fashion with sustainable, stylish, and
                            comfortable clothing for the modern trendsetter.
                        </p>

                        <div className="flex space-x-4">
                            {["facebook", "twitter", "instagram", "youtube"].map(
                                (social) => (
                                    <a
                                        key={social}
                                        href={`https://${social}.com/urbanwear`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gradient-to-r ${primaryGradient} hover:scale-110 transition-all duration-300 group`}
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            {social === "facebook" && (
                                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                            )}
                                            {social === "twitter" && (
                                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                            )}
                                            {social === "instagram" && (
                                                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 011.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 4.915 4.915 0 01-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />
                                            )}
                                            {social === "youtube" && (
                                                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                            )}
                                        </svg>
                                    </a>
                                )
                            )}
                        </div>
                    </div>

                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-semibold text-white mb-4">
                                {section.title}
                            </h3>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className={`${mutedText} hover:text-emerald-500 transition-colors text-sm`}
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-800 pt-8 pb-4">
                    <div className="max-w-md mx-auto text-center">
                        <h3 className="text-white font-semibold mb-2">
                            Join the Urban Family
                        </h3>
                        <p className={`${mutedText} text-sm mb-4`}>
                            Subscribe to get special offers, free giveaways, and exclusive
                            deals.
                        </p>
                        <form
                            className="flex gap-2"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:border-emerald-500 outline-none text-sm"
                            />
                            <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className={`${mutedText} text-sm`}>
                        © {currentYear} Urban Wear. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link
                            to="/privacy"
                            className={`${mutedText} hover:text-emerald-500 text-sm transition-colors`}
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            to="/terms"
                            className={`${mutedText} hover:text-emerald-500 text-sm transition-colors`}
                        >
                            Terms of Service
                        </Link>
                        <Link
                            to="/cookies"
                            className={`${mutedText} hover:text-emerald-500 text-sm transition-colors`}
                        >
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
