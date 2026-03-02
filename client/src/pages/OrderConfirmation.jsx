import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { pageBackground, pageText, mutedText, primaryGradient } from '../theme/colors';

function OrderConfirmation() {
    const location = useLocation();
    const { order } = location.state || {};

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!order) {
        return (
            <div className={`min-h-screen ${pageBackground} ${pageText}`}>
                <Navbar />
                <main className="pt-32 pb-20 px-4 text-center">
                    <h1 className="text-2xl font-bold mb-4">No order details found.</h1>
                    <Link to="/" className="text-emerald-500 hover:underline">Return to Homepage</Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${pageBackground} ${pageText}`}>
            <Navbar />
            <main className="pt-32 pb-20 px-4">
                <div className="mx-auto max-w-2xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">Thank You for Your Order!</h1>
                        <p className={`${mutedText}`}>Your order has been placed successfully. Here are the details:</p>
                    </div>

                    <div className={`border border-neutral-200 rounded-2xl p-6 mb-8`}>
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className={`${mutedText}`}>Order ID:</span>
                                <span className="font-bold">{order._id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={`${mutedText}`}>Customer Name:</span>
                                <span className="font-bold">{order.customerName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={`${mutedText}`}>Email:</span>
                                <span className="font-bold">{order.customerEmail}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={`${mutedText}`}>Shipping Address:</span>
                                <span className="font-bold text-right">{`${order.shippingAddress}, ${order.city}, ${order.country} ${order.postalCode || ''}`}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={`${mutedText}`}>Payment Method:</span>
                                <span className="font-bold">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={`${mutedText}`}>Payment Status:</span>
                                <span className="font-bold">{(order.paymentStatus || 'unpaid').toUpperCase()}</span>
                            </div>
                        </div>
                    </div>

                    <div className={`border border-neutral-200 rounded-2xl p-6`}>
                        <h2 className="text-xl font-bold mb-4">Items Ordered</h2>
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{item.name}</p>
                                        <p className={`${mutedText} text-sm`}>Size: {item.size} - Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold">Rs.{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-neutral-200 mt-4 pt-4 flex justify-between items-center">
                            <p className="text-lg font-bold">Total</p>
                            <p className="text-lg font-bold text-emerald-500">Rs.{order.total}</p>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/" className={`px-8 py-4 bg-gradient-to-r ${primaryGradient} text-slate-950 font-semibold rounded-full hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300`}>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default OrderConfirmation;
