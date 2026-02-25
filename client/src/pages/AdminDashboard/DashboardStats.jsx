import React from 'react';
import { secondaryBorder, cardBackground, mutedText, accentText } from "../../theme/colors";

const DashboardStats = ({ productsCount, ordersCount, revenue }) => {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-4 text-left`}>
                <p className={`text-xs ${mutedText}`}>Live products</p>
                <p className={`mt-2 text-sm font-semibold ${accentText}`}>
                    {productsCount}
                </p>
            </div>
            <div className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-4 text-left`}>
                <p className={`text-xs ${mutedText}`}>Orders (Last 7 days)</p>
                <p className={`mt-2 text-sm font-semibold ${accentText}`}>{ordersCount}</p>
            </div>
            <div className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-4 text-left`}>
                <p className={`text-xs ${mutedText}`}>Revenue (Last 7 days)</p>
                <p className={`mt-2 text-sm font-semibold ${accentText}`}>Rs.{revenue.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default DashboardStats;
