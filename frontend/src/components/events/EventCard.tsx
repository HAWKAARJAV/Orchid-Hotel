import { EventPlan } from '@/types';
import { Button } from '@/components/ui/button';
import { Users, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: EventPlan;
}

export const EventCard = ({ event }: EventCardProps) => {
  const typeConfig = {
    birthday: {
      color: 'bg-pink-500/20 text-pink-600',
      icon: '🎂',
    },
    wedding: {
      color: 'bg-rose-500/20 text-rose-600',
      icon: '💒',
    },
    corporate: {
      color: 'bg-blue-500/20 text-blue-600',
      icon: '🏢',
    },
  };

  const config = typeConfig[event.eventType];

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={event.images[0]}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <span
            className={cn(
              'text-xs font-semibold px-3 py-1.5 rounded-full capitalize',
              config.color
            )}
          >
            {config.icon} {event.eventType}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-display text-xl font-semibold text-white">
            {event.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Capacity */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">{event.capacity}</span>
        </div>

        {/* Inclusions */}
        <div className="space-y-2 mb-5">
          {event.inclusions.slice(0, 4).map((inclusion, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1">{inclusion}</span>
            </div>
          ))}
          {event.inclusions.length > 4 && (
            <p className="text-sm text-primary font-medium pl-6">
              +{event.inclusions.length - 4} more inclusions
            </p>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Starting from</p>
            <span className="font-display text-2xl font-bold text-foreground">
              ₹{event.price.toLocaleString()}
            </span>
          </div>
          <Button variant="gold">Enquire Now</Button>
        </div>
      </div>
    </div>
  );
};
