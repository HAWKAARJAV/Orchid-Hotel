import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MenuCard } from '@/components/menu/MenuCard';
import { RoomCard } from '@/components/rooms/RoomCard';
import { menuItems as localMenuItems } from '@/data/menuItems';
import { rooms } from '@/data/rooms';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { ArrowRight, Utensils, Bed, PartyPopper, Star, Clock, Award } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const Index = () => {
  const fallbackImage = (category: string) => {
    if (category === 'veg') return 'https://images.unsplash.com/photo-1478144592103-25e218a04891?w=800&auto=format&fit=crop';
    if (category === 'non-veg') return 'https://images.unsplash.com/photo-1604908177201-6888e06a1cbd?w=800&auto=format&fit=crop';
    if (category === 'kids') return 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?w=800&auto=format&fit=crop';
    if (category === 'party-platters') return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop';
  };

  const mapRowToMenuItem = (row: Tables<'menu_items'>) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    description: row.description ?? '',
    image: row.image_url || fallbackImage(row.category),
    isBestSeller: Boolean(row.is_best_seller),
    isHotToday: Boolean(row.is_hot_today),
    discountPercentage: row.discount_percentage ?? undefined,
  });

  const { data: remoteMenu = [] } = useQuery({
    queryKey: ['menu_items_home'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(12);
      if (error) throw error;
      return (data ?? []).map(mapRowToMenuItem);
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: (prev) => prev ?? [],
  });

  // Keep homepage and menu page in sync: prefer Supabase items, fallback to local seeds
  const allMenuItems = useMemo(() => {
    if (remoteMenu.length > 0) return remoteMenu;
    return localMenuItems;
  }, [remoteMenu]);

  const featuredMenu = useMemo(
    () => allMenuItems.filter((item) => item.isBestSeller).slice(0, 4),
    [allMenuItems]
  );

  const featuredRooms = rooms.slice(0, 3);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Orchid Petals"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 pt-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-accent font-medium mb-6 animate-fade-in">
              <span className="w-12 h-px bg-accent" />
              Welcome to Luxury
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in-up">
              Experience
              <br />
              <span className="text-accent">Orchid Petals</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl animate-fade-in-up animation-delay-200">
              Where culinary artistry meets timeless elegance. Discover exquisite dining, 
              luxurious stays, and unforgettable celebrations.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-300">
              <Link to="/menu">
                <Button variant="hero" size="xl">
                  Explore Menu
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/rooms">
                <Button variant="hero-outline" size="xl">
                  View Rooms
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-primary-foreground/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { icon: Utensils, label: 'Fine Dining', value: '4 Cuisines' },
              { icon: Bed, label: 'Luxury Rooms', value: '6 Categories' },
              { icon: PartyPopper, label: 'Events', value: '3 Venues' },
              { icon: Star, label: 'Rating', value: '4.9/5' },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-primary-foreground">
                <feature.icon className="w-6 h-6 text-accent" />
                <div>
                  <p className="text-xs text-primary-foreground/60">{feature.label}</p>
                  <p className="font-semibold">{feature.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="py-20 bg-gradient-cream">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 text-accent font-medium mb-4">
                <span className="w-8 h-px bg-accent" />
                Our Story
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                A Legacy of
                <br />
                <span className="text-primary">Hospitality Excellence</span>
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Nestled in the heart of the city, Orchid Petals is where tradition meets 
                contemporary luxury. For over two decades, we've been crafting memorable 
                experiences through our award-winning restaurant, boutique hotel, and 
                world-class event venues.
              </p>
              <div className="flex flex-wrap gap-8 mb-8">
                <div>
                  <p className="font-display text-3xl font-bold text-accent">25+</p>
                  <p className="text-sm text-muted-foreground">Years of Excellence</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-accent">50k+</p>
                  <p className="text-sm text-muted-foreground">Happy Guests</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-accent">15+</p>
                  <p className="text-sm text-muted-foreground">Industry Awards</p>
                </div>
              </div>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Discover More
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="relative animate-fade-in-up animation-delay-200">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400"
                  alt="Restaurant"
                  className="rounded-2xl shadow-elevated h-48 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400"
                  alt="Hotel Room"
                  className="rounded-2xl shadow-elevated h-48 object-cover mt-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400"
                  alt="Events"
                  className="rounded-2xl shadow-elevated h-48 object-cover -mt-4"
                />
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400"
                  alt="Food"
                  className="rounded-2xl shadow-elevated h-48 object-cover mt-4"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-accent text-accent-foreground px-6 py-4 rounded-xl shadow-gold">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">Award Winner</p>
                    <p className="text-xs opacity-80">Best Hospitality 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-accent font-medium mb-4">
              <span className="w-8 h-px bg-accent" />
              Our Menu
              <span className="w-8 h-px bg-accent" />
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Culinary <span className="text-primary">Masterpieces</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each dish is a celebration of flavors, crafted with passion by our award-winning chefs 
              using the finest locally-sourced ingredients.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredMenu.map((item, index) => (
              <div
                key={item.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MenuCard item={item} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/menu">
              <Button variant="gold" size="lg">
                View Full Menu
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-accent font-medium mb-4">
              <span className="w-8 h-px bg-accent" />
              Accommodations
              <span className="w-8 h-px bg-accent" />
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Luxurious <span className="text-primary">Retreats</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Immerse yourself in unparalleled comfort. Our thoughtfully designed rooms and suites 
              offer a sanctuary of tranquility and sophistication.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredRooms.map((room, index) => (
              <div
                key={room.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <RoomCard room={room} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/rooms">
              <Button variant="default" size="lg">
                Explore All Rooms
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Events CTA */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 text-accent font-medium mb-4">
              <PartyPopper className="w-5 h-5" />
              Celebrations & Events
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Create <span className="text-accent">Unforgettable</span> Moments
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              From intimate birthday celebrations to grand weddings and prestigious corporate events, 
              let us transform your vision into reality with meticulous attention to detail.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/events">
                <Button variant="gold" size="xl">
                  Plan Your Event
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="hero-outline" size="xl">
                <Clock className="w-5 h-5" />
                Book a Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-accent font-medium mb-4">
              <Star className="w-4 h-4" />
              Testimonials
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              What Our <span className="text-primary">Guests Say</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                role: 'Wedding Guest',
                content: 'Our wedding at Orchid Petals was nothing short of magical. The attention to detail, exquisite food, and impeccable service made our special day truly unforgettable.',
                rating: 5,
              },
              {
                name: 'Rahul Mehta',
                role: 'Business Traveler',
                content: 'The Executive Suite exceeded all expectations. Perfect for my business trip with its thoughtful amenities and the restaurant\'s cuisine is world-class.',
                rating: 5,
              },
              {
                name: 'Anita & Family',
                role: 'Dining Experience',
                content: 'We celebrated our anniversary here and the experience was phenomenal. The truffle risotto is a must-try! The ambiance is perfect for special occasions.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-elevated transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
