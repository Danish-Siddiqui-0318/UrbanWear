import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    pageBackground,
    pageText,
    mutedText,
    cardBackground,
    secondaryBorder,
    accentText,
} from "../theme/colors";

function Sale() {
    return (
        <div className={`min-h-screen ${pageBackground} ${pageText}`}>
            <Navbar />
            <main className="pt-24 pb-20 px-4">
                <div className="mx-auto flex max-w-5xl flex-col gap-10">
                    <section className="flex flex-col gap-4">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                            Sale
                        </p>
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            UrbanWear sale and special offers
                        </h1>
                        <p className={`max-w-xl text-sm sm:text-base ${mutedText}`}>
                            Discover limited-time discounts on hoodies, tees and more.
                            Refresh your wardrobe while the prices are low.
                        </p>
                    </section>

                    <section
                        className={`rounded-3xl border ${secondaryBorder} ${cardBackground} p-6 sm:p-8`}
                    >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-medium">
                                    Check back for seasonal drops
                                </p>
                                <p className={`mt-1 text-xs ${mutedText}`}>
                                    Sale items will appear here as new campaigns go live.
                                </p>
                            </div>
                            <div className="flex flex-col items-start gap-2 text-xs sm:items-end">
                                <span className={`font-semibold ${accentText}`}>
                                    Sign in when available to see members-only prices.
                                </span>
                                <span className={mutedText}>
                                    Combine sale items with new arrivals for complete looks.
                                </span>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Sale;
