import { EventCard } from '@/components/events/EventCard';
import { eventPlans } from '@/data/events';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Calendar } from 'lucide-react';

const eventTypes = [
  { id: 'all', name: 'All Events', icon: '🎉' },
  { id: 'birthday', name: 'Birthdays', icon: '🎂' },
  { id: 'wedding', name: 'Weddings', icon: '💒' },
  { id: 'corporate', name: 'Corporate', icon: '🏢' },
];

const Events = () => {
  const [activeType, setActiveType] = useState('all');

  const filteredEvents =
    activeType === 'all'
      ? eventPlans
      : eventPlans.filter((event) => event.eventType === activeType);

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-60 h-60 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-40 h-40 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 text-accent font-medium mb-4">
              <span className="w-8 h-px bg-accent" />
              Celebrations
              <span className="w-8 h-px bg-accent" />
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Create <span className="text-accent">Unforgettable</span> Moments
            </h1>
            <p className="text-primary-foreground/80 mb-8">
              From intimate gatherings to grand celebrations, let our expert team 
              transform your vision into a spectacular reality.
            </p>
            <Button variant="gold" size="xl">
              <Calendar className="w-5 h-5" />
              Schedule a Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Event Type Filter */}
      <section className="py-8 bg-secondary/50 sticky top-20 z-30 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {eventTypes.map((type) => (
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
                <span className="mr-2">{type.icon}</span>
                {type.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose <span className="text-primary">Orchid Petals</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We bring expertise, creativity, and dedication to every event we host
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '✨',
                title: 'Bespoke Planning',
                desc: 'Custom-tailored experiences designed around your vision',
              },
              {
                icon: '👨‍🍳',
                title: 'Gourmet Catering',
                desc: 'Award-winning culinary team with diverse menu options',
              },
              {
                icon: '🎨',
                title: 'Creative Design',
                desc: 'Stunning décor and themed setups by expert designers',
              },
              {
                icon: '🤝',
                title: 'Dedicated Support',
                desc: 'Personal event coordinator from start to finish',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-xl shadow-soft hover:shadow-elevated transition-all duration-300 text-center"
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="font-display font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Plan Your Event?
            </h2>
            <p className="text-muted-foreground mb-8">
              Our event specialists are here to help you create the celebration of your dreams.
              Get in touch for a personalized consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="default" size="lg">
                <Phone className="w-4 h-4" />
                Call +91 98765 43210
              </Button>
              <Button variant="outline" size="lg">
                <Mail className="w-4 h-4" />
                Email Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
