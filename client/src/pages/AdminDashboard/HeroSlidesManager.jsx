import React from 'react';
import axios from 'axios';
import { secondaryBorder, cardBackground, mutedText, primaryBorder, primaryGradient } from "../../theme/colors";
import { API_BASE_URL } from "../../config/api";

const HeroSlidesManager = ({
    token,
    heroSlides,
    loadingHeroSlides,
    heroSlidesError,
    setHeroSlidesError,
    editingSlideId,
    setEditingSlideId,
    slideTitle,
    setSlideTitle,
    slideSubtitle,
    setSlideSubtitle,
    slideImageUrl,
    setSlideImageUrl,
    slideButtonLabel,
    setSlideButtonLabel,
    slideButtonLink,
    setSlideButtonLink,
    slideIsActive,
    setSlideIsActive,
    slideSortOrder,
    setSlideSortOrder,
    fetchHeroSlides
}) => {
    const [slideImageFile, setSlideImageFile] = React.useState(null);
    const [imagePreview, setImagePreview] = React.useState(null);
    const [saving, setSaving] = React.useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSlideImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const startEditSlide = (slide) => {
        setEditingSlideId(slide._id);
        setSlideTitle(slide.title || "");
        setSlideSubtitle(slide.subtitle || "");
        setSlideImageUrl(slide.imageUrl || "");
        setSlideButtonLabel(slide.buttonLabel || "");
        setSlideButtonLink(slide.buttonLink || "");
        setSlideIsActive(slide.isActive ?? true);
        setSlideSortOrder(typeof slide.sortOrder === "number" ? String(slide.sortOrder) : "");
        setImagePreview(slide.imageUrl || null);
        setSlideImageFile(null);
    };

    const resetSlideForm = () => {
        setEditingSlideId(null);
        setSlideTitle("");
        setSlideSubtitle("");
        setSlideImageUrl("");
        setSlideButtonLabel("");
        setSlideButtonLink("");
        setSlideIsActive(true);
        setSlideSortOrder("");
        setSlideImageFile(null);
        setImagePreview(null);
    };

    const handleSaveSlide = async (event) => {
        event.preventDefault();
        if (!token) {
            setHeroSlidesError("You are not authorized. Please log in again.");
            return;
        }

        if (!slideImageFile && !slideImageUrl && !editingSlideId) {
            setHeroSlidesError("Please upload an image or provide a URL.");
            return;
        }

        try {
            setSaving(true);
            setHeroSlidesError("");
            
            const formData = new FormData();
            formData.append("title", slideTitle);
            formData.append("subtitle", slideSubtitle || "");
            formData.append("buttonLabel", slideButtonLabel || "");
            formData.append("buttonLink", slideButtonLink || "");
            formData.append("isActive", String(slideIsActive));
            formData.append("sortOrder", slideSortOrder ? String(Number(slideSortOrder)) : "0");
            
            if (slideImageFile) {
                formData.append("image", slideImageFile);
            } else if (slideImageUrl) {
                formData.append("imageUrl", slideImageUrl);
            }

            const config = {
                headers: { 
                    Authorization: `Bearer ${token}`
                    // Axios will set multipart/form-data with boundary automatically
                },
            };

            if (editingSlideId) {
                await axios.put(`${API_BASE_URL}/hero-slides/${editingSlideId}`, formData, config);
            } else {
                await axios.post(`${API_BASE_URL}/hero-slides`, formData, config);
            }

            await fetchHeroSlides();
            resetSlideForm();
        } catch (error) {
            console.error("[HeroSlidesManager] Error saving slide:", error);
            setHeroSlidesError(error.response?.data?.message || error.message || "Failed to save hero slide");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSlide = async (slideId) => {
        if (!token) {
            setHeroSlidesError("You are not authorized. Please log in again.");
            return;
        }
        try {
            setHeroSlidesError("");
            await axios.delete(`${API_BASE_URL}/hero-slides/${slideId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (editingSlideId === slideId) resetSlideForm();
            await fetchHeroSlides();
        } catch (error) {
            setHeroSlidesError(error.response?.data?.message || error.message || "Failed to delete hero slide");
        }
    };

    return (
        <section className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-5`}>
            <h2 className="text-lg font-semibold mb-3">Hero slides</h2>
            <p className={`text-xs mb-3 ${mutedText}`}>Configure the slides used in the homepage hero banner.</p>

            {heroSlidesError && (
                <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
                    {heroSlidesError}
                </div>
            )}

            <form onSubmit={handleSaveSlide} className="space-y-2 mb-4 text-xs">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div>
                        <label className="block text-[11px] font-medium mb-1">Title</label>
                        <input type="text" value={slideTitle} onChange={(e) => setSlideTitle(e.target.value)} className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-xs outline-none focus:border-neutral-900 focus:ring-0`} required />
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium mb-1">Upload image or URL</label>
                        <div className="flex gap-2">
                            <input 
                                type="file" 
                                onChange={handleFileChange} 
                                className="hidden" 
                                id="hero-image-upload" 
                                accept="image/*"
                            />
                            <label 
                                htmlFor="hero-image-upload" 
                                className={`flex-1 flex items-center justify-center rounded-lg border border-dashed ${primaryBorder} bg-neutral-50 px-3 py-2 text-[11px] cursor-pointer hover:bg-neutral-100 transition-colors`}
                            >
                                {slideImageFile ? slideImageFile.name : "Choose file"}
                            </label>
                            <input 
                                type="url" 
                                value={slideImageUrl} 
                                onChange={(e) => setSlideImageUrl(e.target.value)} 
                                placeholder="Or paste URL"
                                className={`flex-1 rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-xs outline-none focus:border-neutral-900 focus:ring-0`} 
                            />
                        </div>
                    </div>
                </div>

                {imagePreview && (
                    <div className="relative h-24 w-full rounded-xl overflow-hidden border border-neutral-200">
                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                        <button 
                            type="button" 
                            onClick={() => { setSlideImageFile(null); setImagePreview(null); setSlideImageUrl(""); }}
                            className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white"
                        >
                            <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                <div>
                    <label className="block text-[11px] font-medium mb-1">Subtitle</label>
                    <textarea value={slideSubtitle} onChange={(e) => setSlideSubtitle(e.target.value)} rows={2} className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-xs outline-none focus:border-neutral-900 focus:ring-0`} />
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <div>
                        <label className="block text-[11px] font-medium mb-1">Button label</label>
                        <input type="text" value={slideButtonLabel} onChange={(e) => setSlideButtonLabel(e.target.value)} className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-xs outline-none focus:border-neutral-900 focus:ring-0`} placeholder="e.g. Shop now" />
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium mb-1">Button link</label>
                        <input type="text" value={slideButtonLink} onChange={(e) => setSlideButtonLink(e.target.value)} className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-xs outline-none focus:border-neutral-900 focus:ring-0`} placeholder="/shirt" />
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium mb-1">Sort order</label>
                        <input type="number" value={slideSortOrder} onChange={(e) => setSlideSortOrder(e.target.value)} className={`w-full rounded-lg border ${primaryBorder} bg-white px-3 py-2 text-xs outline-none focus:border-neutral-900 focus:ring-0`} placeholder="0" />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <label className="inline-flex items-center gap-2 text-xs">
                        <input type="checkbox" checked={slideIsActive} onChange={(e) => setSlideIsActive(e.target.checked)} className={`rounded border ${primaryBorder} text-neutral-900 focus:ring-neutral-900`} />
                        <span>Active</span>
                    </label>
                    <div className="flex items-center gap-2">
                        {editingSlideId && (
                            <button type="button" onClick={resetSlideForm} className={`rounded-full border ${primaryBorder} px-3 py-1 text-[11px] text-neutral-800 transition hover:border-neutral-500 hover:bg-neutral-100`}>Cancel</button>
                        )}
                        <button type="submit" disabled={saving} className={`rounded-full bg-gradient-to-r ${primaryGradient} px-4 py-2 text-[11px] font-medium text-slate-950 transition hover:shadow-md disabled:opacity-50`}>
                            {saving ? "Saving..." : (editingSlideId ? "Save slide" : "Add slide")}
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
                        <div key={slide._id} className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-3 py-2">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-md overflow-hidden bg-neutral-100">
                                    {slide.imageUrl && <img src={slide.imageUrl} alt={slide.title} className="h-full w-full object-cover" />}
                                </div>
                                <div>
                                    <p className="font-medium text-neutral-900">{slide.title}</p>
                                    <p className={`text-[11px] ${mutedText}`}>Order {slide.sortOrder ?? 0} • {slide.isActive ? "Active" : "Hidden"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={() => startEditSlide(slide)} className="rounded-full border border-neutral-300 px-3 py-1 text-[11px] text-neutral-800 hover:border-neutral-500 hover:bg-neutral-100">Edit</button>
                                <button type="button" onClick={() => handleDeleteSlide(slide._id)} className="rounded-full border border-red-200 px-3 py-1 text-[11px] text-red-600 hover:border-red-400 hover:bg-red-50">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default HeroSlidesManager;
