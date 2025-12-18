import { RoomCard } from '@/components/rooms/RoomCard';
import { rooms } from '@/data/rooms';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const roomTypes = [
  { id: 'all', name: 'All Rooms' },
  { id: 'deluxe', name: 'Deluxe' },
  { id: 'executive', name: 'Executive' },
  { id: 'suite', name: 'Suites' },
];

const Rooms = () => {
  const [activeType, setActiveType] = useState('all');

  const filteredRooms =
    activeType === 'all'
      ? rooms
      : rooms.filter((room) => room.type === activeType);

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-60 h-60 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 text-accent font-medium mb-4">
              <span className="w-8 h-px bg-accent" />
              Accommodations
              <span className="w-8 h-px bg-accent" />
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Luxurious <span className="text-accent">Retreats</span>
            </h1>
            <p className="text-primary-foreground/80">
              Discover our collection of thoughtfully designed rooms and suites, 
              each offering a unique sanctuary of comfort, style, and sophistication.
            </p>
          </div>
        </div>
      </section>

      {/* Room Type Filter */}
      <section className="py-8 bg-secondary/50 sticky top-20 z-30 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {roomTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={cn(
                  'px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300',
                  activeType === type.id
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'bg-card text-card-foreground hover:bg-muted'
                )}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room, index) => (
              <div
                key={room.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <RoomCard room={room} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              World-Class <span className="text-primary">Amenities</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every stay at Orchid Petals comes with access to our premium facilities
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🏊', title: 'Infinity Pool', desc: 'Temperature-controlled rooftop pool' },
              { icon: '🧘', title: 'Spa & Wellness', desc: 'Full-service spa and fitness center' },
              { icon: '🍽️', title: 'Fine Dining', desc: 'Award-winning restaurant on-site' },
              { icon: '🚗', title: 'Valet Parking', desc: 'Complimentary valet service' },
              { icon: '📶', title: 'High-Speed WiFi', desc: 'Complimentary throughout property' },
              { icon: '🛎️', title: '24/7 Concierge', desc: 'Dedicated concierge services' },
              { icon: '☕', title: 'Room Service', desc: 'Round-the-clock dining in room' },
              { icon: '🎭', title: 'Entertainment', desc: 'Premium TV channels & streaming' },
            ].map((amenity, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-xl shadow-soft hover:shadow-elevated transition-all duration-300 text-center"
              >
                <span className="text-4xl mb-4 block">{amenity.icon}</span>
                <h3 className="font-display font-semibold text-card-foreground mb-2">
                  {amenity.title}
                </h3>
                <p className="text-sm text-muted-foreground">{amenity.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Rooms;
