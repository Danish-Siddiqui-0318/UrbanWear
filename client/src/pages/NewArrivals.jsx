import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    pageBackground,
    pageText,
    mutedText,
    cardBackground,
    secondaryBorder,
} from "../theme/colors";

function NewArrivals() {
    return (
        <div className={`min-h-screen ${pageBackground} ${pageText}`}>
            <Navbar />
            <main className="pt-24 pb-20 px-4">
                <div className="mx-auto flex max-w-5xl flex-col gap-10">
                    <section className="flex flex-col gap-4">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                            New Arrivals
                        </p>
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            Fresh drops just landed
                        </h1>
                        <p className={`max-w-xl text-sm sm:text-base ${mutedText}`}>
                            Stay ahead of the streetwear curve. Discover the latest hoodies,
                            tees and accessories added to UrbanWear.
                        </p>
                    </section>

                    <section
                        className={`overflow-hidden rounded-3xl border ${secondaryBorder} ${cardBackground}`}
                    >
                        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                            <div>
                                <p className="text-sm font-medium">
                                    Limited quantities, high demand
                                </p>
                                <p className={`mt-1 text-xs ${mutedText}`}>
                                    New pieces tend to sell out fast. Check back often to catch
                                    the next wave of designs.
                                </p>
                            </div>
                            <div className="flex flex-col items-start gap-2 text-xs sm:items-end">
                                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[rgb(234,164,52)] via-[rgb(234,164,52)] to-[rgb(234,164,52)] px-4 py-1.5 font-medium text-slate-950">
                                    Updated weekly
                                </span>
                                <span className={mutedText}>
                                    Watch for the New Arrival badge across the store.
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

export default NewArrivals;
