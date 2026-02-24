import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    pageBackground,
    pageText,
    secondaryBorder,
    cardBackground,
    mutedText,
    primaryBorder,
    primaryGradient,
    accentText,
    accentBadgeBorder,
    accentBadgeBackground,
} from "../theme/colors";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../config/api";

function AdminDashboard() {
    const navigate = useNavigate();
    const name = localStorage.getItem("name") || "Admin";
    const token = localStorage.getItem("token");

    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [productsError, setProductsError] = useState("");
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categoriesError, setCategoriesError] = useState("");
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryKey, setNewCategoryKey] = useState("");

    const [mode, setMode] = useState("create");
    const [editingProductId, setEditingProductId] = useState(null);

    const [nameInput, setNameInput] = useState("");
    const [descriptionInput, setDescriptionInput] = useState("");
    const [priceInput, setPriceInput] = useState("");
    const [stockInput, setStockInput] = useState("");
    const [categoryInput, setCategoryInput] = useState("hoodies");
    const [sizesInput, setSizesInput] = useState({
        s: false,
        m: false,
        l: false,
        xl: false,
    });
    const [discountInput, setDiscountInput] = useState("");
    const [discountTypeInput, setDiscountTypeInput] = useState("percent");
    const [onSaleInput, setOnSaleInput] = useState(false);
    const [saleEndDateInput, setSaleEndDateInput] = useState("");
    const [isFeaturedInput, setIsFeaturedInput] = useState(false);
    const [imagesInput, setImagesInput] = useState([]);
    const [creatingProduct, setCreatingProduct] = useState(false);
    const [createError, setCreateError] = useState("");
    const [createSuccess, setCreateSuccess] = useState("");

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [ordersError, setOrdersError] = useState("");

    const [announcementMessage, setAnnouncementMessage] = useState("");
    const [announcementActive, setAnnouncementActive] = useState(false);
    const [savingAnnouncement, setSavingAnnouncement] = useState(false);
    const [announcementError, setAnnouncementError] = useState("");

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

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        navigate("/admin/login");
    }

    async function fetchProducts() {
        try {
            setLoadingProducts(true);
            setProductsError("");

            const response = await axios.get(`${API_BASE_URL}/products/products`, {
                params: { page: 1, limit: 20 },
            });

            setProducts(response.data.products || []);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setProductsError(error.response.data.message);
            } else {
                setProductsError(error.message || "Failed to load products");
            }
        } finally {
            setLoadingProducts(false);
        }
    }

    async function fetchOrders() {
        if (!token) {
            setLoadingOrders(false);
            setOrdersError("You are not authorized to view orders.");
            return;
        }

        try {
            setLoadingOrders(true);
            setOrdersError("");

            const response = await axios.get(`${API_BASE_URL}/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setOrders(response.data.orders || []);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setOrdersError(error.response.data.message);
            } else {
                setOrdersError(error.message || "Failed to load orders");
            }
        } finally {
            setLoadingOrders(false);
        }
    }

    async function fetchAnnouncement() {
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
            if (error.response && error.response.data && error.response.data.message) {
                setAnnouncementError(error.response.data.message);
            } else {
                setAnnouncementError(error.message || "Failed to load announcement");
            }
        }
    }

    async function fetchHeroSlides() {
        if (!token) {
            setLoadingHeroSlides(false);
            setHeroSlidesError("You are not authorized to view hero slides.");
            return;
        }

        try {
            setLoadingHeroSlides(true);
            setHeroSlidesError("");

            const response = await axios.get(`${API_BASE_URL}/hero-slides/admin`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setHeroSlides(response.data.slides || []);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setHeroSlidesError(error.response.data.message);
            } else {
                setHeroSlidesError(error.message || "Failed to load hero slides");
            }
        } finally {
            setLoadingHeroSlides(false);
        }
    }

    function startEditSlide(slide) {
        setEditingSlideId(slide._id);
        setSlideTitle(slide.title || "");
        setSlideSubtitle(slide.subtitle || "");
        setSlideImageUrl(slide.imageUrl || "");
        setSlideButtonLabel(slide.buttonLabel || "");
        setSlideButtonLink(slide.buttonLink || "");
        setSlideIsActive(slide.isActive ?? true);
        setSlideSortOrder(
            typeof slide.sortOrder === "number" && !Number.isNaN(slide.sortOrder)
                ? String(slide.sortOrder)
                : ""
        );
    }

    function resetSlideForm() {
        setEditingSlideId(null);
        setSlideTitle("");
        setSlideSubtitle("");
        setSlideImageUrl("");
        setSlideButtonLabel("");
        setSlideButtonLink("");
        setSlideIsActive(true);
        setSlideSortOrder("");
    }

    async function handleSaveSlide(event) {
        event.preventDefault();

        if (!token) {
            setHeroSlidesError("You are not authorized. Please log in again.");
            return;
        }

        try {
            setHeroSlidesError("");

            const payload = {
                title: slideTitle,
                subtitle: slideSubtitle,
                imageUrl: slideImageUrl,
                buttonLabel: slideButtonLabel,
                buttonLink: slideButtonLink,
                isActive: slideIsActive,
                sortOrder: slideSortOrder ? Number(slideSortOrder) : 0,
            };

            if (editingSlideId) {
                await axios.put(`${API_BASE_URL}/hero-slides/${editingSlideId}`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                await axios.post(`${API_BASE_URL}/hero-slides`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            await fetchHeroSlides();
            resetSlideForm();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setHeroSlidesError(error.response.data.message);
            } else {
                setHeroSlidesError(error.message || "Failed to save hero slide");
            }
        }
    }

    async function handleDeleteSlide(slideId) {
        if (!token) {
            setHeroSlidesError("You are not authorized. Please log in again.");
            return;
        }

        try {
            setHeroSlidesError("");
            await axios.delete(`${API_BASE_URL}/hero-slides/${slideId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (editingSlideId === slideId) {
                resetSlideForm();
            }
            await fetchHeroSlides();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setHeroSlidesError(error.response.data.message);
            } else {
                setHeroSlidesError(error.message || "Failed to delete hero slide");
            }
        }
    }

    async function handleSaveAnnouncement(event) {
        event.preventDefault();

        if (!token) {
            setAnnouncementError("You are not authorized. Please log in again.");
            return;
        }

        try {
            setSavingAnnouncement(true);
            setAnnouncementError("");

            await axios.put(
                `${API_BASE_URL}/announcement`,
                {
                    message: announcementMessage,
                    isActive: announcementActive,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setAnnouncementError(error.response.data.message);
            } else {
                setAnnouncementError(error.message || "Failed to save announcement");
            }
        } finally {
            setSavingAnnouncement(false);
        }
    }

    useEffect(() => {
        fetchProducts();
        fetchOrders();
        fetchCategories();
        fetchAnnouncement();
        fetchHeroSlides();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleSizesChange(sizeKey) {
        setSizesInput((prev) => ({
            ...prev,
            [sizeKey]: !prev[sizeKey],
        }));
    }

    function handleImagesChange(event) {
        const files = Array.from(event.target.files || []);
        if (files.length > 5) {
            setCreateError("You can upload a maximum of 5 images per product.");
        } else {
            setCreateError("");
        }
        setImagesInput(files.slice(0, 5));
    }

    async function fetchCategories() {
        try {
            setLoadingCategories(true);
            setCategoriesError("");

            const response = await axios.get(`${API_BASE_URL}/categories`);
            setCategories(response.data.categories || []);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setCategoriesError(error.response.data.message);
            } else {
                setCategoriesError(error.message || "Failed to load categories");
            }
        } finally {
            setLoadingCategories(false);
        }
    }

    async function handleCreateCategory(event) {
        event.preventDefault();
        if (!token) {
            setCategoriesError("You are not authorized. Please log in again.");
            return;
        }
        if (!newCategoryName || !newCategoryKey) {
            setCategoriesError("Please provide category name and key.");
            return;
        }

        try {
            setCategoriesError("");
            await axios.post(
                `${API_BASE_URL}/categories`,
                {
                    name: newCategoryName,
                    key: newCategoryKey.toLowerCase(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNewCategoryName("");
            setNewCategoryKey("");
            await fetchCategories();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setCategoriesError(error.response.data.message);
            } else {
                setCategoriesError(error.message || "Failed to create category");
            }
        }
    }

    async function handleToggleCategoryActive(categoryId, isActive) {
        if (!token) {
            setCategoriesError("You are not authorized. Please log in again.");
            return;
        }

        try {
            setCategoriesError("");
            await axios.put(
                `${API_BASE_URL}/categories/${categoryId}`,
                { isActive: !isActive },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await fetchCategories();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setCategoriesError(error.response.data.message);
            } else {
                setCategoriesError(error.message || "Failed to update category");
            }
        }
    }

    async function handleUpdateStock(productId, nextStock) {
        if (!token) {
            setProductsError("You are not authorized. Please log in again.");
            return;
        }

        const numericStock = Number(nextStock);
        if (Number.isNaN(numericStock) || numericStock < 0) {
            return;
        }

        try {
            setProductsError("");
            await axios.patch(
                `${API_BASE_URL}/products/products/${productId}/stock`,
                { stock: numericStock },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await fetchProducts();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setProductsError(error.response.data.message);
            } else {
                setProductsError(error.message || "Failed to update stock");
            }
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setCreateError("");
        setCreateSuccess("");

        if (!token) {
            setCreateError("You are not authorized. Please log in again.");
            return;
        }

        const selectedSizes = Object.keys(sizesInput).filter((key) => sizesInput[key]);

        if (imagesInput.length === 0) {
            setCreateError("Please select at least one product image.");
            return;
        }

        if (mode === "create") {
            if (imagesInput.length === 0) {
                setCreateError("Please select at least one product image.");
                return;
            }

            const formData = new FormData();
            formData.append("name", nameInput);
            formData.append("description", descriptionInput);
            formData.append("price", priceInput);
            formData.append("stock", stockInput);
            formData.append("category", categoryInput);
            formData.append("sizes", JSON.stringify(selectedSizes));
            formData.append("discount", discountInput || "0");
            formData.append("isFeatured", isFeaturedInput ? "true" : "false");
            formData.append("discountType", discountTypeInput);
            formData.append("onSale", onSaleInput ? "true" : "false");
            if (saleEndDateInput) {
                formData.append("saleEndDate", saleEndDateInput);
            }

            imagesInput.forEach((file) => {
                formData.append("images", file);
            });

            try {
                setCreatingProduct(true);

                await axios.post(`${API_BASE_URL}/products/add_product`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                setCreateSuccess("Product created successfully.");
                setNameInput("");
                setDescriptionInput("");
                setPriceInput("");
                setStockInput("");
                setCategoryInput("hoodies");
                setSizesInput({
                    s: false,
                    m: false,
                    l: false,
                    xl: false,
                });
                setDiscountInput("");
                setDiscountTypeInput("percent");
                setOnSaleInput(false);
                setSaleEndDateInput("");
                setIsFeaturedInput(false);
                setImagesInput([]);

                await fetchProducts();
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    setCreateError(error.response.data.message);
                } else {
                    setCreateError(error.message || "Failed to create product");
                }
            } finally {
                setCreatingProduct(false);
            }
            return;
        }

        if (!editingProductId) {
            setCreateError("No product selected for editing.");
            return;
        }

        const updatePayload = {
            name: nameInput,
            description: descriptionInput,
            price: Number(priceInput),
            stock: Number(stockInput),
            category: categoryInput,
            sizes: selectedSizes,
            discount: discountInput ? Number(discountInput) : 0,
            discountType: discountTypeInput,
            onSale: onSaleInput,
            saleEndDate: saleEndDateInput || null,
            isFeatured: isFeaturedInput,
        };

        try {
            setCreatingProduct(true);

            await axios.put(
                `${API_BASE_URL}/products/products/${editingProductId}`,
                updatePayload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCreateSuccess("Product updated successfully.");
            setMode("create");
            setEditingProductId(null);
            setNameInput("");
            setDescriptionInput("");
            setPriceInput("");
            setStockInput("");
            setCategoryInput("hoodies");
            setSizesInput({
                s: false,
                m: false,
                l: false,
                xl: false,
            });
            setDiscountInput("");
            setIsFeaturedInput(false);
            setImagesInput([]);

            await fetchProducts();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setCreateError(error.response.data.message);
            } else {
                setCreateError(error.message || "Failed to update product");
            }
        } finally {
            setCreatingProduct(false);
        }
    }

    function startEditProduct(product) {
        setMode("edit");
        setEditingProductId(product._id);
        setNameInput(product.name || "");
        setDescriptionInput(product.description || "");
        setPriceInput(product.price != null ? String(product.price) : "");
        setStockInput(product.stock != null ? String(product.stock) : "");
        setCategoryInput(product.category || "hoodies");

        const nextSizes = {
            s: false,
            m: false,
            l: false,
            xl: false,
        };

        if (Array.isArray(product.sizes)) {
            product.sizes.forEach((size) => {
                const key = size.toLowerCase();
                if (nextSizes[key] !== undefined) {
                    nextSizes[key] = true;
                }
            });
        }

        setSizesInput(nextSizes);
        setDiscountInput(
            product.discount != null && product.discount !== 0
                ? String(product.discount)
                : ""
        );
        setDiscountTypeInput(product.discountType || "percent");
        setOnSaleInput(Boolean(product.onSale));
        setSaleEndDateInput(
            product.saleEndDate ? product.saleEndDate.slice(0, 10) : ""
        );
        setIsFeaturedInput(Boolean(product.isFeatured));
        setImagesInput([]);
        setCreateError("");
        setCreateSuccess("");
    }

    function cancelEditProduct() {
        setMode("create");
        setEditingProductId(null);
        setNameInput("");
        setDescriptionInput("");
        setPriceInput("");
        setStockInput("");
        setCategoryInput("hoodies");
        setSizesInput({
            s: false,
            m: false,
            l: false,
            xl: false,
        });
        setDiscountInput("");
        setDiscountTypeInput("percent");
        setOnSaleInput(false);
        setSaleEndDateInput("");
        setIsFeaturedInput(false);
        setImagesInput([]);
        setCreateError("");
        setCreateSuccess("");
    }

    async function deleteProduct(productId) {
        if (!token) {
            setProductsError("You are not authorized. Please log in again.");
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/products/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (editingProductId === productId) {
                cancelEditProduct();
            }
            await fetchProducts();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setProductsError(error.response.data.message);
            } else {
                setProductsError(error.message || "Failed to delete product");
            }
        }
    }

    return (
        <div className={`min-h-screen ${pageBackground} ${pageText}`}>
            <div className="mx-auto flex h-full max-w-5xl flex-col px-4 py-4">
                <Navbar variant="admin" name={name} onLogout={handleLogout} />

                <main className="mt-6 flex flex-1 flex-col justify-between">
                    <div className="flex flex-1 flex-col gap-8">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                Admin dashboard, {name}
                            </h1>
                            <p className={`text-sm ${mutedText} sm:text-base`}>
                                Manage UrbanWear products like hoodies, t-shirts, trousers and more.
                            </p>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <div className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-4 text-left`}>
                                    <p className={`text-xs ${mutedText}`}>Live products</p>
                                    <p className={`mt-2 text-sm font-semibold ${accentText}`}>
                                        {products.length}
                                    </p>
                                </div>
                                <div className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-4 text-left`}>
                                    <p className={`text-xs ${mutedText}`}>Orders today</p>
                                    <p className={`mt-2 text-sm font-semibold ${accentText}`}>0</p>
                                </div>
                                <div className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-4 text-left`}>
                                    <p className={`text-xs ${mutedText}`}>Revenue</p>
                                    <p className={`mt-2 text-sm font-semibold ${accentText}`}>$0</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <section
                                className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-5`}
                            >
                                <h2 className="text-lg font-semibold mb-1">
                                    {mode === "create" ? "Create product" : "Edit product"}
                                </h2>
                                <p className="text-[11px] mb-2">
                                    {mode === "create"
                                        ? "Fill in the form to add a new product."
                                        : "Update the selected product. Images are not changed here."}
                                </p>
                                <p className={`text-xs mb-4 ${mutedText}`}>
                                    Add new products like hoodies, t-shirts, trousers, and future items.
                                </p>

                                {createError && (
                                    <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
                                        {createError}
                                    </div>
                                )}

                                {createSuccess && (
                                    <div className="mb-3 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                                        {createSuccess}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-xs font-medium mb-1">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                value={nameInput}
                                                onChange={(e) => setNameInput(e.target.value)}
                                                className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-0`}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">
                                                Category
                                            </label>
                                            <select
                                                value={categoryInput}
                                                onChange={(e) => setCategoryInput(e.target.value)}
                                                className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-0`}
                                            >
                                                {categories
                                                    .filter((category) => category.isActive)
                                                    .map((category) => (
                                                        <option key={category._id} value={category.key}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            value={descriptionInput}
                                            onChange={(e) => setDescriptionInput(e.target.value)}
                                            rows={3}
                                                className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-0`}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        <div>
                                            <label className="block text-xs font-medium mb-1">
                                                Price ($)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={priceInput}
                                                onChange={(e) => setPriceInput(e.target.value)}
                                                className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-0`}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">
                                                Stock
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="1"
                                                value={stockInput}
                                                onChange={(e) => setStockInput(e.target.value)}
                                                className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-0`}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">
                                                Discount
                                            </label>
                                            <div className="flex gap-2">
                                                <select
                                                    value={discountTypeInput}
                                                    onChange={(e) =>
                                                        setDiscountTypeInput(e.target.value)
                                                    }
                                                    className={`w-20 rounded-lg border ${primaryBorder} bg-white px-2 py-2 text-xs outline-none focus:border-neutral-900 focus:ring-0`}
                                                >
                                                    <option value="percent">%</option>
                                                    <option value="fixed">$</option>
                                                </select>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={discountTypeInput === "percent" ? 100 : undefined}
                                                    step="1"
                                                    value={discountInput}
                                                    onChange={(e) => setDiscountInput(e.target.value)}
                                                    className={`flex-1 rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-0`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium mb-1">
                                            Sizes
                                        </label>
                                        <div className="flex flex-wrap gap-3">
                                            {["s", "m", "l", "xl"].map((sizeKey) => (
                                                <label
                                                    key={sizeKey}
                                                    className="inline-flex items-center gap-2 text-xs"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={sizesInput[sizeKey]}
                                                        onChange={() => handleSizesChange(sizeKey)}
                                                        className={`rounded border ${primaryBorder} text-neutral-900 focus:ring-neutral-900`}
                                                    />
                                                    <span className="uppercase">{sizeKey}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="flex items-center gap-2">
                                            <input
                                                id="onSale"
                                                type="checkbox"
                                                checked={onSaleInput}
                                                onChange={(e) => setOnSaleInput(e.target.checked)}
                                                className={`rounded border ${primaryBorder} text-neutral-900 focus:ring-neutral-900`}
                                            />
                                            <label
                                                htmlFor="onSale"
                                                className="text-xs font-medium"
                                            >
                                                On sale
                                            </label>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">
                                                Sale end date
                                            </label>
                                            <input
                                                type="date"
                                                value={saleEndDateInput}
                                                onChange={(e) => setSaleEndDateInput(e.target.value)}
                                                className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-xs outline-none focus:border-neutral-900 focus:ring-0`}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col gap-2">
                                            <label className="inline-flex items-center gap-2 text-xs">
                                                <input
                                                    type="checkbox"
                                                    checked={isFeaturedInput}
                                                    onChange={(e) =>
                                                        setIsFeaturedInput(e.target.checked)
                                                    }
                                                    className={`rounded border ${primaryBorder} text-neutral-900 focus:ring-neutral-900`}
                                                />
                                                <span>Mark as featured</span>
                                            </label>
                                        </div>
                                    </div>

                                    {mode === "create" && (
                                        <div>
                                            <label className="block text-xs font-medium mb-1">
                                                Product images
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImagesChange}
                                                className="w-full text-xs text-neutral-600"
                                            />
                                            <p className={`mt-1 text-[11px] ${mutedText}`}>
                                                Upload up to 5 images. First image is the main one.
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <button
                                            type="submit"
                                            disabled={creatingProduct}
                                            className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r ${primaryGradient} px-4 py-2 text-xs font-medium text-slate-950 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100`}
                                        >
                                            {creatingProduct
                                                ? mode === "create"
                                                    ? "Creating..."
                                                    : "Saving..."
                                                : mode === "create"
                                                ? "Create product"
                                                : "Save changes"}
                                        </button>
                                        {mode === "edit" && (
                                            <button
                                                type="button"
                                                onClick={cancelEditProduct}
                                                className={`inline-flex items-center justify-center rounded-full border ${primaryBorder} px-4 py-2 text-xs font-medium text-neutral-800 transition hover:border-neutral-500 hover:bg-neutral-100`}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </section>

                            <section
                                className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-5`}
                            >
                                <h2 className="text-lg font-semibold mb-3">Homepage announcement</h2>
                                <p className={`text-xs mb-3 ${mutedText}`}>
                                    Control the marketing message bar shown at the top of the store.
                                </p>

                                {announcementError && (
                                    <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
                                        {announcementError}
                                    </div>
                                )}

                                <form onSubmit={handleSaveAnnouncement} className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium mb-1">
                                            Message
                                        </label>
                                        <textarea
                                            value={announcementMessage}
                                            onChange={(e) => setAnnouncementMessage(e.target.value)}
                                            rows={2}
                                            className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-0`}
                                            placeholder='e.g. "Free shipping over $50"'
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="inline-flex items-center gap-2 text-xs">
                                            <input
                                                type="checkbox"
                                                checked={announcementActive}
                                                onChange={(e) =>
                                                    setAnnouncementActive(e.target.checked)
                                                }
                                                className={`rounded border ${primaryBorder} text-neutral-900 focus:ring-neutral-900`}
                                            />
                                            <span>Show on storefront</span>
                                        </label>
                                        <button
                                            type="submit"
                                            disabled={savingAnnouncement}
                                            className={`inline-flex items-center justify-center rounded-full border ${primaryBorder} px-4 py-2 text-xs font-medium text-neutral-800 transition hover:border-neutral-500 hover:bg-neutral-100 disabled:opacity-60`}
                                        >
                                            {savingAnnouncement ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </form>
                            </section>

                            <section
                                className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-5`}
                            >
                                <h2 className="text-lg font-semibold mb-3">Categories</h2>
                                <p className={`text-xs mb-3 ${mutedText}`}>
                                    Manage product categories used for filtering and assignment.
                                </p>

                                {categoriesError && (
                                    <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
                                        {categoriesError}
                                    </div>
                                )}

                                <form
                                    onSubmit={handleCreateCategory}
                                    className="mb-4 flex flex-col gap-2 text-xs sm:flex-row"
                                >
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        placeholder="Category name"
                                        className={`flex-1 rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-xs outline-none focus:border-neutral-900 focus:ring-0`}
                                    />
                                    <input
                                        type="text"
                                        value={newCategoryKey}
                                        onChange={(e) => setNewCategoryKey(e.target.value)}
                                        placeholder="Key (e.g. hoodies)"
                                        className={`flex-1 rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-xs outline-none focus:border-neutral-900 focus:ring-0`}
                                    />
                                    <button
                                        type="submit"
                                        className={`rounded-full border ${primaryBorder} px-4 py-2 text-xs font-medium text-neutral-800 transition hover:border-neutral-500 hover:bg-neutral-100`}
                                    >
                                        Add
                                    </button>
                                </form>

                                {loadingCategories ? (
                                    <p className="text-xs">Loading categories...</p>
                                ) : categories.length === 0 ? (
                                    <p className="text-xs">No categories yet.</p>
                                ) : (
                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1 text-xs">
                                        {categories.map((category) => (
                                            <div
                                                key={category._id}
                                                className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-3 py-2"
                                            >
                                                <div>
                                                    <p className="font-medium text-neutral-900">
                                                        {category.name}
                                                    </p>
                                                    <p className={`text-[11px] ${mutedText}`}>
                                                        Key: {category.key}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleCategoryActive(
                                                            category._id,
                                                            category.isActive
                                                        )
                                                    }
                                                    className={`rounded-full border px-3 py-1 text-[11px] ${
                                                        category.isActive
                                                            ? "border-neutral-300 text-neutral-800 hover:border-neutral-500 hover:bg-neutral-100"
                                                            : "border-neutral-300 text-neutral-500 hover:border-neutral-500 hover:bg-neutral-100"
                                                    }`}
                                                >
                                                    {category.isActive ? "Active" : "Hidden"}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            <section
                                className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-5`}
                            >
                                <h2 className="text-lg font-semibold mb-3">Hero slides</h2>
                                <p className={`text-xs mb-3 ${mutedText}`}>
                                    Configure the slides used in the homepage hero banner.
                                </p>

                                {heroSlidesError && (
                                    <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
                                        {heroSlidesError}
                                    </div>
                                )}

                                <form onSubmit={handleSaveSlide} className="space-y-2 mb-4 text-xs">
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-[11px] font-medium mb-1">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                value={slideTitle}
                                                onChange={(e) => setSlideTitle(e.target.value)}
                                                className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-xs outline-none focus:border-neutral-900 focus:ring-0`}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-medium mb-1">
                                                Image URL
                                            </label>
                                            <input
                                                type="url"
                                                value={slideImageUrl}
                                                onChange={(e) => setSlideImageUrl(e.target.value)}
                                                className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-xs outline-none focus:border-neutral-900 focus:ring-0`}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-medium mb-1">
                                            Subtitle
                                        </label>
                                        <textarea
                                            value={slideSubtitle}
                                            onChange={(e) => setSlideSubtitle(e.target.value)}
                                            rows={2}
                                            className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-xs outline-none focus:border-neutral-900 focus:ring-0`}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                        <div>
                                            <label className="block text-[11px] font-medium mb-1">
                                                Button label
                                            </label>
                                            <input
                                                type="text"
                                                value={slideButtonLabel}
                                                onChange={(e) => setSlideButtonLabel(e.target.value)}
                                                className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-xs outline-none focus:border-neutral-900 focus:ring-0`}
                                                placeholder="e.g. Shop now"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-medium mb-1">
                                                Button link
                                            </label>
                                            <input
                                                type="text"
                                                value={slideButtonLink}
                                                onChange={(e) => setSlideButtonLink(e.target.value)}
                                                className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-xs outline-none focus:border-neutral-900 focus:ring-0`}
                                                placeholder="/shop"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-medium mb-1">
                                                Sort order
                                            </label>
                                            <input
                                                type="number"
                                                value={slideSortOrder}
                                                onChange={(e) => setSlideSortOrder(e.target.value)}
                                                className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-xs outline-none focus:border-neutral-900 focus:ring-0`}
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="inline-flex items-center gap-2 text-xs">
                                            <input
                                                type="checkbox"
                                                checked={slideIsActive}
                                                onChange={(e) =>
                                                    setSlideIsActive(e.target.checked)
                                                }
                                                className={`rounded border ${primaryBorder} text-neutral-900 focus:ring-neutral-900`}
                                            />
                                            <span>Active</span>
                                        </label>
                                        <div className="flex items-center gap-2">
                                            {editingSlideId && (
                                                <button
                                                    type="button"
                                                    onClick={resetSlideForm}
                                                    className={`rounded-full border ${primaryBorder} px-3 py-1 text-[11px] text-neutral-800 transition hover:border-neutral-500 hover:bg-neutral-100`}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            <button
                                                type="submit"
                                                className={`rounded-full bg-gradient-to-r ${primaryGradient} px-4 py-2 text-[11px] font-medium text-slate-950 transition hover:shadow-md`}
                                            >
                                                {editingSlideId ? "Save slide" : "Add slide"}
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                {loadingHeroSlides ? (
                                    <p className="text-xs">Loading hero slides...</p>
                                ) : heroSlides.length === 0 ? (
                                    <p className="text-xs">No hero slides yet.</p>
                                ) : (
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
                                        {heroSlides.map((slide) => (
                                            <div
                                                key={slide._id}
                                                className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-3 py-2"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-md overflow-hidden bg-neutral-100">
                                                        {slide.imageUrl && (
                                                            <img
                                                                src={slide.imageUrl}
                                                                alt={slide.title}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-neutral-900">
                                                            {slide.title}
                                                        </p>
                                                        <p className={`text-[11px] ${mutedText}`}>
                                                            Order {slide.sortOrder ?? 0} •{" "}
                                                            {slide.isActive ? "Active" : "Hidden"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => startEditSlide(slide)}
                                                        className="rounded-full border border-neutral-300 px-3 py-1 text-[11px] text-neutral-800 hover:border-neutral-500 hover:bg-neutral-100"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteSlide(slide._id)}
                                                        className="rounded-full border border-red-200 px-3 py-1 text-[11px] text-red-600 hover:border-red-400 hover:bg-red-50"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            <section
                                className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-5`}
                            >
                                <h2 className="text-lg font-semibold mb-3">Products</h2>
                                <p className={`text-xs mb-4 ${mutedText}`}>
                                    Recent products in your store.
                                </p>

                                <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px]">
                                    <span className={`${mutedText}`}>Filter by category:</span>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCategoryFilter("all")}
                                        className={`rounded-full border px-2 py-1 ${
                                            selectedCategoryFilter === "all"
                                                ? `${accentBadgeBorder} ${accentBadgeBackground} text-neutral-900`
                                                : `${primaryBorder} text-neutral-700`
                                        } text-[11px] transition`}
                                    >
                                        All
                                    </button>
                                    {categories
                                        .filter((category) => category.isActive)
                                        .map((category) => (
                                            <button
                                                key={category._id}
                                                type="button"
                                                onClick={() => setSelectedCategoryFilter(category.key)}
                                                className={`rounded-full border px-2 py-1 ${
                                                    selectedCategoryFilter === category.key
                                                        ? `${accentBadgeBorder} ${accentBadgeBackground} text-neutral-900`
                                                        : `${primaryBorder} text-neutral-700`
                                                } text-[11px] transition`}
                                            >
                                                {category.name}
                                            </button>
                                        ))}
                                </div>

                                {loadingProducts ? (
                                    <p className="text-xs">Loading products...</p>
                                ) : productsError ? (
                                    <p className="text-xs text-red-600">{productsError}</p>
                                ) : products.length === 0 ? (
                                    <p className="text-xs">No products yet. Create your first one.</p>
                                ) : (
                                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                                        {products
                                            .filter((product) =>
                                                selectedCategoryFilter === "all"
                                                    ? true
                                                    : product.category === selectedCategoryFilter
                                            )
                                            .map((product) => (
                                                <div
                                                    key={product._id}
                                                    className={`flex items-center justify-between gap-3 rounded-xl border ${secondaryBorder} ${cardBackground} px-3 py-2 text-xs`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {product.images && product.images.length > 0 && (
                                                            <div className="flex flex-col gap-1">
                                                                <img
                                                                    src={product.images[0].url}
                                                                    alt={
                                                                        product.images[0].altText ||
                                                                        product.name
                                                                    }
                                                                    className="h-10 w-10 rounded-lg object-cover"
                                                                />
                                                                {product.images.length > 1 && (
                                                                    <div className="flex -space-x-1.5">
                                                                        {product.images.slice(1, 4).map((image) => (
                                                                            <img
                                                                                key={image.url}
                                                                                src={image.url}
                                                                                alt={image.altText || product.name}
                                                                                className="h-5 w-5 rounded-md object-cover border border-neutral-200"
                                                                            />
                                                                        ))}
                                                                        {product.images.length > 4 && (
                                                                            <div className="flex h-5 w-5 items-center justify-center rounded-md border border-dashed border-neutral-300 bg-white text-[9px] text-neutral-500">
                                                                                +{product.images.length - 4}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium text-neutral-900">
                                                                {product.name}
                                                            </p>
                                                            <p className={`text-[11px] ${mutedText}`}>
                                                                {product.category} • Stock {product.stock}
                                                            </p>
                                                        </div>
                                                    </div>
                                                <div className="text-right">
                                                    <p className={`text-sm font-semibold ${accentText}`}>
                                                        ${product.price}
                                                    </p>
                                                    {product.isFeatured && (
                                                        <p className="text-[11px] text-emerald-600">
                                                            Featured
                                                        </p>
                                                    )}
                                                    <div className="mt-2 flex items-center justify-end gap-2">
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleUpdateStock(
                                                                        product._id,
                                                                        (product.stock || 0) - 1
                                                                    )
                                                                }
                                                                className="h-6 w-6 rounded-full border border-neutral-300 text-[11px] text-neutral-800 hover:border-neutral-500 hover:bg-neutral-100"
                                                            >
                                                                -
                                                            </button>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={product.stock}
                                                                onChange={(e) =>
                                                                    handleUpdateStock(
                                                                        product._id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="w-14 rounded-full border border-neutral-300 px-2 py-[3px] text-[11px] text-right"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleUpdateStock(
                                                                        product._id,
                                                                        (product.stock || 0) + 1
                                                                    )
                                                                }
                                                                className="h-6 w-6 rounded-full border border-neutral-300 text-[11px] text-neutral-800 hover:border-neutral-500 hover:bg-neutral-100"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => startEditProduct(product)}
                                                            className="rounded-full border border-neutral-300 px-2 py-1 text-[11px] text-neutral-800 hover:border-neutral-500 hover:bg-neutral-100"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteProduct(product._id)}
                                                            className="rounded-full border border-red-200 px-2 py-1 text-[11px] text-red-600 hover:border-red-400 hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            ))}
                                    </div>
                                )}
                            </section>
                        </div>

                        <section
                            className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-5`}
                        >
                            <h2 className="text-lg font-semibold mb-3">Orders</h2>
                            <p className={`text-xs mb-4 ${mutedText}`}>
                                Simple overview of recent orders once the orders API is available.
                            </p>

                            {loadingOrders ? (
                                <p className="text-xs">Loading orders...</p>
                            ) : ordersError ? (
                                <p className="text-xs text-red-600">{ordersError}</p>
                            ) : orders.length === 0 ? (
                                <p className="text-xs">No orders yet.</p>
                            ) : (
                                <div className="space-y-2 max-h-64 overflow-y-auto pr-1 text-xs">
                                    {orders.map((order) => (
                                        <div
                                            key={order._id}
                                            className={`flex items-center justify-between rounded-xl border ${secondaryBorder} ${cardBackground} px-3 py-2`}
                                        >
                                            <div>
                                                <p className="font-medium text-neutral-900">
                                                    {order.customerName || order.customerEmail || "Customer"}
                                                </p>
                                                <p className={`text-[11px] ${mutedText}`}>
                                                    {order.items && order.items.length} items •{" "}
                                                    {order.status || "pending"}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-sm font-semibold ${accentText}`}>
                                                    ${order.total}
                                                </p>
                                                {order.createdAt && (
                                                    <p className={`text-[11px] ${mutedText}`}>
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                    <div className="mt-4">
                        <Footer variant="admin" />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;
