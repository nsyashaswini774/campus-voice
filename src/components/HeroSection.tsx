import React from 'react';
import {
  Compass,
  Sparkles,
  CalendarDays,
  PlusCircle,
  Trophy,
  ArrowRight,
  Clock,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Users,
} from 'lucide-react';
import { NavigationView } from '../types';
import campusHeroImg from '../assets/images/campus_hero_students_1792080828830.jpg';

interface HeroSectionProps {
  onNavigate: (view: NavigationView) => void;
  onOpenCreateModal: () => void;
  onExplore: () => void;
  onViewEvents: () => void;
  totalCount: number;
  hackathonCount: number;
  internshipCount: number;
  closingSoonCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenCreateModal,
  onExplore,
  onViewEvents,
  totalCount,
  hackathonCount,
  internshipCount,
  closingSoonCount,
}) => {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#F5EFFF] via-[#FFFDF9] to-[#FFFCF8] border border-[#E8E8F2] shadow-sm mb-12">
      {/* Subtle Pastel Accent Blobs */}
      <div
        className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-[#A78BFA]/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-[#FFD66B]/20 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-[#A8E6CF]/25 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 p-6 sm:p-10 lg:p-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 space-y-6">
            {/* Top Friendly Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E8F2] shadow-xs text-xs font-bold text-[#7C6AE8]">
              <span className="w-2 h-2 rounded-full bg-[#7C6AE8] animate-ping" />
              <span>Campus Connect • Autumn 2026 Live Portal</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading text-[#202544] leading-[1.08]">
              Your next big{' '}
              <span className="relative inline-block text-[#7C6AE8]">
                opportunity
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-[#FFD66B]"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M0 7C25 1 75 1 100 7C75 12 25 12 0 7Z"
                    fill="currentColor"
                  />
                </svg>
              </span>{' '}
              starts here.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#474D6E] max-w-xl font-normal leading-relaxed">
              Discover hackathons, internships, competitions, workshops, placements, and campus events. Everything you need to thrive in your university journey, in one beautiful place.
            </p>

            {/* Cute, Interactive Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Primary Button */}
              <button
                onClick={onExplore}
                className="btn-pill px-6 py-3.5 bg-[#7C6AE8] hover:bg-[#6A57DE] text-white font-bold text-sm sm:text-base shadow-md shadow-[#7C6AE8]/25 flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4.5 h-4.5" />
                <span>Explore Opportunities</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              {/* Secondary Action: Discover Events */}
              <button
                onClick={onViewEvents}
                className="btn-pill px-5 py-3.5 bg-white hover:bg-[#F6F5FD] text-[#202544] border border-[#E8E8F2] font-bold text-sm sm:text-base shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <CalendarDays className="w-4.5 h-4.5 text-[#FF8177]" />
                <span>Discover Events</span>
              </button>

              {/* Post Announcement Action */}
              <button
                onClick={onOpenCreateModal}
                className="btn-pill px-4 py-3 bg-[#FFFCF8] hover:bg-[#F2EFFB] text-[#7C6AE8] border border-[#DCD9EE] font-semibold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
                title="Post an announcement for your student club or department"
              >
                <PlusCircle className="w-4 h-4 text-[#7C6AE8]" />
                <span>+ Post Listing</span>
              </button>
            </div>

            {/* Trust Pill Indicators */}
            <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-[#5D6385] font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#7C6AE8]" />
                <span>100% Verified Campus Sources</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#FF8177]" />
                <span>Open to All Student Clubs</span>
              </div>
            </div>
          </div>

          {/* Right Column: Large Professional Campus Photograph & Floating Cards */}
          <div className="lg:col-span-6 relative">
            {/* The Main High-Quality Campus Photo */}
            <div className="relative rounded-[2rem] overflow-hidden border-4 border-white shadow-xl aspect-[16/10] sm:aspect-[16/9] group">
              <img
                src={campusHeroImg}
                alt="University students collaborating around laptops in an airy campus innovation center"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="eager"
              />
              {/* Subtle Warm Gradient Scrim on Image Corner */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#202544]/50 via-transparent to-transparent pointer-events-none" />

              {/* Bottom Image Caption */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold drop-shadow-sm">
                <span className="bg-[#202544]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  📍 University Innovation Commons
                </span>
                <span className="hidden sm:inline bg-white/90 text-[#202544] backdrop-blur-md px-3 py-1 rounded-full border border-[#E8E8F2]">
                  🍁 Autumn Semester 2026
                </span>
              </div>
            </div>

            {/* Floating Cute Tag 1: Active Hackathons */}
            <div className="hidden sm:flex absolute -top-4 -right-4 p-3.5 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E8E8F2] shadow-lg items-center gap-3 animate-in slide-in-from-top-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFD66B]/30 text-[#202544] flex items-center justify-center font-bold">
                <Trophy className="w-5 h-5 text-[#B88700]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#202544]">
                  {hackathonCount} Active Hackathon{hackathonCount === 1 ? '' : 's'}
                </div>
                <div className="text-[11px] text-[#717799]">
                  Over $15,000 in student grants
                </div>
              </div>
            </div>

            {/* Floating Cute Tag 2: Deadlines Countdown */}
            <div className="hidden sm:flex absolute -bottom-5 -left-4 p-3.5 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E8E8F2] shadow-lg items-center gap-3 animate-in slide-in-from-bottom-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF8177]/20 text-[#FF8177] flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#202544]">
                  {closingSoonCount} Closing Soon
                </div>
                <div className="text-[11px] text-[#717799]">
                  Apply before weekend deadlines
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Strip Below Hero */}
        <div className="mt-10 pt-8 border-t border-[#E8E8F2] grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-[#E8E8F2] shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#7C6AE8] font-heading tabular-nums">
              {totalCount}
            </div>
            <div className="text-xs text-[#5D6385] font-semibold mt-0.5">
              Total Opportunities
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E8E8F2] shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FF8177] font-heading tabular-nums">
              {internshipCount}
            </div>
            <div className="text-xs text-[#5D6385] font-semibold mt-0.5 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-[#FF8177]" />
              <span>Internships</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E8E8F2] shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#B88700] font-heading tabular-nums">
              {hackathonCount}
            </div>
            <div className="text-xs text-[#5D6385] font-semibold mt-0.5 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-[#FFD66B]" />
              <span>Hackathons</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E8E8F2] shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#2F9E75] font-heading tabular-nums">
              {closingSoonCount}
            </div>
            <div className="text-xs text-[#5D6385] font-semibold mt-0.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#A8E6CF]" />
              <span>Urgent Deadlines</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
