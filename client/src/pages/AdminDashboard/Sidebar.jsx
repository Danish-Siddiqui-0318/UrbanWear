import React from 'react';
import { 
    secondaryBorder, 
    mutedText
} from "../../theme/colors";

const Sidebar = ({ activeTab, setActiveTab, name, onLogout, isOpen = false, onClose = () => {} }) => {
    const menuItems = [
        { id: "overview", label: "Dashboard", icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        )},
        { id: "products", label: "Products", icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 118 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
        )},
        { id: "orders", label: "Orders", icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        )},
        { id: "categories", label: "Categories", icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
        )},
        { id: "marketing", label: "Marketing", icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
        )},
    ];

    return (
        <>
        {/* Desktop sidebar */}
        <aside className={`hidden lg:flex w-64 border-r ${secondaryBorder} flex-col min-h-screen bg-white shadow-sm`}>
            <div className="p-6 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white shadow-lg shadow-emerald-500/20">
                        UW
                    </div>
                    <div>
                        <p className="text-sm font-bold tracking-tight text-neutral-900">UrbanWear Admin</p>
                        <p className={`text-[10px] ${mutedText} uppercase tracking-wider font-semibold`}>Dashboard</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                            activeTab === item.id 
                                ? "bg-emerald-50 text-emerald-700 shadow-sm" 
                                : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                        }`}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-neutral-100">
                <div className="bg-neutral-50 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                            {name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-neutral-900 truncate">{name}</p>
                            <p className={`text-[10px] ${mutedText} truncate`}>Store Manager</p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-xl text-[11px] font-bold text-red-600 hover:bg-red-50 hover:border-red-100 transition-all duration-300"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </div>
        </aside>

        {/* Mobile overlay sidebar */}
        {isOpen && (
            <div className="lg:hidden fixed inset-0 z-50">
                <div className="absolute inset-0 bg-black/40" onClick={onClose} />
                <aside className={`relative h-full w-72 max-w-[85%] bg-white border-r ${secondaryBorder} shadow-2xl`}>
                    <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white">
                                UW
                            </div>
                            <p className="text-sm font-bold tracking-tight text-neutral-900">Admin</p>
                        </div>
                        <button onClick={onClose} aria-label="Close sidebar" className="p-2 text-neutral-500 hover:text-neutral-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <nav className="p-3 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); onClose(); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                                    activeTab === item.id 
                                        ? "bg-emerald-50 text-emerald-700 shadow-sm" 
                                        : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                                }`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </nav>
                    <div className="p-3 border-t border-neutral-100">
                        <button
                            onClick={() => { onLogout(); onClose(); }}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-xl text-[11px] font-bold text-red-600 hover:bg-red-50 hover:border-red-100 transition-all duration-300"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </aside>
            </div>
        )}
        </>
    );
};

export default Sidebar;
