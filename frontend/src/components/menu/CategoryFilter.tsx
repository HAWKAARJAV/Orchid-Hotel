import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: { id: string; name: string; icon: string }[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            'px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300',
            activeCategory === category.id
              ? 'bg-primary text-primary-foreground shadow-soft'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
        >
          <span className="mr-2">{category.icon}</span>
          {category.name}
        </button>
      ))}
    </div>
  );
};
