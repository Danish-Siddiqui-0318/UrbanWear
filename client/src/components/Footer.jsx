import { Link } from "react-router-dom";

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-10 border-t border-neutral-200 pt-6 text-xs text-neutral-500">
            <div className="mx-auto flex max-w-5xl flex-col gap-4 px-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[rgb(234,164,52)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                        UrbanWear
                    </span>
                    <span className="hidden text-[11px] text-neutral-500 sm:inline">
                        Streetwear made simple. Manage products, orders, and customers in one place.
                    </span>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link
                        to="/"
                        className="transition hover:text-[rgb(234,164,52)]"
                    >
                        Home
                    </Link>
                    <Link
                        to="/login"
                        className="transition hover:text-[rgb(234,164,52)]"
                    >
                        Login
                    </Link>
                    <Link
                        to="/admin/login"
                        className="transition hover:text-[rgb(234,164,52)]"
                    >
                        Admin
                    </Link>
                </div>
            </div>
            <div className="mt-4 text-center text-[11px] text-neutral-400">
                © {year} UrbanWear. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;

