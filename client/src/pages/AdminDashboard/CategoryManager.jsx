import React from 'react';
import axios from 'axios';
import { secondaryBorder, cardBackground, mutedText, primaryBorder } from "../../theme/colors";
import { API_BASE_URL } from "../../config/api";

const CategoryManager = ({
    token,
    categories,
    loadingCategories,
    categoriesError,
    setCategoriesError,
    newCategoryName,
    setNewCategoryName,
    newCategoryKey,
    setNewCategoryKey,
    fetchCategories
}) => {
    const handleCreateCategory = async (event) => {
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
                { name: newCategoryName, key: newCategoryKey.toLowerCase() },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewCategoryName("");
            setNewCategoryKey("");
            await fetchCategories();
        } catch (error) {
            setCategoriesError(error.response?.data?.message || error.message || "Failed to create category");
        }
    };

    const handleToggleCategoryActive = async (categoryId, isActive) => {
        if (!token) {
            setCategoriesError("You are not authorized. Please log in again.");
            return;
        }
        try {
            setCategoriesError("");
            await axios.put(
                `${API_BASE_URL}/categories/${categoryId}`,
                { isActive: !isActive },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchCategories();
        } catch (error) {
            setCategoriesError(error.response?.data?.message || error.message || "Failed to update category");
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!token) {
            setCategoriesError("You are not authorized. Please log in again.");
            return;
        }
        const confirmed = window.confirm("Delete this category? This action cannot be undone.");
        if (!confirmed) return;
        try {
            setCategoriesError("");
            await axios.delete(
                `${API_BASE_URL}/categories/${categoryId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchCategories();
        } catch (error) {
            setCategoriesError(error.response?.data?.message || error.message || "Failed to delete category");
        }
    };

    return (
        <section className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-5`}>
            <h2 className="text-lg font-semibold mb-3">Categories</h2>
            <p className={`text-xs mb-3 ${mutedText}`}>
                Manage product categories used for filtering and assignment.
            </p>

            {categoriesError && (
                <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
                    {categoriesError}
                </div>
            )}

            <form onSubmit={handleCreateCategory} className="mb-4 flex flex-col gap-2 text-xs sm:flex-row">
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
                        <div key={category._id} className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-3 py-2">
                            <div className="min-w-0">
                                <p className="font-medium text-neutral-900 truncate">{category.name}</p>
                                <p className={`text-[11px] ${mutedText} truncate`}>Key: {category.key}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleToggleCategoryActive(category._id, category.isActive)}
                                    className={`rounded-full border px-3 py-1 text-[11px] ${
                                        category.isActive
                                            ? "border-neutral-300 text-neutral-800 hover:border-neutral-500 hover:bg-neutral-100"
                                            : "border-neutral-300 text-neutral-500 hover:border-neutral-500 hover:bg-neutral-100"
                                    }`}
                                >
                                    {category.isActive ? "Active" : "Hidden"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteCategory(category._id)}
                                    className="rounded-full border border-red-200 px-3 py-1 text-[11px] text-red-600 hover:border-red-400 hover:bg-red-50"
                                    title="Delete category"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default CategoryManager;
