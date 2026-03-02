 import React from 'react';

 const PrintableReceipt = React.forwardRef((props, ref) => {
     const { order, variant = "receipt" } = props;
 
     return (
         <div ref={ref} className="p-8 font-sans">
             <div className="text-center mb-8">
                 <h1 className="text-3xl font-bold">{variant === "packing" ? "Packing Slip" : "Order Receipt"}</h1>
                 <p className="text-gray-500">UrbanWear</p>
             </div>

            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">Order Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600">Order ID:</p>
                         <p className="font-bold">{order?._id || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Order Date:</p>
                         <p className="font-bold">{order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</p>
                    </div>
                     <div>
                         <p className="text-gray-600">Payment Status:</p>
                         <p className="font-bold">{(order?.paymentStatus || "unpaid").toUpperCase()}</p>
                     </div>
                     <div>
                         <p className="text-gray-600">Payment Method:</p>
                         <p className="font-bold">{order?.paymentMethod || "N/A"}</p>
                     </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">Customer Information</h2>
                 <p><span className="font-bold">Name:</span> {order?.customerName || "N/A"}</p>
                 {variant !== "packing" && (
                     <p><span className="font-bold">Email:</span> {order?.customerEmail || "N/A"}</p>
                 )}
                 <p><span className="font-bold">Phone:</span> {order?.customerPhone || "N/A"}</p>
                 <p><span className="font-bold">Shipping Address:</span> {`${order?.shippingAddress || ""}, ${order?.city || ""}, ${order?.country || ""} ${order?.postalCode || ""}`.replace(/, $/, "")}</p>
            </div>

            <div>
                 <h2 className="text-xl font-bold mb-4 border-b pb-2">{variant === "packing" ? "Items to Pack" : "Items Ordered"}</h2>
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="py-2">Product</th>
                            <th className="py-2">Size</th>
                            <th className="py-2 text-center">Quantity</th>
                             {variant !== "packing" && <th className="py-2 text-right">Price</th>}
                        </tr>
                    </thead>
                    <tbody>
                         {(order?.items || []).map((item, index) => (
                            <tr key={index} className="border-b">
                                 <td className="py-2">{item?.name || "Item"}</td>
                                 <td className="py-2">{item?.size || "N/A"}</td>
                                 <td className="py-2 text-center">{item?.quantity || 1}</td>
                                 {variant !== "packing" && (
                                     <td className="py-2 text-right">Rs.{(item?.price || 0) * (item?.quantity || 1)}</td>
                                 )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             {variant !== "packing" && (
                 <div className="mt-8 text-right">
                     <p className="text-lg font-bold">Total: <span className="text-emerald-500">Rs.{order?.total || 0}</span></p>
                 </div>
             )}
        </div>
    );
});

export default PrintableReceipt;
