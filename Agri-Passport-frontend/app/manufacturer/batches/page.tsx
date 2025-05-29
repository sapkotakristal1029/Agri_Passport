"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Select } from "@/components/ui/select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Label } from "recharts";

type Ingredient = {
  name: string;
};

type Batch = {
  productName: string;
  batchNumber: string;
  productionDate: string;
  expiryDate: string;
  description: string;
  ingredients: Ingredient[];
  sampleImage?: string;
};

export default function BatchTable() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof Batch>("productName");
  const [sortAsc, setSortAsc] = useState(true);

  const data = [
    {
      productName: "Organic Wheat Flour",
      batchNumber: "WHT105",
      productionDate: "2024-12-01",
      expiryDate: "2025-12-01",
      description: "Fine-ground organic wheat flour for baking.",
      ingredients: [{ name: "Wheat" }],
      sampleImage: "/images/wheat.jpg",
    },
    {
      productName: "Almond Butter",
      batchNumber: "ALM200",
      productionDate: "2025-01-15",
      expiryDate: "2026-01-15",
      description: "Smooth almond butter with no additives.",
      ingredients: [{ name: "Almonds" }, { name: "Sea Salt" }],
      sampleImage: "/images/almond.jpg",
    },
    {
      productName: "Tomato Puree",
      batchNumber: "TOM300",
      productionDate: "2025-03-10",
      expiryDate: "2025-09-10",
      description: "Thick tomato puree for sauces and soups.",
      ingredients: [{ name: "Tomatoes" }, { name: "Citric Acid" }],
      sampleImage: "/images/tomato.jpg",
    },
  ];

  const handleSort = (key: keyof Batch) => {
    if (key === sortBy) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(key);
      setSortAsc(true);
    }
  };

  const filteredData = useMemo(() => {
    return data
      .filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const aVal = a[sortBy] ?? "";
        const bVal = b[sortBy] ?? "";
        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortAsc
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        return 0;
      });
  }, [data, search, sortBy, sortAsc]);

  return (
    <DashboardLayout>
        <div className="space-y-4">
        <h1 className="text-2xl font-bold">Batches</h1>
      <div className="flex">


        <form className="space-y-2">
                <Label>Role</Label>
                <Select value={""} onValueChange={()=>null} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                  </SelectContent>
                </Select>
              </form>

        <Input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("productName")} className="cursor-pointer">
                Product Name
              </TableHead>
              <TableHead onClick={() => handleSort("batchNumber")} className="cursor-pointer">
                Batch Number
              </TableHead>
              <TableHead onClick={() => handleSort("productionDate")} className="cursor-pointer">
                Production Date
              </TableHead>
              <TableHead onClick={() => handleSort("expiryDate")} className="cursor-pointer">
                Expiry Date
              </TableHead>
              <TableHead>Ingredients</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((batch, index) => (
                <TableRow key={index}>
                  <TableCell>{batch.productName}</TableCell>
                  <TableCell>{batch.batchNumber}</TableCell>
                  <TableCell>{batch.productionDate}</TableCell>
                  <TableCell>{batch.expiryDate}</TableCell>
                  <TableCell>{batch.ingredients.map((i) => i.name).join(", ")}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                  No matching results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
    </DashboardLayout>
    
  );
}
