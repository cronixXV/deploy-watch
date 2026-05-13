import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';

export function getSortIcon(sortDirection: false | 'asc' | 'desc') {
  if (sortDirection === 'asc') {
    return <ChevronUp size={14} />;
  }

  if (sortDirection === 'desc') {
    return <ChevronDown size={14} />;
  }

  return <ChevronsUpDown size={14} />;
}
