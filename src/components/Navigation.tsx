import React from 'react';
import {
  Home,
  Flame,
  Code2,
  Briefcase,
  Trophy,
  GraduationCap,
  Building2,
  CalendarDays,
  Bookmark,
  Calendar,
  Bell,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { NavigationView } from '../types';

interface NavigationProps {
  currentView: NavigationView;
  onNavigate: (view: NavigationView) => void;
  savedCount: number;
  unreadNotificationsCount: number;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onOpenCreateModal: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onNavigate,
  savedCount,
  unreadNotificationsCount,
  mobileMenuOpen,
  setMobileMenuOpen,
  onOpenCreateModal,
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'all', label: 'All Opportunities', icon: Flame },
    { id: 'hackathons', label: 'Hackathons', icon: Code2, count: 1, accent: 'bg-[#FFD66B]/20 text-[#A06C00]' },
    { id: 'internships', label: 'Internships', icon: Briefcase, count: 1, accent: 'bg-[#83C9F4]/20 text-[#2B79A6]' },
    { id: 'competitions', label: 'Competitions', icon: Trophy, count: 3, accent: 'bg-[#FF8177]/20 text-[#D84C40]' },
    { id: 'workshops', label: 'Workshops', icon: GraduationCap, count: 2, accent: 'bg-[#A8E6CF]/30 text-[#1B7752]' },
    { id: 'placements', label: 'Placements', icon: Building2, count: 1, accent: 'bg-[#A78BFA]/20 text-[#6B47DE]' },
    { id: 'events', label: 'College Events', icon: CalendarDays, count: 1, accent: 'bg-[#FFD66B]/25 text-[#9E6900]' },
    { id: 'saved', label: 'Saved Items', icon: Bookmark, badge: savedCount },
    { id: 'calendar', label: 'Calendar & Deadlines', icon: Calendar },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount,
    },
    { id: 'admin', label: 'Admin Dashboard', icon: ShieldCheck, isSpecial: true },
  ] as const;

  const handleItemClick = (id: NavigationView) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Editorial Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 sticky top-0 h-screen z-40 bg-white border-r border-[#E8E8F2] shadow-xs">
        {/* Brand Header */}
        <div className="p-6 pb-5 border-b border-[#E8E8F2]">
          <button
            onClick={() => handleItemClick('home')}
            className="flex items-center gap-3.5 text-left group cursor-pointer focus:outline-none w-full"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#7C6AE8] to-[#A78BFA] p-[2px] shadow-sm group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#7C6AE8]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight font-heading text-[#202544]">
                  Campus Connect
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#717799] tracking-normal">
                Your university opportunity hub
              </p>
            </div>
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#8A90B2]">
            Discover
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const hasBadge = 'badge' in item && typeof item.badge === 'number' && item.badge > 0;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id as NavigationView)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#F2EFFB] text-[#7C6AE8] font-bold shadow-2xs'
                    : 'text-[#474D6E] hover:text-[#202544] hover:bg-[#F8F8FC]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#7C6AE8]' : 'text-[#8A90B2]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {hasBadge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
                      item.id === 'notifications'
                        ? 'bg-[#FF8177] text-white shadow-xs animate-pulse'
                        : 'bg-[#F2EFFB] text-[#7C6AE8] border border-[#E8E8F2]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.id === 'admin' && (
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#FFD66B]/30 text-[#8C6000] border border-[#FFD66B]/50">
                    Admin
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer with Cute Post Button */}
        <div className="p-4 border-t border-[#E8E8F2] bg-[#FAF8FE]/50">
          <button
            onClick={onOpenCreateModal}
            className="btn-pill w-full py-3 px-4 bg-[#7C6AE8] hover:bg-[#6A57DE] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#7C6AE8]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#FFD66B]" />
            <span>+ Post Announcement</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 px-4 py-3 bg-white/95 backdrop-blur-md border-b border-[#E8E8F2] flex items-center justify-between shadow-xs">
        <button
          onClick={() => handleItemClick('home')}
          className="flex items-center gap-2.5 text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-[#7C6AE8] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-[#FFD66B]" />
          </div>
          <div>
            <span className="text-lg font-bold font-heading text-[#202544]">
              Campus Connect
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {/* Quick Notification Button on Mobile */}
          <button
            onClick={() => handleItemClick('notifications')}
            className="p-2 rounded-xl relative bg-[#F8F8FC] border border-[#E8E8F2] text-[#474D6E]"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF8177] text-white text-[9px] font-bold flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-[#F8F8FC] border border-[#E8E8F2] text-[#202544]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-[#202544]/40 backdrop-blur-xs flex flex-col justify-end"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full rounded-t-3xl p-6 overflow-y-auto bg-white text-[#202544] shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E8F2]">
              <span className="text-base font-bold font-heading text-[#202544]">
                Campus Connect Menu
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-[#717799] hover:text-[#202544]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 py-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id as NavigationView)}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-semibold text-left transition-all ${
                      isActive
                        ? 'bg-[#F2EFFB] text-[#7C6AE8] font-bold border border-[#A78BFA]/30'
                        : 'bg-[#F8F8FC] text-[#474D6E]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-[#7C6AE8]" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCreateModal();
              }}
              className="btn-pill w-full mt-2 py-3 bg-[#7C6AE8] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FFD66B]" />
              <span>+ Post Announcement</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
