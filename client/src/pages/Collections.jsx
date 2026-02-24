import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    pageBackground,
    pageText,
    mutedText,
    cardBackground,
    secondaryBorder,
} from "../theme/colors";

function Collections() {
    return (
        <div className={`min-h-screen ${pageBackground} ${pageText}`}>
            <Navbar />
            <main className="pt-24 pb-20 px-4">
                <div className="mx-auto flex max-w-5xl flex-col gap-10">
                    <section className="flex flex-col gap-4">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                            Collections
                        </p>
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            Curated looks for every city moment
                        </h1>
                        <p className={`max-w-xl text-sm sm:text-base ${mutedText}`}>
                            Explore themed collections built around the way you move through
                            the city, from late-night sessions to weekend escapes.
                        </p>
                    </section>

                    <section className="grid gap-6 sm:grid-cols-2">
                        <div
                            className={`rounded-3xl border ${secondaryBorder} ${cardBackground} p-6 sm:p-7`}
                        >
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                                Capsule
                            </p>
                            <h2 className="mt-2 text-lg font-semibold">
                                City Lights collection
                            </h2>
                            <p className={`mt-2 text-sm ${mutedText}`}>
                                Reflective accents, relaxed fits and pieces made to stand out
                                under streetlights.
                            </p>
                        </div>
                        <div
                            className={`rounded-3xl border ${secondaryBorder} ${cardBackground} p-6 sm:p-7`}
                        >
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                                Essentials
                            </p>
                            <h2 className="mt-2 text-lg font-semibold">
                                Everyday core staples
                            </h2>
                            <p className={`mt-2 text-sm ${mutedText}`}>
                                Clean hoodies, heavyweight tees and trousers that work from
                                morning commute to late-night hangouts.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Collections;
