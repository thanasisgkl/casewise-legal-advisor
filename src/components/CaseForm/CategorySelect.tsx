
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
  description: string;
};

interface CategorySelectProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

const CategorySelect = ({
  categories,
  selectedCategory,
  onSelectCategory
}: CategorySelectProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className={cn(
            "relative cursor-pointer rounded-lg border p-4 hover:border-legal-navy transition-all",
            selectedCategory === category.id
              ? "border-2 border-legal-navy bg-legal-navy/5"
              : "border-gray-200"
          )}
          onClick={() => onSelectCategory(category.id)}
        >
          <div className="flex justify-between">
            <h3 className="font-medium">{category.name}</h3>
            {selectedCategory === category.id && (
              <div className="rounded-full bg-legal-navy text-white p-1">
                <Check className="h-4 w-4" />
              </div>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">{category.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CategorySelect;
