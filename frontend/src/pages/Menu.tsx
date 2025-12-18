import { useEffect, useMemo, useState } from 'react';
import { MenuCard } from '@/components/menu/MenuCard';
import { CategoryFilter } from '@/components/menu/CategoryFilter';
import { Search, Flame, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import type { MenuItem } from '@/types';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const queryClient = useQueryClient();

  const fallbackImage = (category: string) => {
    if (category === 'veg') return 'https://images.unsplash.com/photo-1478144592103-25e218a04891?w=800&auto=format&fit=crop';
    if (category === 'non-veg') return 'https://images.unsplash.com/photo-1604908177201-6888e06a1cbd?w=800&auto=format&fit=crop';
    if (category === 'kids') return 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?w=800&auto=format&fit=crop';
    if (category === 'party-platters') return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop';
  };

  const mapRowToMenuItem = (row: Tables<'menu_items'>): MenuItem => ({
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

  const { data: remoteItems = [], isLoading } = useQuery({
    queryKey: ['menu_items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRowToMenuItem);
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: (prev) => prev ?? [],
  });

  // Subscribe to realtime changes so new dishes appear automatically
  useEffect(() => {
    const channel = supabase
      .channel('menu_items_live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'menu_items' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['menu_items'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const filteredItems = useMemo(() => {
    let items = remoteItems;

    if (activeCategory !== 'all') {
      items = items.filter((item) => item.category === activeCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    return items;
  }, [activeCategory, searchQuery, remoteItems]);

  const hotTodayItems = remoteItems.filter((item) => item.isHotToday);
  const bestSellers = remoteItems.filter((item) => item.isBestSeller);

  const categories = useMemo(() => {
    const base = [{ id: 'all', name: 'All', icon: '🍽️' }];
    const unique = Array.from(new Set(remoteItems.map((i) => i.category)));
    const iconFor = (id: string) =>
      id === 'veg'
        ? '🥗'
        : id === 'non-veg'
        ? '🍖'
        : id === 'kids'
        ? '🧒'
        : id === 'party-platters'
        ? '🎉'
        : '🍽️';
    return [
      ...base,
      ...unique.map((id) => ({
        id,
        name: id
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        icon: iconFor(id),
      })),
    ];
  }, [remoteItems]);

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 text-accent font-medium mb-4">
              <span className="w-8 h-px bg-accent" />
              Our Menu
              <span className="w-8 h-px bg-accent" />
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Discover Culinary <span className="text-accent">Excellence</span>
            </h1>
            <p className="text-primary-foreground/80 mb-8">
              From traditional favorites to innovative creations, explore our carefully curated 
              menu designed to delight every palate.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-background border-none shadow-soft text-foreground"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hot Today Highlight */}
      {hotTodayItems.length > 0 && activeCategory === 'all' && !searchQuery && (
        <section className="py-12 bg-destructive/5 border-y border-destructive/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <Flame className="w-6 h-6 text-destructive" />
              <h2 className="font-display text-2xl font-bold text-foreground">
                Hot Today
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotTodayItems.slice(0, 4).map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 bg-secondary/50 sticky top-20 z-30 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredItems.length}</span> items
              {activeCategory !== 'all' && (
                <span>
                  {' '}in{' '}
                  <span className="text-primary font-medium">
                    {categories.find((c) => c.id === activeCategory)?.name}
                  </span>
                </span>
              )}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-sm text-primary hover:underline"
              >
                Clear search
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-72 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <MenuCard item={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-2xl font-display text-muted-foreground mb-4">
                No dishes found
              </p>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers Section */}
      {activeCategory === 'all' && !searchQuery && (
        <section className="py-12 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-accent fill-accent" />
              <h2 className="font-display text-2xl font-bold text-foreground">
                Best Sellers
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Menu;
