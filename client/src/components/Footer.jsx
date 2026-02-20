import { Link } from "react-router-dom";

function Footer() {
    const year = new Date().getFullYear();

    const quickLinks = [
        { to: "/", label: "Home" },
        { to: "/hoodies", label: "Hoodies" },
        { to: "/collections", label: "Collections" },
        { to: "/new-arrivals", label: "New Arrivals" },
        { to: "/sale", label: "Sale" },
    ];

    const supportLinks = [
        { to: "/about", label: "About Us" },
        { to: "/contact", label: "Contact" },
        { to: "/faq", label: "FAQ" },
        { to: "/shipping", label: "Shipping Info" },
        { to: "/returns", label: "Returns & Exchanges" },
    ];

    const legalLinks = [
        { to: "/privacy", label: "Privacy Policy" },
        { to: "/terms", label: "Terms of Service" },
        { to: "/cookies", label: "Cookie Policy" },
    ];

    const socialLinks = [
        { name: "Instagram", icon: "📸", url: "https://instagram.com" },
        { name: "Twitter", icon: "🐦", url: "https://twitter.com" },
        { name: "Facebook", icon: "📘", url: "https://facebook.com" },
        { name: "TikTok", icon: "🎵", url: "https://tiktok.com" },
    ];

    return (
        <footer className="bg-neutral-900 text-neutral-300 mt-16 w-full">
            {/* Main Footer - Full Width with Padding */}
            <div className="w-full px-6 py-12 md:px-12 lg:px-16 lg:py-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 max-w-7xl mx-auto">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[rgb(234,164,52)] to-[rgb(214,144,32)] text-lg font-bold text-white shadow-lg">
                                UW
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                UrbanWear
                            </span>
                        </div>
                        <p className="text-sm text-neutral-400 mb-4 max-w-md">
                            Streetwear made simple. We bring you the freshest urban fashion, 
                            from classic hoodies to limited edition drops. Join the movement 
                            and express your style with UrbanWear.
                        </p>
                        
                        {/* Newsletter Signup */}
                        <div className="mt-6">
                            <h3 className="text-sm font-semibold text-white mb-2">
                                Stay in the loop
                            </h3>
                            <p className="text-xs text-neutral-400 mb-3">
                                Subscribe for exclusive drops and early access
                            </p>
                            <div className="flex max-w-md">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 rounded-l-lg bg-neutral-800 border border-neutral-700 px-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[rgb(234,164,52)] transition-colors"
                                />
                                <button className="bg-[rgb(234,164,52)] hover:bg-[rgb(214,144,32)] text-white px-4 py-2 rounded-r-lg text-sm font-medium transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Shop
                        </h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-neutral-400 hover:text-[rgb(234,164,52)] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Support
                        </h3>
                        <ul className="space-y-2">
                            {supportLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-neutral-400 hover:text-[rgb(234,164,52)] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Connect
                        </h3>
                        
                        {/* Contact Info */}
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-neutral-400">
                                <span className="text-lg">📧</span>
                                <a href="mailto:support@urbanwear.com" className="hover:text-[rgb(234,164,52)] transition-colors">
                                    support@urbanwear.com
                                </a>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral-400">
                                <span className="text-lg">📱</span>
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral-400">
                                <span className="text-lg">📍</span>
                                <span>123 Fashion St, NY 10001</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 hover:bg-[rgb(234,164,52)] text-neutral-400 hover:text-white transition-all transform hover:scale-110"
                                    aria-label={social.name}
                                >
                                    <span className="text-lg">{social.icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar with Legal Links - Full Width */}
            <div className="w-full border-t border-neutral-800 px-6 py-8 md:px-12 lg:px-16">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 max-w-7xl mx-auto">
                    <div className="flex flex-wrap gap-4">
                        {legalLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                className="text-xs text-neutral-500 hover:text-[rgb(234,164,52)] transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                        <span>© {year} UrbanWear. All rights reserved.</span>
                        <span className="w-1 h-1 rounded-full bg-neutral-700" />
                        <span>Made with 🖤 in NYC</span>
                    </div>
                </div>
            </div>

            {/* Trust Badges - Full Width */}
            <div className="w-full bg-neutral-800 py-4 px-6 md:px-12 lg:px-16">
                <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-neutral-400 max-w-7xl mx-auto">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🔒</span>
                        <span>Secure Payments</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🚚</span>
                        <span>Free Shipping Over $50</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-lg">↩️</span>
                        <span>30-Day Returns</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-lg">💬</span>
                        <span>24/7 Support</span>
                    </div>
                </div>
            </div>

            {/* Payment Methods - Full Width */}
            <div className="w-full bg-neutral-900 py-4 border-t border-neutral-800 px-6 md:px-12 lg:px-16">
                <div className="flex flex-wrap items-center justify-center gap-4 max-w-7xl mx-auto">
                    <span className="text-xs text-neutral-500">We Accept:</span>
                    <span className="text-lg">💳</span>
                    <span className="text-lg">📱</span>
                    <span className="text-lg">💰</span>
                    <span className="text-lg">🏦</span>
                    <span className="text-xs text-neutral-500 ml-2">Visa, Mastercard, PayPal, Apple Pay</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;