import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { Announcement, Category, Department, ParticipationMode } from '../types';
import { isValidHttpUrl } from '../utils/helpers';

interface CreateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (announcement: Partial<Announcement>) => void;
  initialData?: Announcement | null;
}

const CATEGORIES: Exclude<Category, 'All'>[] = [
  'Hackathons',
  'Internships',
  'Competitions',
  'Workshops',
  'Placements',
  'College Events',
  'Academic',
];

const DEPARTMENTS: Department[] = [
  'Computer Science & Eng',
  'Electronics & Comm',
  'Mechanical & Robotics',
  'Management & Business',
  'Design & Media',
  'Biotechnology',
  'Campus Wide',
];

export const CreateEditModal: React.FC<CreateEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Exclude<Category, 'All'>>('Hackathons');
  const [department, setDepartment] = useState<Department>('Computer Science & Eng');
  const [organizer, setOrganizer] = useState('');
  const [eventDate, setEventDate] = useState('2026-11-15');
  const [registrationDeadline, setRegistrationDeadline] = useState('2026-11-10');
  const [venue, setVenue] = useState('Campus Innovation Hub & Online');
  const [mode, setMode] = useState<ParticipationMode>('Hybrid');
  const [eligibility, setEligibility] = useState('Open to all registered university students');
  const [fees, setFees] = useState('Free of cost');
  const [sourceUrl, setSourceUrl] = useState('https://campus.edu/events');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [urlError, setUrlError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setCategory(initialData.category);
      setDepartment(initialData.department);
      setOrganizer(initialData.organizer);
      setEventDate(initialData.eventDate);
      setRegistrationDeadline(initialData.registrationDeadline);
      setVenue(initialData.venue);
      setMode(initialData.mode);
      setEligibility(initialData.eligibility);
      setFees(initialData.fees);
      setSourceUrl(initialData.sourceUrl);
      setStatus(initialData.status);
    } else {
      // Default blank values
      setTitle('');
      setDescription('');
      setCategory('Hackathons');
      setDepartment('Computer Science & Eng');
      setOrganizer('');
      setEventDate('2026-11-15');
      setRegistrationDeadline('2026-11-10');
      setVenue('Campus Innovation Hub & Online');
      setMode('Hybrid');
      setEligibility('All undergraduate and postgraduate students');
      setFees('Free of cost');
      setSourceUrl('https://campus.edu/opportunities');
      setStatus('published');
    }
    setUrlError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidHttpUrl(sourceUrl)) {
      setUrlError('Please enter a valid HTTP or HTTPS URL (e.g., https://example.com).');
      return;
    }

    onSave({
      id: initialData ? initialData.id : `ann-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      department,
      organizer: organizer.trim() || 'Campus Authority',
      publicationDate: initialData ? initialData.publicationDate : new Date().toISOString().split('T')[0],
      eventDate,
      registrationDeadline,
      venue: venue.trim(),
      mode: mode === 'All Modes' ? 'Hybrid' : mode,
      eligibility: eligibility.trim(),
      fees: fees.trim() || 'Free of cost',
      sourceUrl: sourceUrl.trim(),
      status,
      isVerified: true,
      tags: [category, department.split(' ')[0]],
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#202544]/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl my-6 rounded-[2rem] bg-[#FFFCF8] border border-[#E8E8F2] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-[#202544]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E8E8F2] bg-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F2EFFB] border border-[#E8E8F2] text-[#7C6AE8] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-[#7C6AE8]" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-[#202544]">
                {initialData ? 'Edit Campus Opportunity' : 'Post Campus Opportunity'}
              </h3>
              <p className="text-xs text-[#717799]">
                Authorized Club, Department & Placement Broadcast
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-pill p-2 rounded-full bg-[#FAF8FE] border border-[#E8E8F2] text-[#5D6385] hover:text-[#202544] hover:bg-[#F2EFFB] cursor-pointer"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#717799] mb-1">
              Opportunity Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. HackNova 2026: 36-Hour National AI Hackathon"
              className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold outline-none border border-[#E8E8F2] bg-white text-[#202544] placeholder:text-[#8A90B2] focus:border-[#7C6AE8] focus:ring-2 focus:ring-[#7C6AE8]/15"
            />
          </div>

          {/* Category & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#717799] mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Exclude<Category, 'All'>)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none border border-[#E8E8F2] bg-white text-[#202544] focus:border-[#7C6AE8]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#717799] mb-1">
                Department *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none border border-[#E8E8F2] bg-white text-[#202544] focus:border-[#7C6AE8]"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Organizer */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#717799] mb-1">
              Organizer / Club / Society *
            </label>
            <input
              type="text"
              required
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              placeholder="e.g. Developer Student Club & ACM Student Chapter"
              className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold outline-none border border-[#E8E8F2] bg-white text-[#202544] focus:border-[#7C6AE8]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#717799] mb-1">
              Detailed Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide complete event scope, prizes, schedule, and deliverables..."
              className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm font-normal outline-none border border-[#E8E8F2] bg-white text-[#202544] focus:border-[#7C6AE8]"
            />
          </div>

          {/* Event Date & Registration Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#717799] mb-1">
                Event Date *
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none border border-[#E8E8F2] bg-white text-[#202544] focus:border-[#7C6AE8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#717799] mb-1">
                Registration Deadline *
              </label>
              <input
                type="date"
                required
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none border border-[#E8E8F2] bg-white text-[#202544] focus:border-[#7C6AE8]"
              />
            </div>
          </div>

          {/* Venue & Participation Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#717799] mb-1">
                Venue / Location *
              </label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Main Auditorium Hall A & Discord"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none border border-[#E8E8F2] bg-white text-[#202544] focus:border-[#7C6AE8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#717799] mb-1">
                Participation Mode *
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as ParticipationMode)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none border border-[#E8E8F2] bg-white text-[#202544] focus:border-[#7C6AE8]"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Online">Online Only</option>
                <option value="Offline">Offline (On Campus)</option>
              </select>
            </div>
          </div>

          {/* Eligibility & Fees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#717799] mb-1">
                Eligibility *
              </label>
              <input
                type="text"
                required
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                placeholder="e.g. Open to all enrolled undergraduate students"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none border border-[#E8E8F2] bg-white text-[#202544] focus:border-[#7C6AE8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#717799] mb-1">
                Fees / Registration Cost *
              </label>
              <input
                type="text"
                required
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                placeholder="e.g. Free of cost"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none border border-[#E8E8F2] bg-white text-[#202544] focus:border-[#7C6AE8]"
              />
            </div>
          </div>

          {/* Official Source URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#717799] mb-1">
              Official Application URL *
            </label>
            <input
              type="url"
              required
              value={sourceUrl}
              onChange={(e) => {
                setSourceUrl(e.target.value);
                setUrlError('');
              }}
              placeholder="https://example.com/apply"
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono outline-none border ${
                urlError
                  ? 'border-[#FF8177] focus:border-[#FF8177]'
                  : 'border-[#E8E8F2] bg-white text-[#202544] focus:border-[#7C6AE8]'
              }`}
            />
            {urlError && (
              <p className="text-[11px] text-[#C93B2F] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{urlError}</span>
              </p>
            )}
          </div>

          {/* Publication Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#717799] mb-1">
              Publication Status
            </label>
            <div className="flex items-center gap-4 text-xs font-semibold text-[#474D6E]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === 'published'}
                  onChange={() => setStatus('published')}
                  className="accent-[#7C6AE8]"
                />
                <span>Published (Live to students)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                  className="accent-[#7C6AE8]"
                />
                <span>Draft (Internal review)</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-[#E8E8F2] flex items-center justify-end gap-3 sticky bottom-0 bg-[#FFFCF8] py-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-pill px-4 py-2 text-xs font-bold text-[#5D6385] hover:text-[#202544] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-pill px-6 py-2.5 bg-[#7C6AE8] hover:bg-[#6A57DE] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#7C6AE8]/20 cursor-pointer"
            >
              {initialData ? 'Save Changes' : 'Broadcast Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
