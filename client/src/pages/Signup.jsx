import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    pageBackground,
    pageText,
    primaryGradient,
    primaryBorder,
    cardBackground,
    mutedText,
    subtleText,
    accentText,
} from "../theme/colors";
import { API_BASE_URL } from "../config/api";

function Signup() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        
        // Password validation
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        
        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        if (!agreeTerms) {
            setError("Please agree to the Terms and Conditions");
            return;
        }

        setLoading(true);

        try {
            await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
            navigate("/login", { state: { message: "Account created successfully! Please login." } });
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

    const handleSocialSignup = (provider) => {
        // Implement social signup logic here
        console.log(`Signing up with ${provider}`);
    };

    return (
        <div className={`min-h-screen ${pageBackground} ${pageText} flex`}>
            {/* Left side - Signup Form */}
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
                        <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
                        <p className={`${mutedText} text-sm mt-2`}>
                            Join the Urban Wear community and start your style journey
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field */}
                        <div className="space-y-1.5">
                            <label htmlFor="name" className={`text-sm font-medium ${mutedText}`}>
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                                className={`w-full rounded-xl border ${primaryBorder} bg-white/50 backdrop-blur-sm px-4 py-3.5 text-sm ${pageText} outline-none ring-emerald-500/60 placeholder:${subtleText} focus:border-emerald-400 focus:ring-2 transition-all duration-200`}
                                placeholder="John Doe"
                            />
                        </div>

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
                                    minLength={8}
                                    className={`w-full rounded-xl border ${primaryBorder} bg-white/50 backdrop-blur-sm px-4 py-3.5 pr-12 text-sm ${pageText} outline-none ring-emerald-500/60 placeholder:${subtleText} focus:border-emerald-400 focus:ring-2 transition-all duration-200`}
                                    placeholder="••••••••"
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

                        {/* Confirm Password Field */}
                        <div className="space-y-1.5">
                            <label htmlFor="confirmPassword" className={`text-sm font-medium ${mutedText}`}>
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    required
                                    className={`w-full rounded-xl border ${primaryBorder} bg-white/50 backdrop-blur-sm px-4 py-3.5 pr-12 text-sm ${pageText} outline-none ring-emerald-500/60 placeholder:${subtleText} focus:border-emerald-400 focus:ring-2 transition-all duration-200`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-500 hover:text-neutral-700 transition-colors"
                                >
                                    {showConfirmPassword ? (
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

                        {/* Password Strength Indicator */}
                        {password && (
                            <div className="space-y-1">
                                <div className="flex gap-1 h-1">
                                    <div className={`flex-1 rounded-full transition-all duration-300 ${
                                        password.length >= 8 ? 'bg-emerald-500' : 'bg-gray-200'
                                    }`} />
                                    <div className={`flex-1 rounded-full transition-all duration-300 ${
                                        /[A-Z]/.test(password) && /[a-z]/.test(password) ? 'bg-emerald-500' : 'bg-gray-200'
                                    }`} />
                                    <div className={`flex-1 rounded-full transition-all duration-300 ${
                                        /[0-9]/.test(password) ? 'bg-emerald-500' : 'bg-gray-200'
                                    }`} />
                                    <div className={`flex-1 rounded-full transition-all duration-300 ${
                                        /[^A-Za-z0-9]/.test(password) ? 'bg-emerald-500' : 'bg-gray-200'
                                    }`} />
                                </div>
                                <p className={`text-xs ${mutedText}`}>
                                    Use 8+ characters with mix of letters, numbers & symbols
                                </p>
                            </div>
                        )}

                        {/* Terms and Conditions */}
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                            />
                            <label htmlFor="terms" className={`text-sm ${mutedText}`}>
                                I agree to the{" "}
                                <Link to="/terms" className={`${accentText} hover:underline`}>
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link to="/privacy" className={`${accentText} hover:underline`}>
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-700 animate-shake">
                                {error}
                            </div>
                        )}

                        {/* Signup Button */}
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
                                    Creating account...
                                </span>
                            ) : (
                                "Create Account"
                            )}
                        </button>

                        {/* Social Signup Options */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className={`w-full border-t ${primaryBorder}`}></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className={`px-4 ${cardBackground} ${mutedText}`}>Or sign up with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => handleSocialSignup('google')}
                                className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Google
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSocialSignup('facebook')}
                                className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                Facebook
                            </button>
                        </div>

                        {/* Login Link */}
                        <div className={`text-center text-sm ${mutedText} pt-2`}>
                            Already have an account?{" "}
                            <Link 
                                to="/login" 
                                className={`${accentText} hover:underline font-medium transition-all hover:gap-1 inline-flex items-center`}
                            >
                                Sign in
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                        {/* Admin Link */}
                        <div className={`mt-6 pt-4 text-center text-xs ${mutedText} border-t ${primaryBorder}`}>
                            <Link
                                to="/admin/login"
                                className={`${accentText} hover:underline font-medium inline-flex items-center gap-1 transition-all`}
                            >
                                Are you an admin?
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right side - Image and Branding */}
            <div className="hidden lg:block lg:w-1/2 relative">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
                        alt="Urban fashion model"
                        className="w-full h-full object-cover"
                    />
                    {/* Overlay with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-teal-900/80 to-transparent"></div>
                </div>

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
                    <div className="max-w-lg text-center">
                        <h2 className="text-4xl font-bold mb-4">Start Your Style Journey</h2>
                        <p className="text-lg text-white/90 mb-8">
                            Join thousands of fashion enthusiasts and get access to exclusive drops, member prices, and personalized style recommendations
                        </p>
                        
                        {/* Benefits */}
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold">10% Welcome Bonus</h3>
                                <p className="text-xs text-white/70">On your first purchase</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold">Style Quiz</h3>
                                <p className="text-xs text-white/70">Get personalized picks</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold">Free Shipping</h3>
                                <p className="text-xs text-white/70">On orders over $50</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold">Early Access</h3>
                                <p className="text-xs text-white/70">To new collections</p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-8 pt-8 border-t border-white/20 grid grid-cols-3 gap-4">
                            <div>
                                <div className="text-2xl font-bold">50K+</div>
                                <div className="text-xs text-white/70">Happy Customers</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">10K+</div>
                                <div className="text-xs text-white/70">Styles Available</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">4.8★</div>
                                <div className="text-xs text-white/70">Customer Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
