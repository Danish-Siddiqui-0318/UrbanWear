import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    pageBackground,
    pageText,
    mutedText,
    cardBackground,
    secondaryBorder,
} from "../theme/colors";

function Account() {
    return (
        <div className={`min-h-screen ${pageBackground} ${pageText}`}>
            <Navbar />
            <main className="pt-24 pb-20 px-4">
                <div className="mx-auto flex max-w-5xl flex-col gap-10">
                    <section className="flex flex-col gap-4">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                            Account
                        </p>
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            Your UrbanWear account
                        </h1>
                        <p className={`max-w-xl text-sm sm:text-base ${mutedText}`}>
                            In a full build this is where you would see your orders,
                            saved items and preferences.
                        </p>
                    </section>

                    <section
                        className={`rounded-3xl border ${secondaryBorder} ${cardBackground} p-6 sm:p-8`}
                    >
                        <p className="text-sm font-medium">
                            Account area coming soon
                        </p>
                        <p className={`mt-2 text-xs ${mutedText}`}>
                            For now, use the navigation to browse products and the cart page
                            to review what you plan to buy.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Account;

