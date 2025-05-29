"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sources } from "@/context/data-context";
import { Trash, Plus } from "lucide-react";

interface SourcesInputProps {
  sources: any[];
  onChange: (sources: any[]) => void;
}

export function SourcesInput({ sources, onChange }: SourcesInputProps) {
  const addSources = () => {
    const newSources: Sources = {
      id: `ing-${Date.now()}`,
      name: "",
      description: "",
    };
    onChange([...sources, newSources]);
  };

  const removeSources = (id: string) => {
    onChange(sources.filter((Sources) => Sources.id !== id));
  };

  const updateSources = (
    id: string,
    field: keyof Sources,
    value: string | number
  ) => {
    onChange(
      sources.map((Sources) => {
        if (Sources.id === id) {
          return {
            ...Sources,
            [field]: value,
          };
        }
        return Sources;
      })
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Sources</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSources}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Sources
        </Button>
      </div>

      {sources.length === 0 ? (
        <div className="text-center py-4 border border-dashed rounded-md bg-gray-50">
          <p className="text-sm text-gray-500">
            No sources added yet. Click "Add Sources" to start.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sources.map((Sources, index) => (
            <div key={Sources.id} className="flex gap-2 flex-wrap items-end">
              <div className="flex-1">
                <Label htmlFor={`Sources-name-${index}`} className="text-xs">
                  Name
                </Label>
                <Input
                  id={`Sources-name-${index}`}
                  value={Sources.name}
                  onChange={(e) =>
                    updateSources(Sources.id, "name", e.target.value)
                  }
                  placeholder="Sources name"
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label
                  htmlFor={`Sources-description-${index}`}
                  className="text-xs"
                >
                  Description
                </Label>
                <Input
                  id={`Sources-description-${index}`}
                  value={Sources.description || ""}
                  onChange={(e) =>
                    updateSources(Sources.id, "description", e.target.value)
                  }
                  placeholder="Sources description"
                  className="mt-1"
                />
              </div>

              <div className="col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSources(Sources.id)}
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
