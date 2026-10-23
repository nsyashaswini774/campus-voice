import React, { useState } from 'react';
import { Bookmark, Compass, Trash2, Layers } from 'lucide-react';
import { Announcement, Category } from '../types';
import { AnnouncementCard } from './AnnouncementCard';

interface SavedItemsViewProps {
  savedAnnouncements: Announcement[];
  onToggleSave: (id: string) => void;
  onToggleLike: (id: string) => void;
  onShare: (announcement: Announcement) => void;
  onViewDetails: (announcement: Announcement) => void;
  onExplore: () => void;
  onClearAllSaved: () => void;
}

const CATEGORIES: Category[] = [
  'All',
  'Hackathons',
  'Internships',
  'Competitions',
  'Workshops',
  'Placements',
  'College Events',
  'Academic',
];

export const SavedItemsView: React.FC<SavedItemsViewProps> = ({
  savedAnnouncements,
  onToggleSave,
  onToggleLike,
  onShare,
  onViewDetails,
  onExplore,
  onClearAllSaved,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');

  const filteredItems = savedAnnouncements.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Strip */}
      <div className="p-6 sm:p-8 rounded-[2rem] bg-white border border-[#E8E8F2] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#F2EFFB] border border-[#E8E8F2] flex items-center justify-center text-[#7C6AE8] shadow-xs">
            <Bookmark className="w-6 h-6 fill-[#7C6AE8]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-[#202544]">
                Saved Opportunities
              </h2>
              <span className="btn-pill px-2.5 py-0.5 text-xs font-bold bg-[#7C6AE8] text-white tabular-nums">
                {savedAnnouncements.length}
              </span>
            </div>
            <p className="text-xs text-[#717799] mt-0.5">
              Personal bookmarks for upcoming events, applications, and revision deadlines
            </p>
          </div>
        </div>

        {savedAnnouncements.length > 0 && (
          <button
            onClick={onClearAllSaved}
            className="btn-pill flex items-center gap-1.5 px-4 py-2 bg-[#FF8177]/15 hover:bg-[#FF8177]/25 text-[#BA3428] border border-[#FF8177]/30 text-xs font-bold transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear all bookmarks</span>
          </button>
        )}
      </div>

      {/* Category Pills (Visible when saved items exist) */}
      {savedAnnouncements.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count =
              cat === 'All'
                ? savedAnnouncements.length
                : savedAnnouncements.filter((i) => i.category === cat).length;
            if (cat !== 'All' && count === 0) return null;

            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn-pill px-4 py-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-[#7C6AE8] text-white border-[#7C6AE8] shadow-xs'
                    : 'bg-white text-[#474D6E] hover:text-[#202544] hover:bg-[#F2EFFB] border-[#E8E8F2]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Cards List or Empty State */}
      {savedAnnouncements.length === 0 ? (
        <div className="p-12 sm:p-16 text-center rounded-[2.5rem] bg-white border border-[#E8E8F2] shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#F2EFFB] text-[#7C6AE8] flex items-center justify-center mb-4 shadow-xs">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-heading text-[#202544]">
            No saved opportunities yet
          </h3>
          <p className="text-xs sm:text-sm text-[#5D6385] max-w-md mt-1 mb-6 leading-relaxed">
            Click the bookmark icon on any hackathon, internship, or announcement card to save it here
            for quick access and deadline tracking.
          </p>
          <button
            onClick={onExplore}
            className="btn-pill px-6 py-3 bg-[#7C6AE8] hover:bg-[#6A57DE] text-white font-bold text-sm shadow-md shadow-[#7C6AE8]/20 flex items-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Opportunities</span>
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-[2rem] bg-white border border-[#E8E8F2]">
          <Layers className="w-8 h-8 text-[#8A90B2] mx-auto mb-2" />
          <h4 className="text-sm font-bold text-[#202544]">No saved items in this category</h4>
          <button
            onClick={() => setSelectedCategory('All')}
            className="mt-3 text-xs font-bold text-[#7C6AE8] hover:underline cursor-pointer"
          >
            Show all saved items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <AnnouncementCard
              key={item.id}
              announcement={item}
              isSaved={true}
              onToggleSave={onToggleSave}
              onToggleLike={onToggleLike}
              onShare={onShare}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};
