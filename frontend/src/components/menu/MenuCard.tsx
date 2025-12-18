import { MenuItem } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Plus, Minus, Flame, Star, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuCardProps {
  item: MenuItem;
}

export const MenuCard = ({ item }: MenuCardProps) => {
  const { addItem, removeItem, getItemQuantity, updateQuantity } = useCart();
  const quantity = getItemQuantity(item.id);

  const discountedPrice = item.discountPercentage
    ? item.price * (1 - item.discountPercentage / 100)
    : item.price;

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {item.isBestSeller && (
            <span className="flex items-center gap-1 bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
              <Star className="w-3 h-3" />
              Best Seller
            </span>
          )}
          {item.isHotToday && (
            <span className="flex items-center gap-1 bg-destructive text-destructive-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
              <Flame className="w-3 h-3" />
              Hot Today
            </span>
          )}
          {item.discountPercentage && (
            <span className="flex items-center gap-1 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
              <Percent className="w-3 h-3" />
              {item.discountPercentage}% Off
            </span>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={cn(
              'text-xs font-semibold px-2.5 py-1 rounded-full',
              item.category === 'veg'
                ? 'bg-green-500/90 text-white'
                : item.category === 'non-veg'
                ? 'bg-red-500/90 text-white'
                : item.category === 'kids'
                ? 'bg-blue-500/90 text-white'
                : 'bg-purple-500/90 text-white'
            )}
          >
            {item.category === 'veg' && '🥗 Veg'}
            {item.category === 'non-veg' && '🍖 Non-Veg'}
            {item.category === 'kids' && '🧒 Kids'}
            {item.category === 'party-platters' && '🎉 Party'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-card-foreground mb-2 line-clamp-1">
          {item.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {item.description}
        </p>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold text-foreground">
              ₹{Math.round(discountedPrice)}
            </span>
            {item.discountPercentage && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{item.price}
              </span>
            )}
          </div>

          {quantity === 0 ? (
            <Button
              variant="gold"
              size="sm"
              onClick={() => addItem(item)}
              className="px-4"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(item.id, quantity - 1)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <Button
                variant="gold"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(item.id, quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
