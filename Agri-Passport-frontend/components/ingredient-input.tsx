"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash, Plus } from "lucide-react";
import type { Ingredient } from "@/context/data-context";

interface IngredientInputProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
  credentialOptions: { label: string; value: string }[];
}

export function IngredientInput({
  ingredients,
  onChange,
  credentialOptions,
}: IngredientInputProps) {
  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: `ing-${Date.now()}`,
      name: "",
      quantity: 0,
      unit: "g",
      credential_id: "",
    };
    onChange([...ingredients, newIngredient]);
  };

  const removeIngredient = (id: string) => {
    onChange(ingredients.filter((ingredient) => ingredient.id !== id));
  };

  const updateIngredient = (
    id: string,
    field: keyof Ingredient,
    value: string | number
  ) => {
    onChange(
      ingredients.map((ingredient) => {
        if (ingredient.id === id) {
          return {
            ...ingredient,
            [field]:
              field === "quantity"
                ? Number.parseFloat(value as string) || 0
                : value,
          };
        }
        return ingredient;
      })
    );
  };

  const commonUnits = [
    "g",
    "kg",
    "ml",
    "l",
    "%",
    "oz",
    "lb",
    "tsp",
    "tbsp",
    "cup",
    "pinch",
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Ingredients</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addIngredient}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Ingredient
        </Button>
      </div>

      {ingredients.length === 0 ? (
        <div className="text-center py-4 border border-dashed rounded-md bg-gray-50">
          <p className="text-sm text-gray-500">
            No ingredients added yet. Click "Add Ingredient" to start.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <div
              key={ingredient.id}
              className="grid grid-cols-12 gap-2 items-end"
            >
              <div className="col-span-3">
                <Label htmlFor={`ingredient-name-${index}`} className="text-xs">
                  Name
                </Label>
                <Input
                  id={`ingredient-name-${index}`}
                  value={ingredient.name}
                  onChange={(e) =>
                    updateIngredient(ingredient.id, "name", e.target.value)
                  }
                  placeholder="Ingredient name"
                  className="mt-1"
                />
              </div>
              <div className="col-span-3">
                <Label
                  htmlFor={`ingredient-quantity-${index}`}
                  className="text-xs"
                >
                  Quantity
                </Label>
                <Input
                  id={`ingredient-quantity-${index}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={ingredient.quantity || ""}
                  onChange={(e) =>
                    updateIngredient(ingredient.id, "quantity", e.target.value)
                  }
                  placeholder="Amount"
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor={`ingredient-unit-${index}`} className="text-xs">
                  Unit
                </Label>
                <Select
                  value={ingredient.unit}
                  onValueChange={(value) =>
                    updateIngredient(ingredient.id, "unit", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonUnits.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-3">
                <Label
                  htmlFor={`ingredient-credential-${index}`}
                  className="text-xs"
                >
                  Ingredient Credential
                </Label>
                <Select
                  value={ingredient.credential_id}
                  onValueChange={(value) =>
                    updateIngredient(ingredient.id, "credential_id", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a credential" />
                  </SelectTrigger>
                  <SelectContent>
                    {credentialOptions.length > 0 ? (
                      credentialOptions.map((itm, i) => (
                        <SelectItem key={i} value={itm.value}>
                          {itm.label}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-credentials" disabled>
                        No shared credentials
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeIngredient(ingredient.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
