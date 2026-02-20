import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { primaryGradient } from "../theme/colors";

function Navbar({ onSearchClick }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userEmail = localStorage.getItem("userEmail") || "User";

    const accountPath = token ? (role === "admin" ? "/admin" : "/") : "/login";
    const accountLabel = token ? (role === "admin" ? "Admin" : "Home") : "Account";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userEmail");
        navigate("/login");
        setProfileMenuOpen(false);
    };

    const links = [
        { to: "/", label: "Home", icon: "🏠" },
        { to: "/#hoodies", label: "Hoodies", icon: "👕" },
        { to: "/collections", label: "Collections", icon: "📦" },
        { to: "/about", label: "About", icon: "ℹ️" },
    ];

    function isActive(path) {
        const basePath = path.split("#")[0];
        return location.pathname === basePath;
    }

    return (
        <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur-md shadow-sm">
            <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo and mobile menu */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors md:hidden"
                        aria-label="Toggle navigation"
                    >
                        <div className="flex flex-col gap-1.5">
                            <span className={`block h-0.5 w-5 bg-neutral-700 transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`block h-0.5 w-5 bg-neutral-700 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
                            <span className={`block h-0.5 w-5 bg-neutral-700 transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                        </div>
                    </button>
                    
                    <Link to="/" className="flex items-center gap-2 group">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r ${primaryGradient} text-lg font-bold text-white shadow-md group-hover:shadow-lg transition-shadow`}
                        >
                            UW
                        </div>
                        <span className="hidden text-base font-bold tracking-tight text-neutral-900 sm:inline-block group-hover:text-[rgb(234,164,52)] transition-colors">
                            UrbanWear
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-8 text-sm font-medium text-neutral-700 md:flex">
                    {links.map((link) => (
                        <Link
                            key={link.label}
                            to={link.to}
                            className={`relative px-1 py-2 transition-colors ${
                                isActive(link.to) 
                                    ? "text-[rgb(234,164,52)] font-semibold" 
                                    : "hover:text-neutral-900"
                            }`}
                        >
                            {link.label}
                            {isActive(link.to) && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[rgb(234,164,52)] rounded-full" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Right side icons */}
                <div className="flex items-center gap-2">
                    {/* Search Button */}
                    <button
                        type="button"
                        onClick={onSearchClick}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 hover:border-neutral-400 transition-all"
                        aria-label="Search"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </button>

                    {/* Cart Button */}
                    <button
                        type="button"
                        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 hover:border-neutral-400 transition-all"
                        aria-label="Cart"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[rgb(234,164,52)] text-[10px] font-bold text-white flex items-center justify-center">
                            3
                        </span>
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 hover:border-neutral-400 transition-all"
                            aria-label="Profile"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </button>

                        {/* Profile Dropdown Menu */}
                        {profileMenuOpen && (
                            <>
                                <div 
                                    className="fixed inset-0 z-40"
                                    onClick={() => setProfileMenuOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-neutral-200 bg-white shadow-lg z-50 py-1">
                                    {token ? (
                                        <>
                                            <div className="px-4 py-2 border-b border-neutral-100">
                                                <p className="text-xs text-neutral-500">Signed in as</p>
                                                <p className="text-sm font-medium text-neutral-900 truncate">
                                                    {userEmail}
                                                </p>
                                            </div>
                                            <Link
                                                to={accountPath}
                                                onClick={() => setProfileMenuOpen(false)}
                                                className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                                            >
                                                {accountLabel}
                                            </Link>
                                            <Link
                                                to="/profile"
                                                onClick={() => setProfileMenuOpen(false)}
                                                className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                                            >
                                                Profile Settings
                                            </Link>
                                            <Link
                                                to="/orders"
                                                onClick={() => setProfileMenuOpen(false)}
                                                className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                                            >
                                                My Orders
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-neutral-100"
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/login"
                                                onClick={() => setProfileMenuOpen(false)}
                                                className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                to="/register"
                                                onClick={() => setProfileMenuOpen(false)}
                                                className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                                            >
                                                Register
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-neutral-200 bg-white">
                    <div className="px-4 py-3 space-y-1">
                        {links.map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                    isActive(link.to)
                                        ? "bg-[rgba(234,164,52,0.08)] text-[rgb(234,164,52)]"
                                        : "text-neutral-700 hover:bg-neutral-100"
                                }`}
                            >
                                <span className="text-lg">{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}
                        
                        {/* Mobile Logout Button */}
                        {token && (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMenuOpen(false);
                                }}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <span className="text-lg">🚪</span>
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
