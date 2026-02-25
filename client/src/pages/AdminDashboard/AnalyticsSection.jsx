import React from 'react';
import { secondaryBorder, cardBackground, mutedText } from "../../theme/colors";

const AnalyticsSection = ({ orderStats, productPerformance, statsError }) => {
    if (statsError) {
        return (
            <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 mb-4">
                {statsError}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Best Categories */}
            <section className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-5`}>
                <h2 className="text-lg font-semibold mb-3">Best Categories</h2>
                <p className={`text-xs mb-4 ${mutedText}`}>Top selling categories by quantity and revenue.</p>
                
                {!orderStats || !orderStats.bestCategories || orderStats.bestCategories.length === 0 ? (
                    <p className="text-xs">No data available.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className={`border-b ${secondaryBorder}`}>
                                    <th className="py-2 font-medium">Category</th>
                                    <th className="py-2 font-medium text-right">Sold</th>
                                    <th className="py-2 font-medium text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderStats.bestCategories.map((cat) => (
                                    <tr key={cat._id} className={`border-b ${secondaryBorder} last:border-0`}>
                                        <td className="py-2 capitalize">{cat._id}</td>
                                        <td className="py-2 text-right">{cat.totalSold}</td>
                                        <td className="py-2 text-right font-medium">Rs.{cat.revenue.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Top Products */}
            <section className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-5`}>
                <h2 className="text-lg font-semibold mb-3">Top Products</h2>
                <p className={`text-xs mb-4 ${mutedText}`}>Products with the highest sales volume.</p>
                
                {productPerformance.length === 0 ? (
                    <p className="text-xs">No data available.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className={`border-b ${secondaryBorder}`}>
                                    <th className="py-2 font-medium">Product</th>
                                    <th className="py-2 font-medium text-right">Sold</th>
                                    <th className="py-2 font-medium text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productPerformance.slice(0, 5).map((prod) => (
                                    <tr key={prod.productId} className={`border-b ${secondaryBorder} last:border-0`}>
                                        <td className="py-2 truncate max-w-[120px]">{prod.name}</td>
                                        <td className="py-2 text-right">{prod.totalSold}</td>
                                        <td className="py-2 text-right font-medium">Rs.{prod.revenue.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

export default AnalyticsSection;
