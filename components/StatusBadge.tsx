
import React from 'react';
import { EntityStatus } from '../types';

interface StatusBadgeProps {
  status: EntityStatus | 'Active' | 'Closed' | 'Unapproved' | 'Approved';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let colorClass = 'bg-gray-100 text-gray-800';

  switch (status) {
    case EntityStatus.ACTIVE:
    case 'Active':
    case 'Approved':
      colorClass = 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20';
      break;
    case EntityStatus.PENDING:
    case 'Unapproved':
      colorClass = 'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-600/20 animate-pulse';
      break;
    case EntityStatus.SUSPENDED:
      colorClass = 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-600/20';
      break;
    case EntityStatus.DISSOLVING:
      colorClass = 'bg-orange-100 text-orange-800 ring-1 ring-inset ring-orange-600/20';
      break;
    case EntityStatus.CLOSED:
    case 'Closed':
      colorClass = 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-600/20';
      break;
  }

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${colorClass}`}>
      {status === EntityStatus.PENDING || status === 'Unapproved' ? 'Chờ Duyệt' : 
       status === EntityStatus.ACTIVE || status === 'Approved' ? 'Đã Duyệt' : status}
    </span>
  );
};
