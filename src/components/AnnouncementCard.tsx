import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Bookmark,
  Share2,
  Heart,
  MessageCircle,
  Building,
  ArrowRight,
  Code2,
  Briefcase,
  Trophy,
  GraduationCap,
  Building2,
  CalendarDays,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Announcement } from '../types';
import { formatDate, getDeadlineStatus } from '../utils/helpers';

interface AnnouncementCardProps {
  announcement: Announcement;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onToggleLike: (id: string) => void;
  onShare: (announcement: Announcement) => void;
  onViewDetails: (announcement: Announcement) => void;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  isSaved,
  onToggleSave,
  onToggleLike,
  onShare,
  onViewDetails,
}) => {
  const deadlineInfo = getDeadlineStatus(announcement.registrationDeadline);
  const [imageError, setImageError] = useState(false);

  // Intentional, coordinated pastel category styling
  const getCategoryConfig = (category: Announcement['category']) => {
    switch (category) {
      case 'Hackathons':
        return {
          icon: <Code2 className="w-3.5 h-3.5" />,
          badgeStyle: 'bg-[#FFD66B]/30 text-[#8C5E00] border-[#FFD66B]/70',
        };
      case 'Internships':
        return {
          icon: <Briefcase className="w-3.5 h-3.5" />,
          badgeStyle: 'bg-[#83C9F4]/25 text-[#1F6B92] border-[#83C9F4]/60',
        };
      case 'Competitions':
        return {
          icon: <Trophy className="w-3.5 h-3.5" />,
          badgeStyle: 'bg-[#FF8177]/20 text-[#BA3428] border-[#FF8177]/60',
        };
      case 'Workshops':
        return {
          icon: <GraduationCap className="w-3.5 h-3.5" />,
          badgeStyle: 'bg-[#A8E6CF]/40 text-[#176B47] border-[#A8E6CF]/80',
        };
      case 'Placements':
        return {
          icon: <Building2 className="w-3.5 h-3.5" />,
          badgeStyle: 'bg-[#A78BFA]/25 text-[#5B38D6] border-[#A78BFA]/60',
        };
      case 'College Events':
        return {
          icon: <CalendarDays className="w-3.5 h-3.5" />,
          badgeStyle: 'bg-[#FFD66B]/30 text-[#8C5E00] border-[#FFD66B]/70',
        };
      case 'Academic':
      default:
        return {
          icon: <Layers className="w-3.5 h-3.5" />,
          badgeStyle: 'bg-[#E8E8F2] text-[#474D6E] border-[#D4D4E8]',
        };
    }
  };

  const catConfig = getCategoryConfig(announcement.category);

  return (
    <article className="card-soft relative rounded-3xl overflow-hidden flex flex-col justify-between group">
      {/* Optional Top Thumbnail Image */}
      {announcement.imageUrl && !imageError && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F2EFFB]">
          <img
            src={announcement.imageUrl}
            alt={announcement.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          <div className="absolute top-3 right-3">
            <span className="btn-pill px-3 py-1 bg-white/90 backdrop-blur-md text-[#202544] text-[11px] font-bold border border-[#E8E8F2] shadow-xs">
              {announcement.mode}
            </span>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-5 sm:p-6 pb-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Header row: Category & Deadline */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${catConfig.badgeStyle}`}
            >
              {catConfig.icon}
              <span>{announcement.category}</span>
            </span>

            {/* Registration Deadline Status Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                deadlineInfo.status === 'urgent'
                  ? 'bg-[#FF8177]/20 text-[#C93B2F] border-[#FF8177]/50 animate-pulse'
                  : deadlineInfo.status === 'closing_soon'
                  ? 'bg-[#FFD66B]/30 text-[#966300] border-[#FFD66B]/60'
                  : 'bg-[#A8E6CF]/30 text-[#176B47] border-[#A8E6CF]/60'
              }`}
            >
              <Clock className="w-3 h-3 shrink-0" />
              <span>{deadlineInfo.label}</span>
            </span>
          </div>

          {/* Announcement Title */}
          <h3
            onClick={() => onViewDetails(announcement)}
            className="text-lg sm:text-xl font-bold font-heading text-[#202544] group-hover:text-[#7C6AE8] transition-colors leading-snug cursor-pointer line-clamp-2"
          >
            {announcement.title}
          </h3>

          {/* Short Description */}
          <p className="mt-2 text-xs sm:text-sm text-[#5D6385] line-clamp-2 leading-relaxed font-normal">
            {announcement.description}
          </p>
        </div>

        {/* Organizer & Meta Info */}
        <div className="mt-4 pt-3.5 border-t border-[#E8E8F2] space-y-2 text-xs text-[#5D6385]">
          <div className="flex items-center gap-1.5 font-medium text-[#202544] truncate">
            <Building className="w-3.5 h-3.5 text-[#7C6AE8] shrink-0" />
            <span className="truncate">{announcement.organizer}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-[#5D6385] truncate">
              <Calendar className="w-3.5 h-3.5 text-[#FF8177] shrink-0" />
              <span className="truncate font-medium">{formatDate(announcement.eventDate)}</span>
            </div>

            <div className="flex items-center gap-1.5 text-[#5D6385] truncate">
              <MapPin className="w-3.5 h-3.5 text-[#83C9F4] shrink-0" />
              <span className="truncate font-medium">{announcement.venue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cute Interactive Footer */}
      <div className="px-5 sm:px-6 py-3.5 bg-[#FAF8FE] border-t border-[#E8E8F2] flex items-center justify-between gap-2 text-xs">
        {/* Left: Like & Comment Micro-interactions */}
        <div className="flex items-center gap-2">
          {/* Like Button */}
          <button
            onClick={() => onToggleLike(announcement.id)}
            className={`btn-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
              announcement.isLiked
                ? 'bg-[#FF8177]/20 text-[#D84C40] border-[#FF8177]/40'
                : 'bg-white border-[#E8E8F2] text-[#5D6385] hover:text-[#202544] hover:bg-[#F2EFFB]'
            }`}
            aria-label={announcement.isLiked ? 'Unlike' : 'Like'}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                announcement.isLiked ? 'fill-[#FF8177] text-[#FF8177]' : 'text-[#8A90B2]'
              }`}
            />
            <span className="tabular-nums">{announcement.likes}</span>
          </button>

          {/* Comments Button */}
          <button
            onClick={() => onViewDetails(announcement)}
            className="btn-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E8E8F2] text-[#5D6385] hover:text-[#202544] hover:bg-[#F2EFFB] font-bold transition-all cursor-pointer"
            title="View comments"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#8A90B2]" />
            <span className="tabular-nums">{announcement.comments.length}</span>
          </button>
        </div>

        {/* Right: Save, Share & Details */}
        <div className="flex items-center gap-1.5">
          {/* Save / Bookmark Button */}
          <button
            onClick={() => onToggleSave(announcement.id)}
            className={`btn-pill p-2 rounded-full border transition-all cursor-pointer ${
              isSaved
                ? 'bg-[#7C6AE8] text-white border-[#7C6AE8] shadow-xs'
                : 'bg-white border-[#E8E8F2] text-[#5D6385] hover:text-[#202544] hover:bg-[#F2EFFB]'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save opportunity'}
            aria-label="Save opportunity"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
          </button>

          {/* Share Button */}
          <button
            onClick={() => onShare(announcement)}
            className="btn-pill p-2 rounded-full bg-white border border-[#E8E8F2] text-[#5D6385] hover:text-[#202544] hover:bg-[#F2EFFB] transition-all cursor-pointer"
            title="Share opportunity link"
            aria-label="Share opportunity"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* Details Primary Action */}
          <button
            onClick={() => onViewDetails(announcement)}
            className="btn-pill px-3.5 py-1.5 bg-[#7C6AE8] hover:bg-[#6A57DE] text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer ml-1"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </article>
  );
};
