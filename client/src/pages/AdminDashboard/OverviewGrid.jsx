import React from 'react';
import { 
    secondaryBorder, 
    cardBackground, 
    mutedText
} from "../../theme/colors";

const OverviewGrid = ({ setActiveTab, stats }) => {
    const cards = [
        {
            id: "products",
            title: "Products",
            description: "Inventory, pricing, and stock management.",
            icon: (
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 118 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
            ),
            stats: `${stats.productsCount} items live`
        },
        {
            id: "orders",
            title: "Orders",
            description: "Fulfillment and customer order history.",
            icon: (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                </div>
            ),
            stats: `${stats.ordersCount} new today`
        },
        {
            id: "categories",
            title: "Categories",
            description: "Store organization and grouping.",
            icon: (
                <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                </div>
            ),
            stats: "Active filters"
        },
        {
            id: "marketing",
            title: "Marketing",
            description: "Banners, announcements, and hero slides.",
            icon: (
                <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                </div>
            ),
            stats: "Homepage focus"
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <button
                        key={card.id}
                        onClick={() => setActiveTab(card.id)}
                        className={`group p-6 rounded-2xl border ${secondaryBorder} ${cardBackground} text-left transition-all duration-300 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1`}
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                {card.icon}
                                <svg className="w-5 h-5 text-neutral-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-neutral-900 mb-1">{card.title}</h3>
                                <p className={`text-xs ${mutedText} leading-relaxed mb-3`}>{card.description}</p>
                                <span className="inline-flex px-2 py-1 rounded-lg bg-neutral-50 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                                    {card.stats}
                                </span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default OverviewGrid;
