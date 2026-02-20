import { useNavigate } from "react-router-dom";
import { pageBackground, pageText, secondaryBorder, cardBackground, mutedText } from "../theme/colors";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdminDashboard() {
    const navigate = useNavigate();
    const name = localStorage.getItem("name") || "Admin";

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        navigate("/login");
    }

    return (
        <div className={`min-h-screen ${pageBackground} ${pageText}`}>
            <div className="mx-auto flex h-full max-w-5xl flex-col px-4 py-4">
                <Navbar />

                <main className="mt-10 flex flex-1 flex-col justify-between">
                    <div className="flex flex-1 flex-col items-center justify-center text-center">
                        <div className="w-full max-w-xl space-y-6">
                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                Welcome back, {name}
                            </h1>
                            <p className={`text-sm ${mutedText} sm:text-base`}>
                                This is the admin area of UrbanWear. Connect this dashboard to your
                                product and order management pages to control the full store
                                experience.
                            </p>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <div className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-4 text-left`}>
                                    <p className={`text-xs ${mutedText}`}>Live products</p>
                                    <p className="mt-2 text-sm font-semibold text-emerald-400">0</p>
                                </div>
                                <div className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-4 text-left`}>
                                    <p className={`text-xs ${mutedText}`}>Orders today</p>
                                    <p className="mt-2 text-sm font-semibold text-sky-400">0</p>
                                </div>
                                <div className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-4 text-left`}>
                                    <p className={`text-xs ${mutedText}`}>Revenue</p>
                                    <p className="mt-2 text-sm font-semibold text-indigo-400">$0</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <Footer />
                        <button
                            onClick={handleLogout}
                            className="rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-medium text-neutral-800 transition hover:border-neutral-500 hover:bg-neutral-100"
                        >
                            Logout
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;
