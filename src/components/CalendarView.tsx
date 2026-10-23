import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { Announcement } from '../types';
import { formatDate, getDeadlineStatus } from '../utils/helpers';

interface CalendarViewProps {
  announcements: Announcement[];
  onViewDetails: (announcement: Announcement) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  announcements,
  onViewDetails,
}) => {
  // Base current month view state (Defaults to October 2026 based on collegiate dataset)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // October 2026 (0-indexed month 9)
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Compute days in month
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Find announcements that have eventDate or registrationDeadline in this year/month
  const getEventsForDay = (day: number) => {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const monthStr = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    const targetDateIso = `${year}-${monthStr}-${dayStr}`;

    return announcements.filter((item) => {
      const isEventDay = item.eventDate === targetDateIso;
      const isDeadlineDay = item.registrationDeadline === targetDateIso;
      return isEventDay || isDeadlineDay;
    });
  };

  // Selected day events or all upcoming events for the month
  const activeEvents = selectedDay
    ? getEventsForDay(selectedDay)
    : announcements.filter((item) => {
        const d = new Date(item.eventDate);
        return d.getMonth() === month && d.getFullYear() === year;
      });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Calendar Header & Month Navigation */}
      <div className="p-6 rounded-[2rem] bg-white border border-[#E8E8F2] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#F2EFFB] border border-[#E8E8F2] flex items-center justify-center text-[#7C6AE8] shadow-xs">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-[#202544]">
              {monthName} {year}
            </h2>
            <p className="text-xs text-[#717799] mt-0.5">
              Campus Deadlines, Hackathons & Key Academic Milestones
            </p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="btn-pill p-2.5 rounded-full border border-[#E8E8F2] bg-white text-[#474D6E] hover:text-[#202544] hover:bg-[#F8F8FC] cursor-pointer"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => {
              setCurrentDate(new Date(2026, 9, 1));
              setSelectedDay(null);
            }}
            className="btn-pill px-4 py-2 rounded-full border border-[#E8E8F2] bg-white text-xs font-bold text-[#202544] hover:bg-[#F2EFFB] cursor-pointer"
          >
            October 2026
          </button>
          <button
            onClick={handleNextMonth}
            className="btn-pill p-2.5 rounded-full border border-[#E8E8F2] bg-white text-[#474D6E] hover:text-[#202544] hover:bg-[#F8F8FC] cursor-pointer"
            aria-label="Next month"
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Calendar Matrix & Side Event List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Calendar Grid: 7-Column Layout */}
        <div className="lg:col-span-7 p-6 rounded-[2rem] bg-white border border-[#E8E8F2] shadow-sm">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-2 mb-3 text-center text-xs font-bold uppercase tracking-wider text-[#8A90B2]">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Blank offset tiles */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="aspect-square rounded-2xl bg-transparent opacity-0 pointer-events-none"
              />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const events = getEventsForDay(day);
              const isSelected = selectedDay === day;
              const hasEvents = events.length > 0;

              return (
                <button
                  key={`day-${day}`}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className={`aspect-square rounded-2xl p-2 flex flex-col justify-between items-center transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#7C6AE8] text-white border-[#7C6AE8] shadow-md shadow-[#7C6AE8]/30 scale-105 z-10'
                      : hasEvents
                      ? 'bg-[#FAF8FE] text-[#202544] border-[#DCD9EE] hover:border-[#7C6AE8]'
                      : 'bg-white text-[#5D6385] border-[#F0F0F8] hover:bg-[#FAF8FE]'
                  }`}
                >
                  <span className="text-xs font-bold tabular-nums">{day}</span>

                  {hasEvents && (
                    <div className="flex items-center gap-1">
                      {events.slice(0, 3).map((e, idx) => (
                        <span
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected
                              ? 'bg-[#FFD66B]'
                              : e.category === 'Hackathons'
                              ? 'bg-[#FF8177]'
                              : e.category === 'Internships'
                              ? 'bg-[#83C9F4]'
                              : 'bg-[#7C6AE8]'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-5 mt-6 pt-5 border-t border-[#E8E8F2] text-xs text-[#5D6385] font-semibold flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF8177]" />
              <span>Hackathons</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#83C9F4]" />
              <span>Internships</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7C6AE8]" />
              <span>Events & Deadlines</span>
            </div>
          </div>
        </div>

        {/* Side Panel: Events for Selected Day or Month Overview */}
        <div className="lg:col-span-5 p-6 rounded-[2rem] bg-white border border-[#E8E8F2] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#E8E8F2]">
            <h3 className="text-base font-bold font-heading text-[#202544]">
              {selectedDay
                ? `Events on ${monthName} ${selectedDay}, ${year}`
                : `Upcoming in ${monthName} ${year}`}
            </h3>
            {selectedDay && (
              <button
                onClick={() => setSelectedDay(null)}
                className="text-xs font-bold text-[#7C6AE8] hover:underline cursor-pointer"
              >
                View all month
              </button>
            )}
          </div>

          {activeEvents.length === 0 ? (
            <div className="py-12 text-center text-[#8A90B2] text-xs font-medium">
              No events scheduled for this day. Select another date!
            </div>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {activeEvents.map((item) => {
                const deadline = getDeadlineStatus(item.registrationDeadline);
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#FFFCF8] border border-[#E8E8F2] hover:border-[#7C6AE8] transition-all space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C6AE8]">
                        {item.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          deadline.status === 'urgent'
                            ? 'bg-[#FF8177]/20 text-[#C93B2F] border-[#FF8177]/50'
                            : 'bg-[#FFD66B]/30 text-[#8C5E00] border-[#FFD66B]/60'
                        }`}
                      >
                        {deadline.label}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#202544] line-clamp-1">
                      {item.title}
                    </h4>

                    <div className="space-y-1 text-xs text-[#5D6385]">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-[#FF8177] shrink-0" />
                        <span>Event: {formatDate(item.eventDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#83C9F4] shrink-0" />
                        <span className="truncate">{item.venue}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E8E8F2] flex items-center justify-between">
                      <span className="text-[11px] text-[#8A90B2] font-mono">
                        Deadline: {formatDate(item.registrationDeadline)}
                      </span>
                      <button
                        onClick={() => onViewDetails(item)}
                        className="btn-pill px-3 py-1 bg-[#7C6AE8] hover:bg-[#6A57DE] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
