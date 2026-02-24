import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    pageBackground,
    pageText,
    mutedText,
    cardBackground,
    secondaryBorder,
} from "../theme/colors";

function Shop() {
    return (
        <div className={`min-h-screen ${pageBackground} ${pageText}`}>
            <Navbar />
            <main className="pt-24 pb-20 px-4">
                <div className="mx-auto flex max-w-5xl flex-col gap-10">
                    <section className="flex flex-col gap-4">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                            Shop
                        </p>
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            All UrbanWear products
                        </h1>
                        <p className={`max-w-xl text-sm sm:text-base ${mutedText}`}>
                            Browse all categories including hoodies, t-shirts, trousers and
                            accessories. Use the top navigation or category cards on the
                            home page to jump into a style that fits you.
                        </p>
                    </section>

                    <section
                        className={`rounded-3xl border ${secondaryBorder} ${cardBackground} p-6 sm:p-8`}
                    >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-medium">
                                    Start with our featured collections
                                </p>
                                <p className={`mt-1 text-xs ${mutedText}`}>
                                    Check the New Arrivals and Collections pages for curated
                                    drops and themed outfits.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[rgb(234,164,52)] via-[rgb(234,164,52)] to-[rgb(234,164,52)] px-4 py-1.5 text-xs font-medium text-slate-950">
                                    City-ready fits
                                </span>
                                <span className="inline-flex items-center rounded-full border border-dashed border-neutral-300 px-4 py-1.5 text-xs font-medium text-neutral-700">
                                    Everyday comfort
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

export default Shop;
