import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    pageBackground,
    mutedText,
} from "../../theme/colors";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { API_BASE_URL } from "../../config/api";

// Sub-components
import DashboardStats from "./DashboardStats";
import ProductManager from "./ProductManager";
import CategoryManager from "./CategoryManager";
import AnnouncementManager from "./AnnouncementManager";
import HeroSlidesManager from "./HeroSlidesManager";
import OrderManager from "./OrderManager";
import AnalyticsSection from "./AnalyticsSection";
import Sidebar from "./Sidebar";
import OverviewGrid from "./OverviewGrid";

function AdminDashboard() {
    const navigate = useNavigate();
    const name = localStorage.getItem("name") || "Admin";
    const token = localStorage.getItem("token");

    const [activeTab, setActiveTab] = useState("overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Products State
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [productsError, setProductsError] = useState("");
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

    // Categories State
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categoriesError, setCategoriesError] = useState("");
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryKey, setNewCategoryKey] = useState("");

    // Product Form State
    const [mode, setMode] = useState("create");
    const [editingProductId, setEditingProductId] = useState(null);
    const [nameInput, setNameInput] = useState("");
    const [descriptionInput, setDescriptionInput] = useState("");
    const [priceInput, setPriceInput] = useState("");
    const [stockInput, setStockInput] = useState("");
    const [categoryInput, setCategoryInput] = useState("hoodies");
    const [sizesInput, setSizesInput] = useState({ s: false, m: false, l: false, xl: false });
    const [discountInput, setDiscountInput] = useState("");
    const [discountTypeInput, setDiscountTypeInput] = useState("percent");
    const [onSaleInput, setOnSaleInput] = useState(false);
    const [saleEndDateInput, setSaleEndDateInput] = useState("");
    const [isFeaturedInput, setIsFeaturedInput] = useState(false);
    const [imagesInput, setImagesInput] = useState([]);
    const [creatingProduct, setCreatingProduct] = useState(false);
    const [createError, setCreateError] = useState("");
    const [createSuccess, setCreateSuccess] = useState("");

    // Orders State
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [ordersError, setOrdersError] = useState("");

    // Announcement State
    const [announcementMessage, setAnnouncementMessage] = useState("");
    const [announcementActive, setAnnouncementActive] = useState(false);
    const [savingAnnouncement, setSavingAnnouncement] = useState(false);
    const [announcementError, setAnnouncementError] = useState("");

    // Hero Slides State
    const [heroSlides, setHeroSlides] = useState([]);
    const [loadingHeroSlides, setLoadingHeroSlides] = useState(true);
    const [heroSlidesError, setHeroSlidesError] = useState("");
    const [editingSlideId, setEditingSlideId] = useState(null);
    const [slideTitle, setSlideTitle] = useState("");
    const [slideSubtitle, setSlideSubtitle] = useState("");
    const [slideImageUrl, setSlideImageUrl] = useState("");
    const [slideButtonLabel, setSlideButtonLabel] = useState("");
    const [slideButtonLink, setSlideButtonLink] = useState("");
    const [slideIsActive, setSlideIsActive] = useState(true);
    const [slideSortOrder, setSlideSortOrder] = useState("");

    // Analytics State
    const [orderStats, setOrderStats] = useState(null);
    const [productPerformance, setProductPerformance] = useState([]);
    const [statsError, setStatsError] = useState("");

    const fetchProductsData = async () => {
        try {
            setLoadingProducts(true);
            setProductsError("");
            const response = await axios.get(`${API_BASE_URL}/products/products`, {
                params: { page: 1, limit: 100, status: 'all' },
            });
            setProducts(response.data.products || []);
        } catch (error) {
            setProductsError(error.response?.data?.message || error.message || "Failed to load products");
        } finally {
            setLoadingProducts(false);
        }
    };

    const fetchCategoriesData = async () => {
        try {
            setLoadingCategories(true);
            setCategoriesError("");
            const response = await axios.get(`${API_BASE_URL}/categories`);
            setCategories(response.data.categories || []);
        } catch (error) {
            setCategoriesError(error.response?.data?.message || error.message || "Failed to load categories");
        } finally {
            setLoadingCategories(false);
        }
    };

    const fetchOrdersData = async () => {
        if (!token) {
            setLoadingOrders(false);
            setOrdersError("You are not authorized to view orders.");
            return;
        }
        try {
            setLoadingOrders(true);
            setOrdersError("");
            const response = await axios.get(`${API_BASE_URL}/orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(response.data.orders || []);
        } catch (error) {
            setOrdersError(error.response?.data?.message || error.message || "Failed to load orders");
        } finally {
            setLoadingOrders(false);
        }
    };

    const fetchAnnouncementData = async () => {
        try {
            setAnnouncementError("");
            const response = await axios.get(`${API_BASE_URL}/announcement`);
            const announcement = response.data.announcement;
            if (announcement) {
                setAnnouncementMessage(announcement.message || "");
                setAnnouncementActive(Boolean(announcement.isActive));
            } else {
                setAnnouncementMessage("");
                setAnnouncementActive(false);
            }
        } catch (error) {
            setAnnouncementError(error.response?.data?.message || error.message || "Failed to load announcement");
        }
    };

    const fetchHeroSlidesData = async () => {
        if (!token) {
            setLoadingHeroSlides(false);
            setHeroSlidesError("You are not authorized to view hero slides.");
            return;
        }
        try {
            setLoadingHeroSlides(true);
            setHeroSlidesError("");
            const response = await axios.get(`${API_BASE_URL}/hero-slides/admin`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setHeroSlides(response.data.slides || []);
        } catch (error) {
            setHeroSlidesError(error.response?.data?.message || error.message || "Failed to load hero slides");
        } finally {
            setLoadingHeroSlides(false);
        }
    };

    const fetchOrderStatsData = async () => {
        if (!token) return;
        try {
            const response = await axios.get(`${API_BASE_URL}/orders/stats/overview`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrderStats(response.data);
        } catch (error) {
            setStatsError(error.response?.data?.message || error.message || "Failed to load stats");
        }
    };

    const fetchProductPerformanceData = async () => {
        if (!token) return;
        try {
            const response = await axios.get(`${API_BASE_URL}/orders/stats/products`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProductPerformance(response.data.products || []);
        } catch (error) {
            setStatsError(error.response?.data?.message || error.message || "Failed to load performance data");
        }
    };

    useEffect(() => {
        const loadAll = async () => {
            await fetchProductsData();
            await fetchOrdersData();
            await fetchCategoriesData();
            await fetchAnnouncementData();
            await fetchHeroSlidesData();
            await fetchOrderStatsData();
            await fetchProductPerformanceData();
        };
        loadAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        navigate("/admin/login");
    };

    return (
        <div className={`min-h-screen ${pageBackground} flex flex-col lg:flex-row`}>
            <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                name={name} 
                onLogout={handleLogout}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="mx-auto max-w-6xl space-y-8">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <button 
                                    className="md:hidden inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white p-2 text-neutral-700 hover:bg-neutral-50"
                                    onClick={() => setSidebarOpen(true)}
                                    aria-label="Open menu"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                                </button>
                                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl capitalize">
                                    {activeTab === "overview" ? `Welcome back, ${name}` : activeTab}
                                </h1>
                                <p className={`text-sm ${mutedText} mt-1 hidden md:block`}>
                                    {activeTab === "overview" 
                                        ? "Here is what is happening with your store today." 
                                        : `Manage your ${activeTab} and settings.`}
                                </p>
                            </div>
                            {activeTab !== "overview" && (
                                <button 
                                    onClick={() => setActiveTab("overview")}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-all duration-300"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to Overview
                                </button>
                            )}
                        </div>

                        {activeTab === "overview" && (
                            <div className="space-y-8 animate-fade-in">
                                <DashboardStats 
                                    productsCount={products.length} 
                                    ordersCount={orderStats?.last7Days?.ordersCount || 0} 
                                    revenue={orderStats?.last7Days?.revenue || 0} 
                                />

                                <OverviewGrid 
                                    setActiveTab={setActiveTab}
                                    stats={{
                                        productsCount: products.length,
                                        ordersCount: orderStats?.last7Days?.ordersCount || 0
                                    }}
                                />

                                <AnalyticsSection 
                                    orderStats={orderStats}
                                    productPerformance={productPerformance}
                                    statsError={statsError}
                                />
                            </div>
                        )}

                        {activeTab === "products" && (
                            <div className="animate-fade-in">
                                <ProductManager 
                                    token={token}
                                    products={products}
                                    loadingProducts={loadingProducts}
                                    productsError={productsError}
                                    setProductsError={setProductsError}
                                    categories={categories}
                                    selectedCategoryFilter={selectedCategoryFilter}
                                    setSelectedCategoryFilter={setSelectedCategoryFilter}
                                    mode={mode}
                                    setMode={setMode}
                                    editingProductId={editingProductId}
                                    setEditingProductId={setEditingProductId}
                                    nameInput={nameInput}
                                    setNameInput={setNameInput}
                                    descriptionInput={descriptionInput}
                                    setDescriptionInput={setDescriptionInput}
                                    priceInput={priceInput}
                                    setPriceInput={setPriceInput}
                                    stockInput={stockInput}
                                    setStockInput={setStockInput}
                                    categoryInput={categoryInput}
                                    setCategoryInput={setCategoryInput}
                                    sizesInput={sizesInput}
                                    setSizesInput={setSizesInput}
                                    discountInput={discountInput}
                                    setDiscountInput={setDiscountInput}
                                    discountTypeInput={discountTypeInput}
                                    setDiscountTypeInput={setDiscountTypeInput}
                                    onSaleInput={onSaleInput}
                                    setOnSaleInput={setOnSaleInput}
                                    saleEndDateInput={saleEndDateInput}
                                    setSaleEndDateInput={setSaleEndDateInput}
                                    isFeaturedInput={isFeaturedInput}
                                    setIsFeaturedInput={setIsFeaturedInput}
                                    imagesInput={imagesInput}
                                    setImagesInput={setImagesInput}
                                    creatingProduct={creatingProduct}
                                    setCreatingProduct={setCreatingProduct}
                                    createError={createError}
                                    setCreateError={setCreateError}
                                    createSuccess={createSuccess}
                                    setCreateSuccess={setCreateSuccess}
                                    fetchProducts={fetchProductsData}
                                />
                            </div>
                        )}

                        {activeTab === "orders" && (
                            <div className="animate-fade-in">
                                <OrderManager 
                                    token={token}
                                    orders={orders}
                                    loadingOrders={loadingOrders}
                                    ordersError={ordersError}
                                    fetchOrders={fetchOrdersData}
                                />
                            </div>
                        )}

                        {activeTab === "categories" && (
                            <div className="animate-fade-in max-w-2xl">
                                <CategoryManager 
                                    token={token}
                                    categories={categories}
                                    loadingCategories={loadingCategories}
                                    categoriesError={categoriesError}
                                    setCategoriesError={setCategoriesError}
                                    newCategoryName={newCategoryName}
                                    setNewCategoryName={setNewCategoryName}
                                    newCategoryKey={newCategoryKey}
                                    setNewCategoryKey={setNewCategoryKey}
                                    fetchCategories={fetchCategoriesData}
                                />
                            </div>
                        )}

                        {activeTab === "marketing" && (
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 animate-fade-in">
                                <AnnouncementManager 
                                    token={token}
                                    announcementMessage={announcementMessage}
                                    setAnnouncementMessage={setAnnouncementMessage}
                                    announcementActive={announcementActive}
                                    setAnnouncementActive={setAnnouncementActive}
                                    savingAnnouncement={savingAnnouncement}
                                    setSavingAnnouncement={setSavingAnnouncement}
                                    announcementError={announcementError}
                                    setAnnouncementError={setAnnouncementError}
                                    fetchAnnouncement={fetchAnnouncementData}
                                />

                                <HeroSlidesManager 
                                    token={token}
                                    heroSlides={heroSlides}
                                    loadingHeroSlides={loadingHeroSlides}
                                    heroSlidesError={heroSlidesError}
                                    setHeroSlidesError={setHeroSlidesError}
                                    editingSlideId={editingSlideId}
                                    setEditingSlideId={setEditingSlideId}
                                    slideTitle={slideTitle}
                                    setSlideTitle={setSlideTitle}
                                    slideSubtitle={slideSubtitle}
                                    setSlideSubtitle={setSlideSubtitle}
                                    slideImageUrl={slideImageUrl}
                                    setSlideImageUrl={setSlideImageUrl}
                                    slideButtonLabel={slideButtonLabel}
                                    setSlideButtonLabel={setSlideButtonLabel}
                                    slideButtonLink={slideButtonLink}
                                    setSlideButtonLink={setSlideButtonLink}
                                    slideIsActive={slideIsActive}
                                    setSlideIsActive={setSlideIsActive}
                                    slideSortOrder={slideSortOrder}
                                    setSlideSortOrder={setSlideSortOrder}
                                    fetchHeroSlides={fetchHeroSlidesData}
                                />
                            </div>
                        )}
                    </div>
                </main>
                <div className="p-4 bg-white border-t border-neutral-100">
                    <Footer variant="admin" />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
