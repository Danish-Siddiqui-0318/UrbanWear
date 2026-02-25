import React from 'react';
import axios from 'axios';
import { secondaryBorder, cardBackground, mutedText, primaryBorder } from "../../theme/colors";
import { API_BASE_URL } from "../../config/api";

const AnnouncementManager = ({
    token,
    announcementMessage,
    setAnnouncementMessage,
    announcementActive,
    setAnnouncementActive,
    savingAnnouncement,
    setSavingAnnouncement,
    announcementError,
    setAnnouncementError,
}) => {
    const handleSaveAnnouncement = async (event) => {
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
                { message: announcementMessage, isActive: announcementActive },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            setAnnouncementError(error.response?.data?.message || error.message || "Failed to save announcement");
        } finally {
            setSavingAnnouncement(false);
        }
    };

    return (
        <section className={`rounded-2xl border ${secondaryBorder} ${cardBackground} p-5`}>
            <h2 className="text-lg font-semibold mb-1">Homepage announcement</h2>
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
                    <label className="block text-xs font-medium mb-1">Message</label>
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
                            onChange={(e) => setAnnouncementActive(e.target.checked)}
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
    );
};

export default AnnouncementManager;
