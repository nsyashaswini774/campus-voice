import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Bookmark,
  Share2,
  ExternalLink,
  Heart,
  Flag,
  CheckCircle2,
  AlertTriangle,
  Send,
  User,
  ShieldCheck,
  Building,
  DollarSign,
  Users,
} from 'lucide-react';
import { Announcement } from '../types';
import { formatDate, getDeadlineStatus, isValidHttpUrl } from '../utils/helpers';

interface OpportunityDetailsModalProps {
  announcement: Announcement;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onToggleLike: (id: string) => void;
  onShare: (announcement: Announcement) => void;
  onAddComment: (announcementId: string, author: string, role: string, text: string) => void;
  onReport: (announcementId: string, reason: string) => void;
  relatedAnnouncements: Announcement[];
  onSelectRelated: (announcement: Announcement) => void;
}

export const OpportunityDetailsModal: React.FC<OpportunityDetailsModalProps> = ({
  announcement,
  onClose,
  isSaved,
  onToggleSave,
  onToggleLike,
  onShare,
  onAddComment,
  onReport,
  relatedAnnouncements,
  onSelectRelated,
}) => {
  const deadlineInfo = getDeadlineStatus(announcement.registrationDeadline);

  // Comment state
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('Campus Student');

  // Report modal state
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('Incorrect date or venue');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Validate official URL for security
  const isValidUrl = isValidHttpUrl(announcement.sourceUrl);

  const handleRegisterClick = () => {
    if (isValidUrl) {
      window.open(announcement.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(
      announcement.id,
      commentAuthor.trim() || 'Student Voice',
      'Student',
      commentText.trim()
    );
    setCommentText('');
  };

  const handleConfirmReport = () => {
    onReport(announcement.id, reportReason);
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setIsReporting(false);
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#202544]/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl my-6 rounded-[2rem] bg-[#FFFCF8] border border-[#E8E8F2] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-[#202544]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#E8E8F2] bg-white flex items-start justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="btn-pill px-3.5 py-1 text-xs font-bold uppercase tracking-wider bg-[#F2EFFB] text-[#7C6AE8] border border-[#A78BFA]/40 shadow-2xs">
              {announcement.category}
            </span>

            <span className="btn-pill text-xs font-bold px-3 py-1 bg-[#FAF8FE] text-[#5D6385] border border-[#E8E8F2]">
              {announcement.mode} Mode
            </span>

            <span
              className={`btn-pill inline-flex items-center gap-1 px-3 py-1 text-xs font-bold border ${
                deadlineInfo.status === 'urgent'
                  ? 'bg-[#FF8177]/20 text-[#C93B2F] border-[#FF8177]/50'
                  : 'bg-[#FFD66B]/30 text-[#8C5E00] border-[#FFD66B]/60'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>{deadlineInfo.label}</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="btn-pill p-2 rounded-full bg-[#FAF8FE] border border-[#E8E8F2] text-[#5D6385] hover:text-[#202544] hover:bg-[#F2EFFB] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          {/* Main Title & Organizer */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#202544] leading-tight">
              {announcement.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs sm:text-sm text-[#5D6385]">
              <div className="flex items-center gap-1.5 font-bold text-[#7C6AE8]">
                <Building className="w-4 h-4" />
                <span>{announcement.organizer}</span>
              </div>
              <span>•</span>
              <span className="font-medium">{announcement.department}</span>
              <span>•</span>
              <span>Published {formatDate(announcement.publicationDate)}</span>
            </div>
          </div>

          {/* Key Facts Matrix Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-[#E8E8F2] shadow-2xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#717799] mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#FF8177]" />
                <span>Event Date</span>
              </div>
              <div className="text-sm font-bold text-[#202544] truncate">
                {formatDate(announcement.eventDate)}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E8E8F2] shadow-2xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#717799] mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#B88700]" />
                <span>Registration Closes</span>
              </div>
              <div className="text-sm font-bold text-[#202544] truncate">
                {formatDate(announcement.registrationDeadline)}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E8E8F2] shadow-2xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#717799] mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#2B79A6]" />
                <span>Venue</span>
              </div>
              <div className="text-sm font-bold text-[#202544] truncate">
                {announcement.venue}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E8E8F2] shadow-2xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#717799] mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#176B47]" />
                <span>Registration Fees</span>
              </div>
              <div className="text-sm font-bold text-[#176B47] truncate">
                {announcement.fees}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#717799]">
              Overview & Scope
            </h4>
            <p className="text-sm sm:text-base leading-relaxed text-[#474D6E] whitespace-pre-line">
              {announcement.description}
            </p>
          </div>

          {/* Eligibility & Guidelines */}
          <div className="p-4 rounded-2xl bg-[#FAF8FE] border border-[#E8E8F2] space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7C6AE8]">
              <Users className="w-4 h-4" />
              <span>Eligibility & Target Audience</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#474D6E] leading-relaxed">
              {announcement.eligibility}
            </p>
          </div>

          {/* Official Source & Application Action */}
          <div className="space-y-2.5 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#717799]">
              Official Source & Application Instructions
            </h4>

            <div className="p-4 rounded-2xl bg-white border border-[#E8E8F2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#176B47]">
                  <ShieldCheck className="w-4 h-4 text-[#7C6AE8]" />
                  <span>Verified Official University Listing</span>
                </div>
                <div className="text-xs text-[#5D6385] break-all font-mono">
                  {announcement.sourceUrl}
                </div>
              </div>

              {isValidUrl ? (
                <button
                  onClick={handleRegisterClick}
                  className="btn-pill px-5 py-2.5 bg-[#7C6AE8] hover:bg-[#6A57DE] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-[#7C6AE8]/20 transition-all cursor-pointer shrink-0"
                >
                  <span>Register / Apply</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-xs text-[#C93B2F] italic">
                  Invalid URL scheme. Only HTTP/HTTPS allowed.
                </span>
              )}
            </div>
          </div>

          {/* Related Opportunities */}
          {relatedAnnouncements.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#E8E8F2]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#717799]">
                More Opportunities in {announcement.category}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedAnnouncements.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectRelated(item)}
                    className="p-3.5 rounded-2xl bg-white border border-[#E8E8F2] hover:border-[#7C6AE8] shadow-2xs transition-all cursor-pointer"
                  >
                    <div className="text-[10px] font-bold text-[#FF8177] uppercase tracking-wider mb-1">
                      {item.category} • {formatDate(item.eventDate)}
                    </div>
                    <div className="text-xs font-bold text-[#202544] truncate">{item.title}</div>
                    <div className="text-[11px] text-[#717799] truncate mt-1">
                      {item.venue}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discussion & Comments Thread */}
          <div className="space-y-4 pt-4 border-t border-[#E8E8F2]">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#717799]">
                Student Discussion & Q&A ({announcement.comments.length})
              </h4>
              <span className="text-[11px] text-[#8A90B2] font-medium">
                Campus Connect Moderated
              </span>
            </div>

            {/* Existing comments list */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {announcement.comments.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#8A90B2] italic">
                  No questions yet. Be the first to start the conversation!
                </div>
              ) : (
                announcement.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3.5 rounded-2xl bg-white border border-[#E8E8F2] shadow-2xs text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#202544]">{comment.author}</span>
                        {comment.role && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F2EFFB] text-[#7C6AE8] font-bold">
                            {comment.role}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#8A90B2]">{comment.timestamp}</span>
                    </div>
                    <p className="text-[#474D6E] leading-relaxed">{comment.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Post Comment Form */}
            <form onSubmit={handleSubmitComment} className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E8E8F2] text-xs text-[#5D6385] bg-white">
                  <User className="w-3.5 h-3.5 text-[#7C6AE8]" />
                  <input
                    type="text"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    placeholder="Your name"
                    className="w-28 text-xs font-bold text-[#202544] bg-transparent outline-none"
                  />
                </div>
                <span className="text-xs text-[#8A90B2] hidden sm:inline">
                  (Posting to student community forum)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Ask a question about this opportunity..."
                  className="flex-1 px-4 py-2.5 rounded-full text-xs outline-none border border-[#E8E8F2] bg-white text-[#202544] placeholder:text-[#8A90B2] focus:border-[#7C6AE8] focus:ring-2 focus:ring-[#7C6AE8]/15"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="btn-pill px-4 py-2.5 bg-[#7C6AE8] hover:bg-[#6A57DE] disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                >
                  <Send className="w-3 h-3" />
                  <span>Post</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-[#E8E8F2] bg-white flex items-center justify-between gap-3 sticky bottom-0 z-20">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleLike(announcement.id)}
              className={`btn-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold cursor-pointer ${
                announcement.isLiked
                  ? 'bg-[#FF8177]/20 text-[#D84C40] border-[#FF8177]/40'
                  : 'bg-[#FAF8FE] border-[#E8E8F2] text-[#5D6385] hover:text-[#202544]'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  announcement.isLiked ? 'fill-[#FF8177] text-[#FF8177]' : ''
                }`}
              />
              <span className="tabular-nums">{announcement.likes}</span>
            </button>

            <button
              onClick={() => onToggleSave(announcement.id)}
              className={`btn-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold cursor-pointer ${
                isSaved
                  ? 'bg-[#7C6AE8] text-white border-[#7C6AE8]'
                  : 'bg-[#FAF8FE] border-[#E8E8F2] text-[#5D6385] hover:text-[#202544]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={() => onShare(announcement)}
              className="btn-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E8E8F2] bg-[#FAF8FE] hover:text-[#202544] text-[#5D6385] text-xs font-bold cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

          <button
            onClick={() => setIsReporting(true)}
            className="flex items-center gap-1 text-[#8A90B2] hover:text-[#FF8177] text-xs font-medium cursor-pointer"
            title="Report incorrect information"
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Report listing</span>
          </button>
        </div>

        {/* Report Confirmation Overlay */}
        {isReporting && (
          <div className="absolute inset-0 z-30 bg-[#202544]/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="max-w-md w-full p-6 rounded-3xl bg-white border border-[#E8E8F2] shadow-2xl">
              <div className="flex items-center gap-2 text-[#FF8177] mb-2">
                <AlertTriangle className="w-5 h-5" />
                <h4 className="font-bold text-sm text-[#202544]">Report Incorrect Information</h4>
              </div>
              <p className="text-xs text-[#5D6385] mb-4">
                Help keep Campus Connect accurate. Flag what needs correction:
              </p>

              {reportSubmitted ? (
                <div className="py-6 text-center text-[#176B47] flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-[#7C6AE8]" />
                  <span className="text-xs font-bold">Report submitted to campus admins!</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#FFFCF8] border border-[#E8E8F2] text-[#202544] outline-none"
                  >
                    <option value="Incorrect date or venue">Incorrect date or venue</option>
                    <option value="Broken registration link">Broken registration link</option>
                    <option value="Misleading eligibility requirements">Misleading eligibility requirements</option>
                    <option value="Spam or duplicate listing">Spam or duplicate listing</option>
                  </select>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsReporting(false)}
                      className="btn-pill px-3 py-1.5 text-xs font-bold text-[#5D6385] hover:text-[#202544]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmReport}
                      className="btn-pill px-4 py-1.5 text-xs font-bold bg-[#FF8177] hover:bg-[#E86D63] text-white"
                    >
                      Submit Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
