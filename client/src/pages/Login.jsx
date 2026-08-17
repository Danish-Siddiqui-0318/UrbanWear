import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    pageBackground,
    pageText,
    primaryGradient,
    primaryBorder,
    mutedText,
    subtleText,
} from "../theme/colors";
import { API_BASE_URL } from "../config/api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                email,
                password,
                role: "admin",
            });

            const data = response.data;

            localStorage.setItem("token", data.token);

            if (data.name) {
                localStorage.setItem("name", data.name);
            }

            navigate("/admin");
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError(err.message || "Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`min-h-screen ${pageBackground} ${pageText} flex`}>
            {/* Left side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Brand/Logo */}
                    <div className="mb-8">
                        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                            URBAN WEAR
                        </Link>
                    </div>

                    {/* Welcome Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">Admin login</h1>
                        <p className={`${mutedText} text-sm mt-2`}>
                            Sign in to access the UrbanWear admin dashboard
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className={`text-sm font-medium ${mutedText}`}>
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                                className={`w-full rounded-xl border ${primaryBorder} bg-white/50 backdrop-blur-sm px-4 py-3.5 text-sm ${pageText} outline-none ring-emerald-500/60 placeholder:${subtleText} focus:border-emerald-400 focus:ring-2 transition-all duration-200`}
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <label htmlFor="password" className={`text-sm font-medium ${mutedText}`}>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                    className={`w-full rounded-xl border ${primaryBorder} bg-white/50 backdrop-blur-sm px-4 py-3.5 pr-12 text-sm ${pageText} outline-none ring-emerald-500/60 placeholder:${subtleText} focus:border-emerald-400 focus:ring-2 transition-all duration-200`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-500 hover:text-neutral-700 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                                />
                                <span className={`text-sm ${mutedText}`}>Remember this device</span>
                            </label>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-700 animate-shake">
                                {error}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full rounded-xl bg-gradient-to-r ${primaryGradient} px-4 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>

                        {/* Helper text */}
                        <div className={`text-center text-xs ${mutedText} pt-2`}>
                            This page is only for UrbanWear store administrators.
                        </div>
                    </form>
                </div>
            </div>

            {/* Right side - Image and Branding */}
            <div className="hidden lg:block lg:w-1/2 relative">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop"
                        alt="Urban fashion"
                        className="w-full h-full object-cover"
                    />
                    {/* Overlay with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-teal-900/80 to-transparent"></div>
                </div>

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
                    <div className="max-w-lg text-center">
                        <h2 className="text-4xl font-bold mb-4">Style That Speaks</h2>
                        <p className="text-lg text-white/90 mb-8">
                            Join thousands of fashion enthusiasts who trust Urban Wear for their daily style inspiration
                        </p>
                        
                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold">Exclusive Drops</h3>
                                <p className="text-xs text-white/70">Get early access to new collections</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold">Member Prices</h3>
                                <p className="text-xs text-white/70">Special discounts for members</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold">Style Finder</h3>
                                <p className="text-xs text-white/70">Personalized outfit recommendations</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold">Wishlist</h3>
                                <p className="text-xs text-white/70">Save your favorite items</p>
                            </div>
                        </div>

                        {/* Testimonial */}
                        <div className="mt-8 pt-8 border-t border-white/20">
                            <p className="text-sm italic text-white/80">
                                "Urban Wear has completely transformed my wardrobe. The quality and style are unmatched!"
                            </p>
                            <p className="text-xs text-white/60 mt-2">— Alex M., Verified Buyer</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
