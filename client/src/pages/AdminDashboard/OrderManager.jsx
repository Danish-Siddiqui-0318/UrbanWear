import React, { useState } from 'react';
import axios from 'axios';
import { secondaryBorder, cardBackground, mutedText, accentText, primaryBorder } from "../../theme/colors";
import { API_BASE_URL } from "../../config/api";

const OrderManager = ({ token, orders, loadingOrders, ordersError, fetchOrders }) => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const handleUpdateStatus = async (orderId, newStatus) => {
        if (!token) return;
        try {
            setUpdatingStatus(true);
            await axios.put(
                `${API_BASE_URL}/orders/${orderId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchOrders();
            if (selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            console.error("Failed to update order status", error);
            alert("Failed to update status");
        } finally {
            setUpdatingStatus(false);
        }
    };

    return (
        <section className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-5`}>
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Orders</h2>
                {selectedOrder && (
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="text-[11px] text-neutral-600 hover:text-neutral-900"
                    >
                        Back to list
                    </button>
                )}
            </div>
            
            <p className={`text-xs mb-4 ${mutedText}`}>
                {selectedOrder ? `Details for Order #${selectedOrder._id}` : "Manage and fulfill customer orders."}
            </p>

            {loadingOrders ? (
                <p className="text-xs">Loading orders...</p>
            ) : ordersError ? (
                <p className="text-xs text-red-600">{ordersError}</p>
            ) : orders.length === 0 ? (
                <p className="text-xs">No orders yet.</p>
            ) : selectedOrder ? (
                <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                        <div className={`rounded-xl border ${secondaryBorder} p-3`}>
                            <p className="font-semibold mb-2">Customer Info</p>
                            <p><span className={mutedText}>Name:</span> {selectedOrder.customerName || "N/A"}</p>
                            <p><span className={mutedText}>Email:</span> {selectedOrder.customerEmail || "N/A"}</p>
                            <p><span className={mutedText}>Address:</span> {selectedOrder.shippingAddress || "N/A"}</p>
                        </div>
                        <div className={`rounded-xl border ${secondaryBorder} p-3`}>
                            <p className="font-semibold mb-2">Order Info</p>
                            <p><span className={mutedText}>Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                            <p><span className={mutedText}>Total:</span> <span className="font-semibold text-neutral-900">Rs.{selectedOrder.total}</span></p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className={mutedText}>Status:</span>
                                <select 
                                    value={selectedOrder.status}
                                    disabled={updatingStatus}
                                    onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                                    className={`rounded-lg border ${primaryBorder} bg-white px-2 py-1 text-[11px] outline-none focus:border-neutral-900`}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-xl border ${secondaryBorder} p-3 text-xs`}>
                        <p className="font-semibold mb-2">Items</p>
                        <div className="space-y-2">
                            {selectedOrder.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between border-b border-neutral-100 pb-2 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        {item.image && (
                                            <img src={item.image} alt={item.name} className="h-8 w-8 rounded object-cover" />
                                        )}
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className={mutedText}>Qty: {item.quantity} • Size: {item.size || "N/A"}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium">Rs.{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1 text-xs">
                    {orders.map((order) => (
                        <div key={order._id} className={`flex items-center justify-between rounded-xl border ${secondaryBorder} ${cardBackground} px-3 py-2 hover:border-neutral-400 transition-colors`}>
                            <div className="flex items-center gap-4">
                                <div>
                                    <p className="font-medium text-neutral-900">{order.customerName || order.customerEmail || "Customer"}</p>
                                    <p className={`text-[11px] ${mutedText}`}>
                                        {order.items && order.items.length} items • 
                                        <span className={`ml-1 font-medium ${
                                            order.status === 'delivered' ? 'text-emerald-600' : 
                                            order.status === 'cancelled' ? 'text-red-600' : 
                                            order.status === 'shipped' ? 'text-blue-600' : 
                                            'text-amber-600'
                                        }`}>
                                            {order.status || "pending"}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-right">
                                <div>
                                    <p className={`text-sm font-semibold ${accentText}`}>Rs.{order.total}</p>
                                    {order.createdAt && <p className={`text-[11px] ${mutedText}`}>{new Date(order.createdAt).toLocaleDateString()}</p>}
                                </div>
                                <button 
                                    onClick={() => setSelectedOrder(order)}
                                    className={`rounded-full border ${primaryBorder} px-3 py-1 text-[11px] font-medium text-neutral-800 transition hover:border-neutral-500 hover:bg-neutral-100`}
                                >
                                    Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default OrderManager;
