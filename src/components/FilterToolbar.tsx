import React, { useState } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import {
  Category,
  Department,
  ParticipationMode,
  StatusFilter,
  DeadlineFilter,
  SortOption,
} from '../types';

interface FilterToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  selectedDepartment: Department;
  setSelectedDepartment: (dept: Department) => void;
  selectedMode: ParticipationMode;
  setSelectedMode: (mode: ParticipationMode) => void;
  selectedStatus: StatusFilter;
  setSelectedStatus: (status: StatusFilter) => void;
  selectedDeadline: DeadlineFilter;
  setSelectedDeadline: (deadline: DeadlineFilter) => void;
  selectedSort: SortOption;
  setSelectedSort: (sort: SortOption) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  totalResults: number;
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

const DEPARTMENTS: Department[] = [
  'All Departments',
  'Computer Science & Eng',
  'Electronics & Comm',
  'Mechanical & Robotics',
  'Management & Business',
  'Design & Media',
  'Biotechnology',
  'Campus Wide',
];

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedDepartment,
  setSelectedDepartment,
  selectedMode,
  setSelectedMode,
  selectedStatus,
  setSelectedStatus,
  selectedDeadline,
  setSelectedDeadline,
  selectedSort,
  setSelectedSort,
  onResetFilters,
  hasActiveFilters,
  totalResults,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  return (
    <div className="space-y-4 mb-8">
      {/* Top Search Input & Action Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Rounded Pill Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#717799]">
            <Search className="w-4.5 h-4.5 text-[#7C6AE8]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, club, department, tech stack, or eligibility..."
            className="w-full pl-11 pr-10 py-3 rounded-full text-sm font-medium bg-white border border-[#E8E8F2] text-[#202544] placeholder:text-[#8A90B2] focus:border-[#7C6AE8] focus:ring-3 focus:ring-[#7C6AE8]/15 shadow-xs outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8A90B2] hover:text-[#202544] cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & Filter Toggle Controls */}
        <div className="flex items-center gap-2.5">
          {/* Sort Pill Dropdown */}
          <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white border border-[#E8E8F2] text-xs font-bold text-[#202544] shadow-xs shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#FF8177] shrink-0" />
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as SortOption)}
              className="bg-transparent outline-none cursor-pointer font-bold text-[#202544]"
            >
              <option value="newest">Newest First</option>
              <option value="earliest_deadline">Earliest Deadline</option>
              <option value="upcoming_event">Upcoming Event Date</option>
              <option value="most_popular">Most Popular</option>
            </select>
          </div>

          {/* Toggle More Filters Pill */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`btn-pill flex items-center gap-1.5 px-4 py-2.5 border text-xs font-bold shadow-xs cursor-pointer shrink-0 ${
              showAdvancedFilters || hasActiveFilters
                ? 'bg-[#7C6AE8] text-white border-[#7C6AE8]'
                : 'bg-white border-[#E8E8F2] text-[#474D6E] hover:text-[#202544] hover:bg-[#F8F8FC]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {/* Clear Filters Button (Visible if active) */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="btn-pill flex items-center gap-1 px-3.5 py-2.5 bg-[#FF8177]/15 hover:bg-[#FF8177]/25 text-[#BA3428] border border-[#FF8177]/30 text-xs font-bold transition-all cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pastel Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`btn-pill px-4 py-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-[#7C6AE8] text-white border-[#7C6AE8] shadow-xs'
                  : 'bg-white text-[#474D6E] hover:text-[#202544] hover:bg-[#F2EFFB] border-[#E8E8F2]'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Advanced Collapsible Filter Drawer */}
      {showAdvancedFilters && (
        <div className="p-5 rounded-3xl bg-white border border-[#E8E8F2] shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-150">
          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#717799] mb-1.5">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value as Department)}
              className="w-full px-3.5 py-2 rounded-xl text-xs font-bold outline-none border border-[#E8E8F2] bg-[#FFFCF8] text-[#202544] focus:border-[#7C6AE8]"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#717799] mb-1.5">
              Event Mode
            </label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value as ParticipationMode)}
              className="w-full px-3.5 py-2 rounded-xl text-xs font-bold outline-none border border-[#E8E8F2] bg-[#FFFCF8] text-[#202544] focus:border-[#7C6AE8]"
            >
              <option value="All Modes">All Modes</option>
              <option value="Online">Online Only</option>
              <option value="Offline">On Campus (Offline)</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Deadline Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#717799] mb-1.5">
              Deadline Urgency
            </label>
            <select
              value={selectedDeadline}
              onChange={(e) => setSelectedDeadline(e.target.value as DeadlineFilter)}
              className="w-full px-3.5 py-2 rounded-xl text-xs font-bold outline-none border border-[#E8E8F2] bg-[#FFFCF8] text-[#202544] focus:border-[#7C6AE8]"
            >
              <option value="All Deadlines">All Deadlines</option>
              <option value="Closing Soon (≤ 3 days)">Closing Soon (≤ 3 days)</option>
              <option value="Open">Currently Open</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#717799] mb-1.5">
              Listing Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as StatusFilter)}
              className="w-full px-3.5 py-2 rounded-xl text-xs font-bold outline-none border border-[#E8E8F2] bg-[#FFFCF8] text-[#202544] focus:border-[#7C6AE8]"
            >
              <option value="All Status">All Status</option>
              <option value="Upcoming">Upcoming Only</option>
              <option value="Expired">Expired Listings</option>
            </select>
          </div>
        </div>
      )}

      {/* Active Results Summary */}
      <div className="flex items-center justify-between text-xs text-[#5D6385] font-semibold px-2">
        <div>
          Showing <span className="font-bold text-[#7C6AE8] tabular-nums">{totalResults}</span>{' '}
          opportunities
          {searchQuery && (
            <span>
              {' '}
              matching &ldquo;<span className="text-[#FF8177]">{searchQuery}</span>&rdquo;
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-[#FF8177] hover:underline cursor-pointer"
          >
            Reset all filters
          </button>
        )}
      </div>
    </div>
  );
};
