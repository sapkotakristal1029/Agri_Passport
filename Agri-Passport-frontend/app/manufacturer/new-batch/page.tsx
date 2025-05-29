"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/components/layout/sidebar";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { IngredientInput } from "@/components/ingredient-input";
import { SourcesInput } from "@/components/sources-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sources, type Ingredient } from "@/context/data-context";
import { ArrowLeft } from "lucide-react";
import api from "@/api/axiosInstance";

export default function NewBatchPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    productName: "",
    batchNumber: "",
    productionDate: "",
    expiryDate: "",
    description: "",
    ingredients: [] as Ingredient[],
    sources: [] as Sources[],
    sampleImage: "/placeholder.svg?height=200&width=200",
  });
  const [credentialOptions, setCredentialOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchSharedCredentials = async () => {
      try {
        const res = await api.get("/batch/shared");
        const options = res.data.map((batch: any) => ({
          label: `${batch.productName} (Batch No: ${batch.batchNumber})`,
          value: batch._id,
        }));
        setCredentialOptions(options);
      } catch (err) {
        console.error("Error fetching shared credentials", err);
      }
    };
    fetchSharedCredentials();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIngredientsChange = (ingredients: Ingredient[]) => {
    setFormData((prev) => ({ ...prev, ingredients }));
  };

  const handleSourcesChange = (sources: Sources[]) => {
    setFormData((prev) => ({ ...prev, sources }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const {
      productName,
      batchNumber,
      productionDate,
      expiryDate,
      description,
      ingredients,
      sources,
    } = formData;

    if (!productName || !batchNumber || !productionDate || !expiryDate) {
      setError("Please fill in all required fields");
      return;
    }

    if (
      ingredients.some((ing) => !ing.name.trim())
    ) {
      setError("All ingredients must be filled correctly");
      return;
    }

    if ( sources.some((src) => !src.name.trim())) {
      setError("All sources must be filled correctly");
      return;
    }

    try {
      const formPayload = new FormData();
      formPayload.append(
        "manufacturerId",
        jwtDecode<DecodedToken>(localStorage.getItem("token") || "")?.id
      );
      formPayload.append("productName", productName);
      formPayload.append("batchNumber", batchNumber);
      formPayload.append("productionDate", productionDate);
      formPayload.append("expiryDate", expiryDate);
      formPayload.append("description", description);
      formPayload.append("ingredients", JSON.stringify(ingredients));
      formPayload.append("sources", JSON.stringify(sources));

      const file = fileInputRef.current?.files?.[0];
      if (file) formPayload.append("sampleImage", file);

      await api.post("/batch", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Batch created successfully!");
      router.push("/manufacturer");
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Batch creation failed";
      setError(message);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/manufacturer">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Submit New Batch</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Batch Information</CardTitle>
            <CardDescription>
              Provide details about your product batch for safety verification
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <Alert
                  variant="destructive"
                  className="bg-red-50 text-red-800 border-red-200"
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batchNumber">Batch Number *</Label>
                  <Input
                    id="batchNumber"
                    name="batchNumber"
                    value={formData.batchNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productionDate">Production Date *</Label>
                  <Input
                    id="productionDate"
                    name="productionDate"
                    type="date"
                    value={formData.productionDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Product description"
                />
              </div>

              <div className="border rounded-md p-4 bg-gray-50">
                <IngredientInput
                  ingredients={formData.ingredients}
                  onChange={handleIngredientsChange}
                  credentialOptions={credentialOptions}
                />
              </div>

              <div className="border rounded-md p-4 bg-gray-50">
                <SourcesInput
                  sources={formData.sources}
                  onChange={handleSourcesChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sampleImage">Sample Image</Label>
                <Input
                  id="sampleImage"
                  name="sampleImage"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/manufacturer")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Request Credential
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
