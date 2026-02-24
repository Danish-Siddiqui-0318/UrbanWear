import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    pageBackground,
    pageText,
    mutedText,
    cardBackground,
    secondaryBorder,
} from "../theme/colors";

function Cart() {
    return (
        <div className={`min-h-screen ${pageBackground} ${pageText}`}>
            <Navbar />
            <main className="pt-24 pb-20 px-4">
                <div className="mx-auto flex max-w-5xl flex-col gap-10">
                    <section className="flex flex-col gap-4">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                            Cart
                        </p>
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            Your bag is waiting
                        </h1>
                        <p className={`max-w-xl text-sm sm:text-base ${mutedText}`}>
                            This is where selected products would appear before checkout.
                            The UI is ready for you to connect it to real cart data.
                        </p>
                    </section>

                    <section
                        className={`rounded-3xl border ${secondaryBorder} ${cardBackground} p-6 sm:p-8`}
                    >
                        <p className="text-sm font-medium">
                            No items yet
                        </p>
                        <p className={`mt-2 text-xs ${mutedText}`}>
                            Use the Shop and New Arrivals pages to explore products and add
                            them to your cart in a future iteration.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Cart;

