import DestinationCard from './DestinationCard';
import type { Destination } from '@/lib/types';

export default function DestinationGrid({ destinations }: { destinations: Destination[] }) {
  if (destinations.length === 0) {
    return (
      <div className="text-center py-16 text-dark/40">
        <p className="text-lg">No destinations found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {destinations.map((dest) => (
        <DestinationCard key={dest.id} destination={dest} />
      ))}
    </div>
  );
}
