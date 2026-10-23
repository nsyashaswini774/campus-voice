import React from 'react';
import {
  Bell,
  CheckCheck,
  Clock,
  Sparkles,
  Info,
  ExternalLink,
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsCenterProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectAnnouncementById: (id: string) => void;
}

export const NotificationsCenter: React.FC<NotificationsCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectAnnouncementById,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Notifications Header */}
      <div className="p-6 sm:p-8 rounded-[2rem] bg-white border border-[#E8E8F2] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#F2EFFB] border border-[#E8E8F2] flex items-center justify-center text-[#7C6AE8] shadow-xs">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-[#202544]">
                Campus Notification Center
              </h2>
              {unreadCount > 0 && (
                <span className="btn-pill px-2.5 py-0.5 text-xs font-bold bg-[#FF8177] text-white">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p className="text-xs text-[#717799] mt-0.5">
              In-app alerts for newly announced hackathons, deadlines, and department notices
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="btn-pill flex items-center gap-1.5 px-4 py-2 bg-[#F2EFFB] hover:bg-[#E8E4F8] text-[#7C6AE8] border border-[#E8E8F2] text-xs font-bold transition-all cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Honest In-App Notification Notice */}
      <div className="p-4 rounded-2xl bg-[#F0F7FD] border border-[#83C9F4]/40 flex items-start gap-3 text-xs leading-relaxed text-[#1D5E85]">
        <Info className="w-4 h-4 text-[#2B79A6] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">In-App Notification Stream:</span> These alerts are delivered
          directly within your Campus Connect session and saved to local storage. External browser push
          and email integrations require university SMTP and VAPID credentials, which are currently
          unconfigured in this prototype.
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 text-center rounded-[2rem] bg-white border border-[#E8E8F2] shadow-xs">
            <Bell className="w-10 h-10 text-[#8A90B2] mx-auto mb-3" />
            <h4 className="text-base font-bold text-[#202544]">No notifications yet</h4>
            <p className="text-xs text-[#717799] mt-1">
              You are completely caught up on campus announcements!
            </p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onMarkAsRead(item.id);
                if (item.announcementId) {
                  onSelectAnnouncementById(item.announcementId);
                }
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                !item.read
                  ? 'bg-white border-[#7C6AE8]/40 shadow-xs hover:border-[#7C6AE8]'
                  : 'bg-[#FFFCF8] border-[#E8E8F2] opacity-85 hover:border-[#DCD9EE]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    item.type === 'deadline'
                      ? 'bg-[#FF8177]/20 text-[#D84C40]'
                      : 'bg-[#F2EFFB] text-[#7C6AE8]'
                  }`}
                >
                  {item.type === 'deadline' ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#202544]">{item.title}</h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#FF8177] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#5D6385] mt-1 leading-relaxed">
                    {item.description}
                  </p>
                  <span className="text-[11px] text-[#8A90B2] font-mono mt-1.5 block">
                    {item.timestamp}
                  </span>
                </div>
              </div>

              {item.announcementId && (
                <div className="text-xs font-bold text-[#7C6AE8] hover:text-[#6A57DE] flex items-center gap-1 shrink-0 pt-1">
                  <span>View</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
