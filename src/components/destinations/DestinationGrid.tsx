import DestinationCard from './DestinationCard';
import type { Destination } from '@/lib/types';

export default function DestinationGrid({ destinations }: { destinations: Destination[] }) {
  if (destinations.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-sm mb-4">
          <svg className="w-7 h-7 text-dark/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-dark/40 font-medium">No destinations match your filters.</p>
        <p className="text-dark/25 text-sm mt-1">Try removing some filters to see more results.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {destinations.map((dest, i) => (
        <div
          key={dest.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${Math.min(i * 40, 400)}ms`, animationFillMode: 'both' }}
        >
          <DestinationCard destination={dest} />
        </div>
      ))}
    </div>
  );
}
