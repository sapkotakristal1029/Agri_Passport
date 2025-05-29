import type { Ingredient } from "@/context/data-context";

interface IngredientsListProps {
  ingredients: any[];
  className?: string;
}

export function IngredientsList({
  ingredients,
  className,
}: IngredientsListProps) {
  if (!ingredients || ingredients.length === 0) {
    return <p className="text-sm text-gray-500">No ingredients listed</p>;
  }

  return (
    <div className={className}>
      <h4 className="text-sm font-medium text-gray-500 mb-2">Ingredients:</h4>
      <ul className="space-y-1">
        {ingredients.map((ingredient) => (
          <li key={ingredient._id} className="text-sm">
            {ingredient.name} ({ingredient.quantity} {ingredient.unit})
          </li>
        ))}
      </ul>
    </div>
  );
}
