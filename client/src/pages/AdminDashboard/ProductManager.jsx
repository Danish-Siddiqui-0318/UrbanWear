import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { secondaryBorder, cardBackground, mutedText, primaryBorder, primaryGradient, accentText, accentBadgeBorder, accentBadgeBackground } from "../../theme/colors";
import { API_BASE_URL } from "../../config/api";

const ProductManager = ({
    token,
    products,
    loadingProducts,
    productsError,
    setProductsError,
    categories,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    mode,
    setMode,
    editingProductId,
    setEditingProductId,
    nameInput,
    setNameInput,
    descriptionInput,
    setDescriptionInput,
    priceInput,
    setPriceInput,
    stockInput,
    setStockInput,
    categoryInput,
    setCategoryInput,
    sizesInput,
    setSizesInput,
    discountInput,
    setDiscountInput,
    discountTypeInput,
    setDiscountTypeInput,
    onSaleInput,
    setOnSaleInput,
    saleEndDateInput,
    setSaleEndDateInput,
    isFeaturedInput,
    setIsFeaturedInput,
    imagesInput,
    setImagesInput,
    creatingProduct,
    setCreatingProduct,
    createError,
    setCreateError,
    createSuccess,
    setCreateSuccess,
    fetchProducts
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [existingImages, setExistingImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleSizesChange = (sizeKey) => {
        setSizesInput((prev) => ({ ...prev, [sizeKey]: !prev[sizeKey] }));
    };

    const handleImagesChange = (event) => {
        const files = Array.from(event.target.files || []);
        
        // Check if total images (existing + current selection + new selection) exceeds 5
        if (files.length + imagesInput.length + existingImages.length > 5) {
            setCreateError("You can have a maximum of 5 images per product.");
            return;
        }
        
        setCreateError("");
        
        // Append new files to imagesInput
        const newImagesInput = [...imagesInput, ...files];
        setImagesInput(newImagesInput);

        // Create previews for the new images
        const newPreviews = files.map(file => ({
            url: URL.createObjectURL(file),
            isNew: true,
            file: file // Store the file reference to remove it later if needed
        }));
        
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeNewImage = (index) => {
        const previewToRemove = imagePreviews[index];
        
        // Remove from previews
        const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
        setImagePreviews(updatedPreviews);
        
        // Remove from imagesInput
        // We need to find the file in imagesInput that matches the file in previewToRemove
        const updatedImagesInput = imagesInput.filter(file => file !== previewToRemove.file);
        setImagesInput(updatedImagesInput);
        
        // Revoke the URL to avoid memory leaks
        URL.revokeObjectURL(previewToRemove.url);
    };

    const handleUpdateStock = async (productId, nextStock) => {
        if (!token) {
            setProductsError("You are not authorized. Please log in again.");
            return;
        }
        const numericStock = Number(nextStock);
        if (Number.isNaN(numericStock) || numericStock < 0) return;
        try {
            setProductsError("");
            await axios.patch(`${API_BASE_URL}/products/products/${productId}/stock`, { stock: numericStock }, { headers: { Authorization: `Bearer ${token}` } });
            await fetchProducts();
        } catch (error) {
            setProductsError(error.response?.data?.message || error.message || "Failed to update stock");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setCreateError("");
        setCreateSuccess("");
        
        if (!token) {
            setCreateError("You are not authorized. Please log in again.");
            return;
        }

        const selectedSizes = Object.keys(sizesInput).filter((key) => sizesInput[key]);
        
        const formData = new FormData();
        formData.append("name", nameInput);
        formData.append("description", descriptionInput);
        formData.append("price", priceInput);
        formData.append("stock", stockInput);
        formData.append("category", categoryInput);
        formData.append("sizes", JSON.stringify(selectedSizes));
        formData.append("discount", discountInput || "0");
        formData.append("discountType", discountTypeInput);
        formData.append("onSale", onSaleInput ? "true" : "false");
        if (saleEndDateInput) formData.append("saleEndDate", saleEndDateInput);
        
        formData.append("isFeatured", isFeaturedInput ? "true" : "false");
        
        // CRITICAL: Ensure we are sending all files in the imagesInput array
        if (imagesInput && imagesInput.length > 0) {
            imagesInput.forEach((file) => {
                formData.append("images", file);
            });
        }

        if (mode === "create") {
            if (imagesInput.length === 0) {
                setCreateError("Please select at least one product image.");
                return;
            }
            try {
                setCreatingProduct(true);
                await axios.post(`${API_BASE_URL}/products/add_product`, formData, { 
                    headers: { 
                        Authorization: `Bearer ${token}`
                        // Axios will set multipart/form-data with boundary automatically
                    } 
                });
                setCreateSuccess("Product created successfully.");
                resetForm();
                await fetchProducts();
            } catch (error) {
                setCreateError(error.response?.data?.message || error.message || "Failed to create product");
            } finally {
                setCreatingProduct(false);
            }
        } else {
            if (!editingProductId) {
                setCreateError("No product selected for editing.");
                return;
            }
            
            // CRITICAL: Send existing images that were not removed
            formData.append("existingImages", JSON.stringify(existingImages));

            try {
                setCreatingProduct(true);
                await axios.put(`${API_BASE_URL}/products/products/${editingProductId}`, formData, { 
                    headers: { 
                        Authorization: `Bearer ${token}`
                        // Axios will set multipart/form-data with boundary automatically
                    } 
                });
                setCreateSuccess("Product updated successfully.");
                resetForm();
                await fetchProducts();
            } catch (error) {
                setCreateError(error.response?.data?.message || error.message || "Failed to update product");
            } finally {
                setCreatingProduct(false);
            }
        }
    };

    // Ensure a sane default category on create when categories load
    useEffect(() => {
        if (mode === "create" && Array.isArray(categories) && categories.length > 0) {
            const firstActive = categories.find((c) => c.isActive) || categories[0];
            if (firstActive && categoryInput !== firstActive.key) {
                setCategoryInput(firstActive.key);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories, mode]);

    const startEditProduct = (product) => {
        setMode("edit");
        setEditingProductId(product._id);
        setNameInput(product.name || "");
        setDescriptionInput(product.description || "");
        setPriceInput(product.price != null ? String(product.price) : "");
        setStockInput(product.stock != null ? String(product.stock) : "");
        setCategoryInput(product.category || "hoodies");
        const nextSizes = { s: false, m: false, l: false, xl: false };
        if (Array.isArray(product.sizes)) {
            product.sizes.forEach((size) => {
                const key = size.toLowerCase();
                if (nextSizes[key] !== undefined) nextSizes[key] = true;
            });
        }
        setSizesInput(nextSizes);
        setDiscountInput(product.discount != null && product.discount !== 0 ? String(product.discount) : "");
        setDiscountTypeInput(product.discountType || "percent");
        setOnSaleInput(Boolean(product.onSale));
        setSaleEndDateInput(product.saleEndDate ? product.saleEndDate.slice(0, 10) : "");
        setIsFeaturedInput(Boolean(product.isFeatured));
        setImagesInput([]);
        setExistingImages([...(product.images || [])]); // Ensure we create a new array copy
        setImagePreviews([]);
        setCreateError("");
        setCreateSuccess("");
    };

    const resetForm = () => {
        setMode("create");
        setEditingProductId(null);
        setNameInput("");
        setDescriptionInput("");
        setPriceInput("");
        setStockInput("");
        // Default to first active category if available
        if (Array.isArray(categories) && categories.length > 0) {
            const firstActive = categories.find((c) => c.isActive) || categories[0];
            setCategoryInput(firstActive?.key || "hoodies");
        } else {
            setCategoryInput("hoodies");
        }
        setSizesInput({ s: false, m: false, l: false, xl: false });
        setDiscountInput("");
        setDiscountTypeInput("percent");
        setOnSaleInput(false);
        setSaleEndDateInput("");
        setIsFeaturedInput(false);
        setImagesInput([]);
        setExistingImages([]);
        setImagePreviews([]);
        setCreateError("");
        setCreateSuccess("");
    };

    const deleteProduct = async (productId) => {
        if (!token) {
            setProductsError("You are not authorized. Please log in again.");
            return;
        }
        try {
            await axios.delete(`${API_BASE_URL}/products/products/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
            if (editingProductId === productId) resetForm();
            await fetchProducts();
        } catch (error) {
            setProductsError(error.response?.data?.message || error.message || "Failed to delete product");
        }
    };

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <section className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-5`}>
                <h2 className="text-lg font-semibold mb-1">{mode === "create" ? "Create product" : "Edit product"}</h2>
                <p className="text-[11px] mb-2">{mode === "create" ? "Fill in the form to add a new product." : "Update the selected product and manage its images."}</p>
                <p className={`text-xs mb-4 ${mutedText}`}>Add new products like hoodies, t-shirts, trousers, and future items.</p>

                {(createError || createSuccess) && (
                    <div className={`mb-3 rounded-md px-3 py-2 text-xs ${createError ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                        {createError || createSuccess}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-medium mb-1">Name</label>
                            <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-0`} required />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Category</label>
                            <select value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)} className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-0`}>
                                {categories.filter((cat) => cat.isActive).map((cat) => <option key={cat._id} value={cat.key}>{cat.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">Description</label>
                        <textarea value={descriptionInput} onChange={(e) => setDescriptionInput(e.target.value)} rows={3} className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-0`} />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div>
                            <label className="block text-xs font-medium mb-1">Price (Rs.)</label>
                            <input type="number" min="0" step="0.01" value={priceInput} onChange={(e) => setPriceInput(e.target.value)} className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-0`} required />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Stock</label>
                            <input type="number" min="0" step="1" value={stockInput} onChange={(e) => setStockInput(e.target.value)} className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-0`} required />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Discount</label>
                            <div className="flex gap-2">
                                <select value={discountTypeInput} onChange={(e) => setDiscountTypeInput(e.target.value)} className={`w-20 rounded-lg border ${primaryBorder} bg-white px-2 py-2 text-xs outline-none focus:border-neutral-900 focus:ring-0`}>
                                    <option value="percent">%</option>
                                    <option value="fixed">Rs.</option>
                                </select>
                                <input type="number" min="0" max={discountTypeInput === "percent" ? 100 : undefined} step="1" value={discountInput} onChange={(e) => setDiscountInput(e.target.value)} className={`flex-1 rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-0`} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">Sizes</label>
                        <div className="flex flex-wrap gap-3">
                            {["s", "m", "l", "xl"].map((sizeKey) => (
                                <label key={sizeKey} className="inline-flex items-center gap-2 text-xs">
                                    <input type="checkbox" checked={sizesInput[sizeKey]} onChange={() => handleSizesChange(sizeKey)} className={`rounded border ${primaryBorder} text-neutral-900 focus:ring-neutral-900`} />
                                    <span className="uppercase">{sizeKey}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="flex items-center gap-2">
                            <input id="onSale" type="checkbox" checked={onSaleInput} onChange={(e) => setOnSaleInput(e.target.checked)} className={`rounded border ${primaryBorder} text-neutral-900 focus:ring-neutral-900`} />
                            <label htmlFor="onSale" className="text-xs font-medium">On sale</label>
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Sale end date</label>
                            <input type="date" value={saleEndDateInput} onChange={(e) => setSaleEndDateInput(e.target.value)} className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-xs outline-none focus:border-neutral-900 focus:ring-0`} />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="inline-flex items-center gap-2 text-xs">
                            <input type="checkbox" checked={isFeaturedInput} onChange={(e) => setIsFeaturedInput(e.target.checked)} className={`rounded border ${primaryBorder} text-neutral-900 focus:ring-neutral-900`} />
                            <span>Mark as featured</span>
                        </label>
                    </div>

                    {/* Existing Images (Edit Mode Only) */}
                    {mode === "edit" && existingImages && existingImages.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold uppercase tracking-widest text-emerald-500">Saved product images</label>
                                <span className="text-[10px] font-medium text-neutral-400">{existingImages.length} saved</span>
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                                {existingImages.map((img, idx) => (
                                    <div key={img.url || idx} className="relative group aspect-[4/5] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50 shadow-sm transition-all duration-300 hover:border-emerald-500/50">
                                        <img src={img.url} alt={`Saved ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <button 
                                            type="button"
                                            onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== idx))}
                                            className="absolute inset-0 bg-red-500/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]"
                                            title="Remove this image from product"
                                        >
                                            <div className="bg-white p-1.5 rounded-full shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </div>
                                        </button>
                                        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-md text-white text-[8px] font-bold rounded uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                            Saved
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="h-px bg-neutral-100 my-4"></div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium mb-1">
                            {mode === "create" ? "Product images" : "Add more images"}
                        </label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            onChange={handleImagesChange} 
                            className="w-full text-xs text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" 
                        />
                        
                        {/* New Image Previews */}
                        {imagePreviews.length > 0 && (
                            <div className="mt-3">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-2">New images to upload</label>
                                <div className="flex flex-wrap gap-2">
                                    {imagePreviews.map((preview, idx) => (
                                        <div key={idx} className="relative group w-16 h-20 rounded-lg overflow-hidden border border-emerald-200">
                                            <img src={preview.url} alt="Preview" className="w-full h-full object-cover" />
                                            <button 
                                                type="button"
                                                onClick={() => removeNewImage(idx)}
                                                className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Cancel upload"
                                            >
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[8px] px-1 font-bold rounded-bl-md shadow-sm">NEW</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <p className={`mt-2 text-[10px] ${mutedText} italic`}>
                            {mode === "create" 
                                ? "Upload up to 5 images. Drag and drop supported in future updates." 
                                : `You can add ${5 - existingImages.length - imagesInput.length} more images.`}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button type="submit" disabled={creatingProduct} className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r ${primaryGradient} px-4 py-2 text-xs font-medium text-slate-950 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100`}>
                            {creatingProduct ? (mode === "create" ? "Creating..." : "Saving...") : (mode === "create" ? "Create product" : "Save changes")}
                        </button>
                        {mode === "edit" && <button type="button" onClick={resetForm} className={`inline-flex items-center justify-center rounded-full border ${primaryBorder} px-4 py-2 text-xs font-medium text-neutral-800 transition hover:border-neutral-500 hover:bg-neutral-100`}>Cancel</button>}
                    </div>
                </form>
            </section>

            <section className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-5`}>
                <h2 className="text-lg font-semibold mb-3">Products</h2>
                <p className={`text-xs mb-4 ${mutedText}`}>Recent products in your store.</p>
                
                <div className="mb-4">
                    <input 
                        type="text" 
                        placeholder="Search products by name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-xs outline-none focus:border-neutral-900 focus:ring-0`}
                    />
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className={`${mutedText}`}>Filter by category:</span>
                    <button 
                        type="button" 
                        onClick={() => setSelectedCategoryFilter("all")} 
                        className={`rounded-full border px-3 py-1 ${selectedCategoryFilter === "all" ? `${accentBadgeBorder} ${accentBadgeBackground} text-neutral-900` : `${primaryBorder} text-neutral-700`} text-[11px] transition`}
                    >
                        All ({products.length})
                    </button>
                    {categories.map(cat => {
                        const count = products.filter(p => String(p.category || "").toLowerCase() === String(cat.key).toLowerCase()).length;
                        return (
                            <button 
                                key={cat._id} 
                                type="button" 
                                onClick={() => setSelectedCategoryFilter(cat.key)} 
                                className={`rounded-full border px-3 py-1 ${selectedCategoryFilter === cat.key ? `${accentBadgeBorder} ${accentBadgeBackground} text-neutral-900` : `${primaryBorder} text-neutral-700`} text-[11px] transition`}
                            >
                                {cat.name} ({count})
                            </button>
                        );
                    })}
                </div>

                {loadingProducts ? <p className="text-xs">Loading products...</p> : productsError ? <p className="text-xs text-red-600">{productsError}</p> : products.length === 0 ? <p className="text-xs">No products yet.</p> : (
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                        {products
                            .filter(p => {
                                const matchesCategory = selectedCategoryFilter === "all" ? true : String(p.category || "").toLowerCase() === String(selectedCategoryFilter).toLowerCase();
                                const matchesSearch = (p.name || "").toLowerCase().includes(searchQuery.toLowerCase());
                                return matchesCategory && matchesSearch;
                            })
                            .map(p => (
                            <div key={p._id} className={`flex items-center justify-between gap-3 rounded-xl border ${secondaryBorder} ${cardBackground} px-3 py-2 text-xs`}>
                                <div className="flex items-center gap-3">
                                    {p.images && p.images.length > 0 && (
                                        <div className="flex flex-col gap-1">
                                            <img src={p.images[0].url} alt={p.images[0].altText || p.name} className="h-10 w-10 rounded-lg object-cover" />
                                            {p.images.length > 1 && (
                                                <div className="flex -space-x-1.5">
                                                    {p.images.slice(1, 4).map(img => <img key={img.url} src={img.url} alt={img.altText || p.name} className="h-5 w-5 rounded-md object-cover border border-neutral-200" />)}
                                                    {p.images.length > 4 && <div className="flex h-5 w-5 items-center justify-center rounded-md border border-dashed border-neutral-300 bg-white text-[9px] text-neutral-500">+{p.images.length - 4}</div>}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium text-neutral-900">{p.name}</p>
                                        <p className={`text-[11px] ${mutedText}`}>{p.category} • Stock {p.stock}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-semibold ${accentText}`}>Rs.{p.price}</p>
                                    {p.isFeatured && <p className="text-[11px] text-emerald-600">Featured</p>}
                                    <div className="mt-2 flex items-center justify-end gap-2">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => handleUpdateStock(p._id, (p.stock || 0) - 1)} className="h-6 w-6 rounded-full border border-neutral-300 text-[11px] text-neutral-800 hover:border-neutral-500 hover:bg-neutral-100">-</button>
                                            <input type="number" min="0" value={p.stock} onChange={(e) => handleUpdateStock(p._id, e.target.value)} className="w-14 rounded-full border border-neutral-300 px-2 py-[3px] text-[11px] text-right" />
                                            <button onClick={() => handleUpdateStock(p._id, (p.stock || 0) + 1)} className="h-6 w-6 rounded-full border border-neutral-300 text-[11px] text-neutral-800 hover:border-neutral-500 hover:bg-neutral-100">+</button>
                                        </div>
                                        <button onClick={() => startEditProduct(p)} className="rounded-full border border-neutral-300 px-2 py-1 text-[11px] text-neutral-800 hover:border-neutral-500 hover:bg-neutral-100">Edit</button>
                                        <button onClick={() => deleteProduct(p._id)} className="rounded-full border border-red-200 px-2 py-1 text-[11px] text-red-600 hover:border-red-400 hover:bg-red-50">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default ProductManager;
