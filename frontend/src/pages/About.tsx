import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Award, Users, Star, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const About = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Message Sent!',
      description: 'We\'ll get back to you within 24 hours.',
    });
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-60 h-60 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-20 w-40 h-40 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 text-accent font-medium mb-4">
              <span className="w-8 h-px bg-accent" />
              Our Story
              <span className="w-8 h-px bg-accent" />
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              About <span className="text-accent">Orchid Petals</span>
            </h1>
            <p className="text-primary-foreground/80">
              Where tradition meets contemporary luxury, crafting memorable experiences since 1999.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                A Legacy of <span className="text-primary">Excellence</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Nestled in the heart of Mumbai, Orchid Petals began as a dream to create 
                  a sanctuary where culinary artistry, luxurious comfort, and heartfelt hospitality 
                  converge to create extraordinary experiences.
                </p>
                <p>
                  Founded in 1999 by the Sharma family, what started as a boutique restaurant 
                  has blossomed into a premier hospitality destination. Our name draws inspiration 
                  from the lush orchids that once adorned this land, and the delicate petals 
                  symbolize the care we put into every detail of your experience.
                </p>
                <p>
                  Today, Orchid Petals stands as a testament to our unwavering commitment to 
                  excellence—from our award-winning cuisine crafted by internationally trained chefs, 
                  to our meticulously designed rooms and our legendary event spaces that have hosted 
                  countless celebrations.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"
                alt="Restaurant Interior"
                className="rounded-2xl shadow-elevated h-48 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"
                alt="Hotel Exterior"
                className="rounded-2xl shadow-elevated h-48 object-cover mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400"
                alt="Kitchen"
                className="rounded-2xl shadow-elevated h-48 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400"
                alt="Events"
                className="rounded-2xl shadow-elevated h-48 object-cover mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Award, value: '25+', label: 'Years of Excellence' },
              { icon: Users, value: '50,000+', label: 'Happy Guests' },
              { icon: Star, value: '15+', label: 'Industry Awards' },
              { icon: Heart, value: '1,000+', label: 'Events Hosted' },
            ].map((stat, index) => (
              <div key={index} className="text-primary-foreground">
                <stat.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                <p className="font-display text-3xl md:text-4xl font-bold mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-primary-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our <span className="text-primary">Values</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Excellence',
                desc: 'We strive for perfection in every dish we serve, every room we prepare, and every event we host.',
                icon: '⭐',
              },
              {
                title: 'Authenticity',
                desc: 'Our cuisine celebrates authentic flavors while embracing innovation, creating unique culinary experiences.',
                icon: '🌿',
              },
              {
                title: 'Hospitality',
                desc: 'Every guest is family. We create warm, welcoming experiences that feel like coming home.',
                icon: '🤝',
              },
              {
                title: 'Sustainability',
                desc: 'We source locally, minimize waste, and operate with respect for our environment.',
                icon: '♻️',
              },
              {
                title: 'Innovation',
                desc: 'While honoring tradition, we continuously evolve to exceed modern expectations.',
                icon: '💡',
              },
              {
                title: 'Community',
                desc: 'We support local artisans, farmers, and give back to the communities that support us.',
                icon: '❤️',
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-elevated transition-all duration-300"
              >
                <span className="text-4xl mb-4 block">{value.icon}</span>
                <h3 className="font-display text-xl font-semibold text-card-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Get in <span className="text-primary">Touch</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                We'd love to hear from you. Whether you have a question about our services, 
                want to make a reservation, or plan an event, our team is ready to assist.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Address</h3>
                    <p className="text-muted-foreground">
                      123 Garden Avenue, Luxury District<br />
                      Mumbai 400001, Maharashtra, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                    <p className="text-muted-foreground">
                      Reservations: +91 98765 43210<br />
                      General: +91 22 1234 5678
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <p className="text-muted-foreground">
                      General: hello@orchidpetals.com<br />
                      Events: events@orchidpetals.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Hours</h3>
                    <p className="text-muted-foreground">
                      Restaurant: 7:00 AM - 11:00 PM<br />
                      Reception: 24 Hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card rounded-2xl p-8 shadow-elevated">
              <h3 className="font-display text-xl font-bold text-card-foreground mb-6">
                Send us a Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Input placeholder="Your Name" required />
                  </div>
                  <div>
                    <Input type="email" placeholder="Email Address" required />
                  </div>
                </div>
                <div>
                  <Input type="tel" placeholder="Phone Number" />
                </div>
                <div>
                  <Input placeholder="Subject" required />
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message"
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" variant="gold" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-96 bg-muted">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.682459587546!2d72.8318!3d19.0728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzIyLjEiTiA3MsKwNDknNTQuNSJF!5e0!3m2!1sen!2sin!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Orchid Petals Location"
        />
      </section>
    </div>
  );
};

export default About;
