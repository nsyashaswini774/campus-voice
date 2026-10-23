export type Category =
  | 'All'
  | 'Hackathons'
  | 'Internships'
  | 'Competitions'
  | 'Workshops'
  | 'Placements'
  | 'College Events'
  | 'Academic';

export type Department =
  | 'All Departments'
  | 'Computer Science & Eng'
  | 'Electronics & Comm'
  | 'Mechanical & Robotics'
  | 'Management & Business'
  | 'Design & Media'
  | 'Biotechnology'
  | 'Campus Wide';

export type ParticipationMode = 'All Modes' | 'Online' | 'Offline' | 'Hybrid';

export type StatusFilter = 'All Status' | 'Upcoming' | 'Expired';

export type DeadlineFilter = 'All Deadlines' | 'Closing Soon (≤ 3 days)' | 'Open';

export type SortOption =
  | 'newest'
  | 'earliest_deadline'
  | 'upcoming_event'
  | 'most_popular';

export interface Comment {
  id: string;
  author: string;
  role?: string;
  text: string;
  timestamp: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  category: Exclude<Category, 'All'>;
  department: Department;
  organizer: string;
  publicationDate: string; // ISO date or display string
  eventDate: string; // ISO date or formatted
  registrationDeadline: string; // ISO date YYYY-MM-DD for accurate comparison
  venue: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  eligibility: string;
  fees: string;
  sourceUrl: string;
  status: 'published' | 'draft';
  isVerified: boolean;
  likes: number;
  isLiked?: boolean;
  comments: Comment[];
  reportsCount: number;
  featured?: boolean;
  imageUrl?: string;
  tags: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'announcement' | 'deadline' | 'system';
  announcementId?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export type NavigationView =
  | 'home'
  | 'all'
  | 'hackathons'
  | 'internships'
  | 'competitions'
  | 'workshops'
  | 'placements'
  | 'events'
  | 'saved'
  | 'calendar'
  | 'notifications'
  | 'admin';
