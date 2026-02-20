import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { primaryGradient } from "../theme/colors";

function Navbar({ onSearchClick }) {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const accountPath = token ? (role === "admin" ? "/admin" : "/dashboard") : "/login";
    const accountLabel = token ? (role === "admin" ? "Admin" : "Dashboard") : "Account";

    const links = [
        { to: "/", label: "Home" },
        { to: "/#hoodies", label: "Hoodies" },
        { to: accountPath, label: accountLabel },
    ];

    function isActive(path) {
        const basePath = path.split("#")[0];
        return location.pathname === basePath;
    }

    return (
        <nav className="border-b border-neutral-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-3 sm:px-4">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 md:hidden"
                    >
                        <span className="sr-only">Toggle navigation</span>
                        <span className="block h-0.5 w-4 rounded-full bg-neutral-700" />
                    </button>
                    <Link to="/" className="flex items-center gap-2">
                        <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r ${primaryGradient} text-sm font-semibold text-white`}
                        >
                            U
                        </div>
                        <span className="hidden text-sm font-semibold tracking-tight text-neutral-900 sm:inline">
                            UrbanWear
                        </span>
                    </Link>
                </div>

                <div className="hidden items-center gap-6 text-xs font-medium text-neutral-600 md:flex">
                    {links.map((link) => (
                        <Link
                            key={link.label}
                            to={link.to}
                            className={`transition ${
                                isActive(link.to) ? "text-[rgb(234,164,52)]" : "hover:text-neutral-900"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onSearchClick}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-700"
                    >
                        <span className="sr-only">Search</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="6" />
                            <line x1="16.5" y1="16.5" x2="20" y2="20" />
                        </svg>
                    </button>
                    <Link
                        to={accountPath}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-700"
                    >
                        <span className="sr-only">{accountLabel}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="8" r="3.2" />
                            <path d="M5 19.4C5.8 16.6 8.6 15 12 15s6.2 1.6 7 4.4" />
                        </svg>
                    </Link>
                    <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-700"
                    >
                        <span className="sr-only">Cart</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="9" cy="19" r="1.5" />
                            <circle cx="17" cy="19" r="1.5" />
                            <path d="M3 4h2l1.5 10.5H18l1.5-7.5H7.2" />
                        </svg>
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="border-t border-neutral-200 bg-white px-3 pb-3 pt-2 text-xs font-medium text-neutral-700 md:hidden">
                    <div className="flex flex-col gap-2">
                        {links.map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                className={`rounded-lg px-2 py-1 transition ${
                                    isActive(link.to)
                                        ? "bg-[rgba(234,164,52,0.08)] text-[rgb(234,164,52)]"
                                        : "hover:bg-neutral-100"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
