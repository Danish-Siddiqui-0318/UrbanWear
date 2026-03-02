import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import PrintableReceipt from './PrintableReceipt';
import { secondaryBorder, mutedText, primaryBorder } from "../../theme/colors";

const OrderDetailView = ({ order, onUpdateStatus, onUpdatePaymentStatus, updatingStatus }) => {
    const receiptRef = useRef();
    const printReceipt = useReactToPrint({ contentRef: receiptRef });

    if (!order) return null;

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                <div className={`rounded-xl border ${secondaryBorder} p-3`}>
                    <p className="font-semibold mb-2">Customer Info</p>
                    <p><span className={mutedText}>Name:</span> {order.customerName || "N/A"}</p>
                    <p><span className={mutedText}>Email:</span> {order.customerEmail || "N/A"}</p>
                    <p><span className={mutedText}>Address:</span> {`${order.shippingAddress || ''}, ${order.city || ''}, ${order.country || ''} ${order.postalCode || ''}`.replace(/, $/, '')}</p>
                </div>
                <div className={`rounded-xl border ${secondaryBorder} p-3`}>
                    <p className="font-semibold mb-2">Order Info</p>
                    <p><span className={mutedText}>Date:</span> {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</p>
                    <p><span className={mutedText}>Total:</span> <span className="font-semibold text-neutral-900">Rs.{order.total || 0}</span></p>
                    <p><span className={mutedText}>Payment Status:</span> <span className="font-semibold text-neutral-900">{(order.paymentStatus || 'unpaid').toUpperCase()}</span></p>
                    <div className="mt-2 flex items-center gap-2">
                        <span className={mutedText}>Status:</span>
                        <select 
                            value={(order.status || 'pending').toLowerCase()}
                            disabled={updatingStatus}
                            onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                            className={`rounded-lg border ${primaryBorder} bg-white px-2 py-1 text-[11px] outline-none focus:border-neutral-900`}
                        >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <span className={mutedText}>Payment:</span>
                        <select 
                            value={(order.paymentStatus || 'unpaid').toLowerCase()}
                            disabled={updatingStatus}
                            onChange={(e) => onUpdatePaymentStatus(order._id, e.target.value)}
                            className={`rounded-lg border ${primaryBorder} bg-white px-2 py-1 text-[11px] outline-none focus:border-neutral-900`}
                        >
                            <option value="unpaid">Unpaid</option>
                            <option value="paid">Paid</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>
                    <div className="mt-3">
                        <button
                            onClick={printReceipt}
                            className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                        >
                            Print/Download Receipt
                        </button>
                    </div>
                </div>
            </div>

            <div className={`rounded-xl border ${secondaryBorder} p-3 text-xs`}>
                <p className="font-semibold mb-2">Items</p>
                <div className="space-y-2">
                    {(order.items || []).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between border-b border-neutral-100 pb-2 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3">
                                {item.image && (
                                    <img src={item.image} alt={item.name} className="h-8 w-8 rounded object-cover" />
                                )}
                                <div>
                                    <p className="font-medium">{item.name || 'Item'}</p>
                                    <p className={mutedText}>Qty: {item.quantity || 1} • Size: {item.size || "N/A"}</p>
                                </div>
                            </div>
                            <p className="font-medium">Rs.{(item.price || 0) * (item.quantity || 1)}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute -left-full top-0">
                <PrintableReceipt ref={receiptRef} order={order} variant="receipt" />
            </div>
        </div>
    );
};

export default OrderDetailView;
