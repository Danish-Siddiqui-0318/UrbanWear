// pages/Customize.jsx
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    pageBackground,
    pageText,
    primaryGradient,
    mutedText,
} from "../theme/colors";
import { WHATSAPP_NUMBER, WHATSAPP_COUNTRY_CODE } from "../config/api";

function Customize() {
    const handleWhatsAppClick = () => {
        const cc = WHATSAPP_COUNTRY_CODE ? WHATSAPP_COUNTRY_CODE.replace(/[^\d]/g, "") : "";
        let phone = WHATSAPP_NUMBER && WHATSAPP_NUMBER.replace(/[^\d]/g, "");

        if (phone && phone.startsWith("0") && cc) {
            phone = `${cc}${phone.slice(1)}`;
        }

        const base = phone ? `https://wa.me/${phone}` : `https://wa.me/`;
        const message = "Hi, I'm interested in customizing a shirt. Can you please provide more information about the customization process?";
        const whatsappUrl = `${base}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, "_blank");
    };

    return (
        <div className={`min-h-screen ${pageBackground} ${pageText}`}>
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>

                {/* Floating Particles */}
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-full animate-float"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${3 + Math.random() * 4}s`
                            }}
                        ></div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="relative z-10 container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Decorative Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                Custom Order
              </span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tight">
                            Want to{" "}
                            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Customize
              </span>
                            <br />
                            Your Own Shirt?
                        </h1>

                        {/* Description */}
                        <p className={`text-xl md:text-2xl mb-10 max-w-2xl mx-auto ${mutedText}`}>
                            Bring your unique vision to life. Whether it's a personal design,
                            brand logo, or special occasion outfit — we're here to make it perfect.
                        </p>

                        {/* WhatsApp Button */}
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <button
                                onClick={handleWhatsAppClick}
                                className="group relative px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/30 hover:scale-105 w-full sm:w-auto"
                            >
                <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.46 3.48 1.34 4.94l-1.48 5.45 5.59-1.45c1.41.83 3.02 1.26 4.7 1.26h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.2 15.88c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.42-.54-.42h-.46c-.18 0-.46.06-.7.3.24.24-.94.9-1.14 2.1-.2 1.2.62 2.44.7 2.62.08.18 1.48 2.26 3.6 3.2.5.22.9.36 1.22.46.5.16.96.14 1.32.08.4-.06 1.22-.5 1.4-1 .18-.5.18-.92.12-1-.06-.08-.22-.12-.46-.24z"/>
                  </svg>
                  Contact us on WhatsApp
                </span>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            </button>

                            <Link
                                to="/collections"
                                className="px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                            >
                                Browse Collections
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-emerald-400 mb-2">500+</div>
                                <div className="text-xs uppercase tracking-wider text-gray-400">Custom Designs</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-emerald-400 mb-2">24h</div>
                                <div className="text-xs uppercase tracking-wider text-gray-400">Quick Response</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-emerald-400 mb-2">100%</div>
                                <div className="text-xs uppercase tracking-wider text-gray-400">Satisfaction</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-emerald-400 mb-2">Free</div>
                                <div className="text-xs uppercase tracking-wider text-gray-400">Consultation</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Bottom Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-auto" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor" fillOpacity="0.05" className="text-emerald-500"/>
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-white/5">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Why Customize With{" "}
                            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Urban Wear
              </span>
                        </h2>
                        <p className={`${mutedText} max-w-2xl mx-auto`}>
                            We bring your creative vision to life with premium quality and attention to detail
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:scale-105 group">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Unique Designs</h3>
                            <p className={`${mutedText} text-sm leading-relaxed`}>
                                Create one-of-a-kind pieces that reflect your personal style and stand out from the crowd.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:scale-105 group">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
                            <p className={`${mutedText} text-sm leading-relaxed`}>
                                We use high-quality materials and printing techniques to ensure your custom shirt lasts.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:scale-105 group">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Fast Turnaround</h3>
                            <p className={`${mutedText} text-sm leading-relaxed`}>
                                Get your custom shirts delivered quickly without compromising on quality.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                        <p className={`${mutedText} max-w-2xl mx-auto`}>
                            Four simple steps to get your custom shirt
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { step: "1", title: "Contact Us", desc: "Reach out on WhatsApp with your idea" },
                            { step: "2", title: "Discuss", desc: "Share your design, size, and preferences" },
                            { step: "3", title: "Approve", desc: "Review and approve the final design" },
                            { step: "4", title: "Get It", desc: "We create and deliver your custom shirt" }
                        ].map((item, index) => (
                            <div key={index} className="text-center relative">
                                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center text-2xl font-bold text-white mb-4 relative z-10">
                                    {item.step}
                                </div>
                                {index < 3 && (
                                    <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
                                )}
                                <h3 className="font-bold mb-2">{item.title}</h3>
                                <p className={`text-sm ${mutedText}`}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4 bg-white/5">
                <div className="container mx-auto max-w-3xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Frequently Asked{" "}
                            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Questions
              </span>
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            { q: "What types of shirts can I customize?", a: "We offer customization on all our shirt types including t-shirts, oversized shirts, and formal shirts." },
                            { q: "What is the minimum order quantity?", a: "We accept custom orders starting from just 1 piece. No minimum quantity required!" },
                            { q: "How long does the customization process take?", a: "Typically 5-7 business days from design approval to delivery." },
                            { q: "Can I customize with my own design?", a: "Absolutely! Send us your design files and we'll bring them to life." }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
                                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                                <p className={`${mutedText}`}>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-teal-900"></div>
                <div className="absolute inset-0 opacity-10">
                    <img
                        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
                        alt="Pattern"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container mx-auto relative z-10 text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Create Something Unique?
                    </h2>
                    <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                        Start your custom shirt journey today. Our team is ready to help you.
                    </p>
                    <button
                        onClick={handleWhatsAppClick}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-emerald-900 font-bold rounded-full hover:shadow-xl hover:shadow-white/30 transition-all duration-300 hover:scale-105 group"
                    >
                        <span>Contact Us on WhatsApp</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </section>

            <Footer className="relative z-20" />

            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(10px); }
        }
        .animate-float {
          animation: float infinite ease-in-out;
        }
        @keyframes kenBurns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-ken-burns {
          animation: kenBurns 20s ease infinite alternate;
        }
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(15px); opacity: 0; }
        }
        .animate-scroll {
          animation: scroll 2s ease infinite;
        }
        @keyframes slideDown {
          0% { transform: translateY(-50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slideDown 1s ease forwards;
        }
        @keyframes slideUp {
          0% { transform: translateY(50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 1s ease forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease forwards;
          animation-delay: 0.6s;
          opacity: 0;
        }
      `}</style>
        </div>
    );
}

export default Customize;