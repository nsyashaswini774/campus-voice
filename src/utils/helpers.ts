export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function isValidHttpUrl(stringUrl: string): boolean {
  try {
    const url = new URL(stringUrl);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function getDaysRemaining(deadlineDateStr: string): number | null {
  try {
    const deadline = new Date(deadlineDateStr);
    if (isNaN(deadline.getTime())) return null;
    const now = new Date();
    // Reset hours to compare calendar days
    deadline.setHours(23, 59, 59, 999);
    const diffMs = deadline.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}

export function getDeadlineStatus(deadlineDateStr: string): {
  label: string;
  status: 'urgent' | 'closing_soon' | 'open' | 'closed';
  badgeClass: string;
} {
  const days = getDaysRemaining(deadlineDateStr);
  if (days === null) {
    return {
      label: 'Open',
      status: 'open',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    };
  }

  if (days < 0) {
    return {
      label: 'Deadline Passed',
      status: 'closed',
      badgeClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    };
  }

  if (days === 0) {
    return {
      label: 'Closes Today!',
      status: 'urgent',
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse',
    };
  }

  if (days <= 3) {
    return {
      label: `${days} day${days > 1 ? 's' : ''} left`,
      status: 'closing_soon',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    };
  }

  return {
    label: `${days} days left`,
    status: 'open',
    badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  };
}
