import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flag,
  Info,
} from 'lucide-react';
import { Announcement } from '../types';
import { formatDate } from '../utils/helpers';

interface AdminDashboardProps {
  announcements: Announcement[];
  onCreateNew: () => void;
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string) => void;
  onResolveReports: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  announcements,
  onCreateNew,
  onEdit,
  onDelete,
  onTogglePublish,
  onResolveReports,
}) => {
  // Deletion confirmation state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Compute statistics
  const total = announcements.length;
  const publishedCount = announcements.filter((a) => a.status === 'published').length;
  const draftCount = announcements.filter((a) => a.status === 'draft').length;

  const now = new Date();
  const upcomingCount = announcements.filter((a) => new Date(a.eventDate) >= now).length;
  const expiredCount = announcements.filter((a) => new Date(a.eventDate) < now).length;

  const reportedItems = announcements.filter((a) => a.reportsCount > 0);

  const confirmDelete = () => {
    if (deletingId) {
      onDelete(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-[2rem] bg-white border border-[#E8E8F2] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#F2EFFB] border border-[#E8E8F2] flex items-center justify-center text-[#7C6AE8] shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-[#202544]">
                Campus Administrator Console
              </h2>
              <span className="btn-pill px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#FFD66B]/30 text-[#8C6000] border border-[#FFD66B]/60">
                Demo Auth Mode
              </span>
            </div>
            <p className="text-xs text-[#717799] mt-0.5">
              Manage verified listings, review student reports, and audit department broadcasts
            </p>
          </div>
        </div>

        <button
          onClick={onCreateNew}
          className="btn-pill px-5 py-2.5 bg-[#7C6AE8] hover:bg-[#6A57DE] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#7C6AE8]/20 flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create Announcement</span>
        </button>
      </div>

      {/* Honest Demo Mode Context Banner */}
      <div className="p-4 rounded-2xl bg-[#FFF8EB] border border-[#FFD66B]/60 flex items-start gap-3 text-xs leading-relaxed text-[#875500]">
        <Info className="w-4 h-4 text-[#B88700] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Demonstration Environment Notice:</span> Single Sign-On (SSO)
          via University LDAP/OAuth is currently in prototype mode. Any changes, edits, or removals made
          here are executed immediately and persisted to your local browser storage.
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-[#E8E8F2] shadow-2xs">
          <div className="text-xs text-[#717799] font-bold uppercase tracking-wider">Total</div>
          <div className="text-2xl font-black font-heading text-[#202544] mt-1 tabular-nums">{total}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E8F2] shadow-2xs">
          <div className="text-xs text-[#717799] font-bold uppercase tracking-wider">Published</div>
          <div className="text-2xl font-black font-heading text-[#176B47] mt-1 tabular-nums">
            {publishedCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E8F2] shadow-2xs">
          <div className="text-xs text-[#717799] font-bold uppercase tracking-wider">Drafts</div>
          <div className="text-2xl font-black font-heading text-[#B88700] mt-1 tabular-nums">
            {draftCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E8F2] shadow-2xs">
          <div className="text-xs text-[#717799] font-bold uppercase tracking-wider">Upcoming</div>
          <div className="text-2xl font-black font-heading text-[#21678F] mt-1 tabular-nums">
            {upcomingCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E8F2] shadow-2xs">
          <div className="text-xs text-[#717799] font-bold uppercase tracking-wider">Expired</div>
          <div className="text-2xl font-black font-heading text-[#8A90B2] mt-1 tabular-nums">
            {expiredCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E8F2] shadow-2xs">
          <div className="text-xs text-[#717799] font-bold uppercase tracking-wider">Reported</div>
          <div className="text-2xl font-black font-heading text-[#C93B2F] mt-1 tabular-nums">
            {reportedItems.length}
          </div>
        </div>
      </div>

      {/* Reported Listings Warning Box (if any) */}
      {reportedItems.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#FFF5F4] border border-[#FF8177]/40 space-y-3">
          <div className="flex items-center gap-2 text-[#C93B2F] font-bold text-sm">
            <Flag className="w-4 h-4" />
            <span>Reported Opportunities Flagged for Review</span>
          </div>

          <div className="space-y-2">
            {reportedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#E8E8F2] text-xs shadow-2xs"
              >
                <div>
                  <span className="font-bold text-[#202544]">{item.title}</span>
                  <span className="text-[#C93B2F] ml-2 font-bold">
                    ({item.reportsCount} report{item.reportsCount > 1 ? 's' : ''})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="btn-pill px-3 py-1 bg-[#7C6AE8] text-white font-bold cursor-pointer"
                  >
                    Edit Data
                  </button>
                  <button
                    onClick={() => onResolveReports(item.id)}
                    className="btn-pill px-3 py-1 bg-[#A8E6CF]/60 text-[#176B47] border border-[#A8E6CF] font-bold cursor-pointer"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Announcements Data Table */}
      <div className="rounded-[2rem] bg-white border border-[#E8E8F2] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#E8E8F2] flex items-center justify-between">
          <h3 className="text-base font-bold font-heading text-[#202544]">All Campus Listings</h3>
          <span className="text-xs text-[#717799] font-medium">
            Showing {announcements.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E8E8F2] text-[11px] font-bold uppercase tracking-wider bg-[#FAF8FE] text-[#717799]">
              <tr>
                <th className="px-5 py-3.5">Announcement & Organizer</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Event Date</th>
                <th className="px-4 py-3.5">Deadline</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8F2]">
              {announcements.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-[#FAF8FE]/80 transition-colors ${
                    item.status === 'draft' ? 'opacity-70' : ''
                  }`}
                >
                  <td className="px-5 py-4">
                    <div className="font-bold text-[#202544] text-sm line-clamp-1">{item.title}</div>
                    <div className="text-[11px] text-[#717799] mt-0.5">
                      {item.organizer} • {item.department}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="btn-pill px-2.5 py-0.5 text-[11px] font-bold bg-[#F2EFFB] text-[#7C6AE8] border border-[#E8E8F2]">
                      {item.category}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-[#474D6E] font-medium whitespace-nowrap">
                    {formatDate(item.eventDate)}
                  </td>

                  <td className="px-4 py-4 text-[#474D6E] font-mono text-[11px] whitespace-nowrap">
                    {formatDate(item.registrationDeadline)}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onTogglePublish(item.id)}
                      className={`btn-pill inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold border transition-all cursor-pointer ${
                        item.status === 'published'
                          ? 'bg-[#A8E6CF]/30 text-[#176B47] border-[#A8E6CF]/70 hover:bg-[#A8E6CF]/50'
                          : 'bg-[#FFD66B]/30 text-[#8C6000] border-[#FFD66B]/70 hover:bg-[#FFD66B]/50'
                      }`}
                      title="Click to toggle published / draft state"
                    >
                      {item.status === 'published' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-[#176B47]" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-[#8C6000]" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </td>

                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="btn-pill p-2 border border-[#E8E8F2] bg-white hover:border-[#7C6AE8] hover:bg-[#F2EFFB] text-[#474D6E] transition-all cursor-pointer"
                        title="Edit announcement"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#7C6AE8]" />
                      </button>

                      <button
                        onClick={() => setDeletingId(item.id)}
                        className="btn-pill p-2 border border-[#E8E8F2] bg-white hover:border-[#FF8177] hover:bg-[#FFF5F4] text-[#BA3428] transition-all cursor-pointer"
                        title="Delete announcement"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-[#BA3428]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-[#202544]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-white border border-[#E8E8F2] shadow-2xl">
            <div className="flex items-center gap-3 text-[#BA3428] mb-2">
              <AlertTriangle className="w-6 h-6" />
              <h4 className="text-base font-bold text-[#202544]">Confirm Deletion</h4>
            </div>
            <p className="text-xs text-[#5D6385] mt-2 mb-6 leading-relaxed">
              Are you sure you want to permanently delete this announcement? This action will remove
              the listing and its comments from the campus feed.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="btn-pill px-4 py-2 text-xs font-bold text-[#5D6385] hover:text-[#202544] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn-pill px-5 py-2 bg-[#FF8177] hover:bg-[#E86D63] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Yes, Delete Announcement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
