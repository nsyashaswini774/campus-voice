import React, { useState, useEffect } from 'react';
import {
  Announcement,
  Category,
  Department,
  ParticipationMode,
  StatusFilter,
  DeadlineFilter,
  SortOption,
  NotificationItem,
  ToastMessage,
  NavigationView,
} from './types';
import { INITIAL_ANNOUNCEMENTS, INITIAL_NOTIFICATIONS } from './data/mockAnnouncements';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { FilterToolbar } from './components/FilterToolbar';
import { AnnouncementCard } from './components/AnnouncementCard';
import { OpportunityDetailsModal } from './components/OpportunityDetailsModal';
import { CalendarView } from './components/CalendarView';
import { NotificationsCenter } from './components/NotificationsCenter';
import { SavedItemsView } from './components/SavedItemsView';
import { AdminDashboard } from './components/AdminDashboard';
import { CreateEditModal } from './components/CreateEditModal';
import { ToastContainer } from './components/ToastContainer';
import {
  Sparkles,
  Compass,
  Flame,
  Layers,
  ArrowRight,
  Code2,
  Briefcase,
  Trophy,
  GraduationCap,
  Building2,
  CalendarDays,
} from 'lucide-react';
import { getDaysRemaining } from './utils/helpers';

export default function App() {
  // Current navigation view
  const [currentView, setCurrentView] = useState<NavigationView>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Persistence: Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem('campus_voice_announcements_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  // Persistence: Saved Announcement IDs
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('campus_voice_saved_ids_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ['ann-1', 'ann-2']; // Initial sample bookmarks
  });

  // Persistence: Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('campus_voice_notifications_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Filters and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('All Departments');
  const [selectedMode, setSelectedMode] = useState<ParticipationMode>('All Modes');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('All Status');
  const [selectedDeadline, setSelectedDeadline] = useState<DeadlineFilter>('All Deadlines');
  const [selectedSort, setSelectedSort] = useState<SortOption>('newest');

  // Modal states
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // Toast feedback notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('campus_voice_announcements_v2', JSON.stringify(announcements));
    } catch (e) {
      console.error('Failed to save announcements to localStorage', e);
    }
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem('campus_voice_saved_ids_v2', JSON.stringify(savedIds));
    } catch (e) {
      console.error('Failed to save bookmarks to localStorage', e);
    }
  }, [savedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('campus_voice_notifications_v2', JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to save notifications to localStorage', e);
    }
  }, [notifications]);


  // Toast helper
  const addToast = (title: string, description?: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };


  // Saved / Bookmark Toggle
  const handleToggleSave = (id: string) => {
    const isCurrentlySaved = savedIds.includes(id);
    if (isCurrentlySaved) {
      setSavedIds((prev) => prev.filter((item) => item !== id));
      addToast('Bookmark Removed', 'Opportunity removed from your saved items.', 'info');
    } else {
      setSavedIds((prev) => [...prev, id]);
      addToast('Saved to Bookmarks', 'Opportunity added to your saved collection.', 'success');
    }
  };

  // Like Toggle
  const handleToggleLike = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newIsLiked = !item.isLiked;
          return {
            ...item,
            isLiked: newIsLiked,
            likes: newIsLiked ? item.likes + 1 : item.likes - 1,
          };
        }
        return item;
      })
    );
  };

  // Share link handler
  const handleShare = async (announcement: Announcement) => {
    const shareUrl = window.location.href;
    const shareData = {
      title: announcement.title,
      text: `${announcement.title} - ${announcement.organizer}`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        addToast('Shared Successfully', 'Opportunity link shared.', 'success');
        return;
      } catch {
        // User cancelled or unsupported, fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareData.title}\n${shareUrl}`);
      addToast('Link Copied to Clipboard', 'You can now paste and share this opportunity.', 'success');
    } catch {
      addToast('Copy Link', shareUrl, 'info');
    }
  };

  // Comments handler
  const handleAddComment = (announcementId: string, author: string, role: string, text: string) => {
    const now = new Date();
    const formattedTimestamp = `Just now • ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newComment = {
      id: `c-${Date.now()}`,
      author,
      role,
      text,
      timestamp: formattedTimestamp,
    };

    setAnnouncements((prev) =>
      prev.map((item) => {
        if (item.id === announcementId) {
          return {
            ...item,
            comments: [...item.comments, newComment],
          };
        }
        return item;
      })
    );

    // Also update selected announcement if open
    setSelectedAnnouncement((prev) => {
      if (prev && prev.id === announcementId) {
        return {
          ...prev,
          comments: [...prev.comments, newComment],
        };
      }
      return prev;
    });

    addToast('Comment Posted', 'Your question or comment is live in the discussion thread.', 'success');
  };

  // Report handler
  const handleReport = (announcementId: string, reason: string) => {
    setAnnouncements((prev) =>
      prev.map((item) => {
        if (item.id === announcementId) {
          return {
            ...item,
            reportsCount: (item.reportsCount || 0) + 1,
          };
        }
        return item;
      })
    );

    addToast(
      'Report Submitted',
      `Thank you for helping keep listings verified (${reason}). Administrators have been notified.`,
      'warning'
    );
  };

  // Admin CRUD actions
  const handleSaveAnnouncement = (data: Partial<Announcement>) => {
    if (editingAnnouncement) {
      // Update existing
      setAnnouncements((prev) =>
        prev.map((item) => (item.id === data.id ? ({ ...item, ...data } as Announcement) : item))
      );
      addToast('Announcement Updated', 'Changes have been saved to the campus feed.', 'success');
    } else {
      // Create new
      const newEntry = {
        ...data,
        likes: 0,
        isLiked: false,
        comments: [],
        reportsCount: 0,
        isVerified: true,
      } as Announcement;

      setAnnouncements((prev) => [newEntry, ...prev]);

      // Add a corresponding in-app notification
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `New: ${newEntry.title}`,
        description: `${newEntry.organizer} has published a new announcement for ${newEntry.category}.`,
        timestamp: 'Just now',
        read: false,
        type: 'announcement',
        announcementId: newEntry.id,
      };
      setNotifications((prev) => [newNotif, ...prev]);

      addToast('Announcement Published', 'Your listing is now broadcasted to all campus students.', 'success');
    }

    setEditingAnnouncement(null);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((item) => item.id !== id));
    setSavedIds((prev) => prev.filter((savedId) => savedId !== id));
    addToast('Announcement Deleted', 'The listing has been removed from the platform.', 'info');
  };

  const handleTogglePublish = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'published' ? 'draft' : 'published';
          addToast(
            nextStatus === 'published' ? 'Listing Published' : 'Listing Moved to Drafts',
            nextStatus === 'published'
              ? 'Now visible to all students.'
              : 'Hidden from public student feeds.',
            'info'
          );
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const handleResolveReports = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, reportsCount: 0 } : item))
    );
    addToast('Reports Resolved', 'Flagged reports for this listing have been cleared.', 'success');
  };

  // Notifications handlers
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    addToast('Notifications Cleared', 'All alerts marked as read.', 'info');
  };

  const handleSelectAnnouncementById = (id: string) => {
    const found = announcements.find((a) => a.id === id);
    if (found) {
      setSelectedAnnouncement(found);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDepartment('All Departments');
    setSelectedMode('All Modes');
    setSelectedStatus('All Status');
    setSelectedDeadline('All Deadlines');
    setSelectedSort('newest');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'All' ||
    selectedDepartment !== 'All Departments' ||
    selectedMode !== 'All Modes' ||
    selectedStatus !== 'All Status' ||
    selectedDeadline !== 'All Deadlines' ||
    selectedSort !== 'newest';

  // Navigation routing helper
  const handleNavigate = (view: NavigationView) => {
    setCurrentView(view);
    // Auto-filter category when clicking specific nav links
    if (view === 'hackathons') {
      setSelectedCategory('Hackathons');
    } else if (view === 'internships') {
      setSelectedCategory('Internships');
    } else if (view === 'competitions') {
      setSelectedCategory('Competitions');
    } else if (view === 'workshops') {
      setSelectedCategory('Workshops');
    } else if (view === 'placements') {
      setSelectedCategory('Placements');
    } else if (view === 'events') {
      setSelectedCategory('College Events');
    } else if (view === 'all') {
      setSelectedCategory('All');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered and Sorted announcements
  const filteredAnnouncements = announcements.filter((item) => {
    // Hide drafts from public student views (unless in admin view)
    if (currentView !== 'admin' && item.status === 'draft') return false;

    // Category filter
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;

    // Department filter
    if (
      selectedDepartment !== 'All Departments' &&
      item.department !== selectedDepartment &&
      item.department !== 'Campus Wide'
    ) {
      return false;
    }

    // Participation mode filter
    if (selectedMode !== 'All Modes' && item.mode !== selectedMode) return false;

    // Status filter (Upcoming / Expired)
    const now = new Date();
    const eventDateObj = new Date(item.eventDate);
    if (selectedStatus === 'Upcoming' && eventDateObj < now) return false;
    if (selectedStatus === 'Expired' && eventDateObj >= now) return false;

    // Deadline urgency filter
    if (selectedDeadline !== 'All Deadlines') {
      const daysLeft = getDaysRemaining(item.registrationDeadline);
      if (selectedDeadline === 'Closing Soon (≤ 3 days)') {
        if (daysLeft === null || daysLeft < 0 || daysLeft > 3) return false;
      } else if (selectedDeadline === 'Open') {
        if (daysLeft === null || daysLeft < 0) return false;
      }
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchOrg = item.organizer.toLowerCase().includes(q);
      const matchDept = item.department.toLowerCase().includes(q);
      const matchVenue = item.venue.toLowerCase().includes(q);
      const matchTags = item.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;

      if (!matchTitle && !matchDesc && !matchOrg && !matchDept && !matchVenue && !matchTags) {
        return false;
      }
    }

    return true;
  });

  // Apply sorting
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (selectedSort === 'newest') {
      return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
    }
    if (selectedSort === 'earliest_deadline') {
      return new Date(a.registrationDeadline).getTime() - new Date(b.registrationDeadline).getTime();
    }
    if (selectedSort === 'upcoming_event') {
      return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
    }
    if (selectedSort === 'most_popular') {
      return b.likes - a.likes;
    }
    return 0;
  });

  // Saved items list
  const savedAnnouncements = announcements.filter((item) => savedIds.includes(item.id));

  // Counts for hero metrics
  const hackathonCount = announcements.filter((a) => a.category === 'Hackathons').length;
  const internshipCount = announcements.filter((a) => a.category === 'Internships').length;
  const closingSoonCount = announcements.filter((a) => {
    const days = getDaysRemaining(a.registrationDeadline);
    return days !== null && days >= 0 && days <= 3;
  }).length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Related items for modal
  const relatedAnnouncements = selectedAnnouncement
    ? announcements.filter(
        (a) => a.id !== selectedAnnouncement.id && a.category === selectedAnnouncement.category
      )
    : [];


  return (
    <div className="min-h-screen flex bg-[#FFFCF8] text-[#202544]">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Main Responsive Navigation (Sidebar + Mobile Bar) */}
      <Navigation
        currentView={currentView}
        onNavigate={handleNavigate}
        savedCount={savedIds.length}
        unreadNotificationsCount={unreadNotificationsCount}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onOpenCreateModal={() => {
          setEditingAnnouncement(null);
          setIsCreateModalOpen(true);
        }}
      />

      {/* Primary Viewport Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 xl:p-10">
          {/* =========================================================================
              VIEW: HOME
             ========================================================================= */}
          {currentView === 'home' && (
            <div className="space-y-10">
              {/* Vibrant Hero Section with Campus Photography & Floating Details */}
              <HeroSection
                onNavigate={handleNavigate}
                onOpenCreateModal={() => {
                  setEditingAnnouncement(null);
                  setIsCreateModalOpen(true);
                }}
                onExplore={() => handleNavigate('all')}
                onViewEvents={() => handleNavigate('calendar')}
                totalCount={announcements.length}
                hackathonCount={hackathonCount}
                internshipCount={internshipCount}
                closingSoonCount={closingSoonCount}
              />

              {/* Quick Category Discovery Strip */}
              <section aria-label="Quick Category Discovery">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-[#202544]">
                      Explore By Track
                    </h2>
                    <p className="text-xs text-[#5D6385] mt-0.5">
                      Tailored opportunities for developers, designers, researchers & student leaders
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigate('all')}
                    className="text-xs font-bold text-[#7C6AE8] hover:text-[#6A57DE] flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                  {[
                    { label: 'Hackathons', view: 'hackathons', icon: Code2, bg: 'bg-[#FFFDF0]', border: 'border-[#FFD66B]/70', text: 'text-[#8C5E00]', iconBg: 'bg-[#FFD66B]/30 text-[#8C5E00]', count: hackathonCount },
                    { label: 'Internships', view: 'internships', icon: Briefcase, bg: 'bg-[#F2F8FE]', border: 'border-[#83C9F4]/70', text: 'text-[#1F6B92]', iconBg: 'bg-[#83C9F4]/25 text-[#1F6B92]', count: internshipCount },
                    { label: 'Competitions', view: 'competitions', icon: Trophy, bg: 'bg-[#FFF5F4]', border: 'border-[#FF8177]/70', text: 'text-[#BA3428]', iconBg: 'bg-[#FF8177]/25 text-[#BA3428]', count: 3 },
                    { label: 'Workshops', view: 'workshops', icon: GraduationCap, bg: 'bg-[#F3FAF7]', border: 'border-[#A8E6CF]/90', text: 'text-[#176B47]', iconBg: 'bg-[#A8E6CF]/35 text-[#176B47]', count: 2 },
                    { label: 'Placements', view: 'placements', icon: Building2, bg: 'bg-[#F7F4FE]', border: 'border-[#A78BFA]/70', text: 'text-[#5B38D6]', iconBg: 'bg-[#A78BFA]/25 text-[#5B38D6]', count: 1 },
                    { label: 'College Events', view: 'events', icon: CalendarDays, bg: 'bg-[#FFFDF2]', border: 'border-[#FFD66B]/70', text: 'text-[#8C5E00]', iconBg: 'bg-[#FFD66B]/30 text-[#8C5E00]', count: 1 },
                  ].map((track) => {
                    const Icon = track.icon;
                    return (
                      <button
                        key={track.label}
                        onClick={() => handleNavigate(track.view as NavigationView)}
                        className={`p-4 rounded-2xl border ${track.bg} ${track.border} text-left transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl ${track.iconBg} flex items-center justify-center mb-3 shadow-xs`}
                        >
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <h4 className={`text-xs sm:text-sm font-bold ${track.text}`}>
                          {track.label}
                        </h4>
                        <span className="text-[11px] text-[#717799] mt-0.5 block tabular-nums">
                          {track.count} active listing{track.count === 1 ? '' : 's'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Featured & Priority Opportunities Feed */}
              <section aria-label="Featured Campus Opportunities">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#7C6AE8]" />
                    <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-[#202544]">
                      Featured Opportunities
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-[#5D6385]">
                    Hand-picked by Student Affairs
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {announcements
                    .filter((a) => a.featured || a.likes > 70)
                    .slice(0, 6)
                    .map((item) => (
                      <AnnouncementCard
                        key={item.id}
                        announcement={item}
                        isSaved={savedIds.includes(item.id)}
                        onToggleSave={handleToggleSave}
                        onToggleLike={handleToggleLike}
                        onShare={handleShare}
                        onViewDetails={(a) => setSelectedAnnouncement(a)}
                      />
                    ))}
                </div>
              </section>
            </div>
          )}

          {/* =========================================================================
              VIEW: ALL ANNOUNCEMENTS & CATEGORY DEDICATED PAGES
             ========================================================================= */}
          {[
            'all',
            'hackathons',
            'internships',
            'competitions',
            'workshops',
            'placements',
            'events',
          ].includes(currentView) && (
            <div className="space-y-6">
              {/* Category Page Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8E8F2]">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#202544]">
                    {currentView === 'all'
                      ? 'All Campus Opportunities'
                      : currentView.charAt(0).toUpperCase() + currentView.slice(1)}
                  </h1>
                  <p className="text-xs text-[#5D6385] mt-1">
                    Discover and apply directly to verified college programs, deadlines, and hackathons
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingAnnouncement(null);
                    setIsCreateModalOpen(true);
                  }}
                  className="btn-pill px-4.5 py-2.5 bg-[#7C6AE8] hover:bg-[#6A57DE] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs self-start sm:self-auto cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Post Listing</span>
                </button>
              </div>

              {/* Comprehensive Filter Toolbar */}
              <FilterToolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedDepartment={selectedDepartment}
                setSelectedDepartment={setSelectedDepartment}
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                selectedDeadline={selectedDeadline}
                setSelectedDeadline={setSelectedDeadline}
                selectedSort={selectedSort}
                setSelectedSort={setSelectedSort}
                onResetFilters={handleResetFilters}
                hasActiveFilters={hasActiveFilters}
                totalResults={sortedAnnouncements.length}
              />

              {/* Cards Grid or Empty State */}
              {sortedAnnouncements.length === 0 ? (
                <div className="p-12 sm:p-16 text-center rounded-[2rem] bg-white border border-[#E8E8F2] shadow-xs flex flex-col items-center justify-center">
                  <Layers className="w-12 h-12 text-[#8A90B2] mb-3" />
                  <h3 className="text-lg font-bold font-heading text-[#202544]">
                    No matching opportunities found
                  </h3>
                  <p className="text-xs text-[#5D6385] max-w-sm mt-1 mb-5">
                    Try clearing keywords or adjusting the department, mode, or deadline filters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="btn-pill px-5 py-2.5 bg-[#7C6AE8] hover:bg-[#6A57DE] text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedAnnouncements.map((item) => (
                    <AnnouncementCard
                      key={item.id}
                      announcement={item}
                      isSaved={savedIds.includes(item.id)}
                      onToggleSave={handleToggleSave}
                      onToggleLike={handleToggleLike}
                      onShare={handleShare}
                      onViewDetails={(a) => setSelectedAnnouncement(a)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW: SAVED ITEMS
             ========================================================================= */}
          {currentView === 'saved' && (
            <SavedItemsView
              savedAnnouncements={savedAnnouncements}
              onToggleSave={handleToggleSave}
              onToggleLike={handleToggleLike}
              onShare={handleShare}
              onViewDetails={(a) => setSelectedAnnouncement(a)}
              onExplore={() => handleNavigate('all')}
              onClearAllSaved={() => {
                setSavedIds([]);
                addToast('All Bookmarks Cleared', 'Your saved collection is now empty.', 'info');
              }}
            />
          )}

          {/* =========================================================================
              VIEW: CALENDAR & DEADLINES
             ========================================================================= */}
          {currentView === 'calendar' && (
            <CalendarView
              announcements={announcements}
              onViewDetails={(a) => setSelectedAnnouncement(a)}
            />
          )}

          {/* =========================================================================
              VIEW: NOTIFICATIONS
             ========================================================================= */}
          {currentView === 'notifications' && (
            <NotificationsCenter
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onSelectAnnouncementById={handleSelectAnnouncementById}
            />
          )}

          {/* =========================================================================
              VIEW: ADMIN DASHBOARD
             ========================================================================= */}
          {currentView === 'admin' && (
            <AdminDashboard
              announcements={announcements}
              onCreateNew={() => {
                setEditingAnnouncement(null);
                setIsCreateModalOpen(true);
              }}
              onEdit={(item) => {
                setEditingAnnouncement(item);
                setIsCreateModalOpen(true);
              }}
              onDelete={handleDeleteAnnouncement}
              onTogglePublish={handleTogglePublish}
              onResolveReports={handleResolveReports}
            />
          )}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-[#E8E8F2] py-8 px-6 mt-16 bg-white text-[#5D6385]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#202544] font-heading">Campus Connect</span>
              <span>•</span>
              <span>One campus. One voice.</span>
              <span>•</span>
              <span className="text-[#7C6AE8] font-semibold">Student Opportunities Platform</span>
            </div>
            <div className="flex items-center gap-4 text-[#8A90B2]">
              <span>Verified Campus Gateway</span>
              <span>•</span>
              <span>Autumn 2026</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Opportunity Details Dedicated Modal */}
      {selectedAnnouncement && (
        <OpportunityDetailsModal
          announcement={selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
          isSaved={savedIds.includes(selectedAnnouncement.id)}
          onToggleSave={handleToggleSave}
          onToggleLike={handleToggleLike}
          onShare={handleShare}
          onAddComment={handleAddComment}
          onReport={handleReport}
          relatedAnnouncements={relatedAnnouncements}
          onSelectRelated={(related) => setSelectedAnnouncement(related)}
        />
      )}

      {/* Create / Edit Announcement Modal */}
      <CreateEditModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingAnnouncement(null);
        }}
        onSave={handleSaveAnnouncement}
        initialData={editingAnnouncement}
      />
    </div>
  );
}
