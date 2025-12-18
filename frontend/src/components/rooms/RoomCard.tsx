import { Room } from '@/types';
import { Button } from '@/components/ui/button';
import { Users, Maximize, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomCardProps {
  room: Room;
}

export const RoomCard = ({ room }: RoomCardProps) => {
  const typeColors = {
    deluxe: 'bg-sage text-forest',
    executive: 'bg-accent/20 text-accent',
    suite: 'bg-primary/10 text-primary',
  };

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={room.images[0]}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span
            className={cn(
              'text-xs font-semibold px-3 py-1.5 rounded-full capitalize',
              typeColors[room.type]
            )}
          >
            {room.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-card-foreground mb-2">
          {room.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {room.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>Up to {room.maxGuests} guests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize className="w-4 h-4" />
            <span>{room.size}</span>
          </div>
        </div>

        {/* Amenities Preview */}
        <div className="flex flex-wrap gap-2 mb-5">
          {room.amenities.slice(0, 4).map((amenity, index) => (
            <span
              key={index}
              className="flex items-center gap-1 text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground"
            >
              <Check className="w-3 h-3 text-primary" />
              {amenity}
            </span>
          ))}
          {room.amenities.length > 4 && (
            <span className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
              +{room.amenities.length - 4} more
            </span>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <span className="font-display text-2xl font-bold text-foreground">
              ₹{room.pricePerNight.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground"> / night</span>
          </div>
          <Button variant="default">View Details</Button>
        </div>
      </div>
    </div>
  );
};
