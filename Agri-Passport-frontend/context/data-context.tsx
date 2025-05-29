"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  credential_id?: string;
}

export interface Sources {
  id: string;
  name: string;
  description: string;
}

export interface Batch {
  id: string;
  productName: string;
  batchNumber: string;
  productionDate: string;
  expiryDate: string;
  description: string;
  ingredients: Ingredient[];
  sampleImage: string;
  status: "pending" | "approved" | "rejected";
  credentialStatus: "none" | "issued";
  qrCode?: string;
  checklist?: {
    hygiene: boolean;
    packaging: boolean;
    expiration: boolean;
  };
  feedback?: string;
  verifiedBy?: string;
  verificationDate?: string;
}

interface DataContextType {
  batches: Batch[];
  addBatch: (batch: Omit<Batch, "id" | "status" | "credentialStatus">) => void;
  updateBatchStatus: (
    id: string,
    status: "approved" | "rejected",
    feedback?: string
  ) => void;
  getBatchByNumber: (batchNumber: string) => Batch | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial mock data
const initialBatches: Batch[] = [
  {
    id: "1",
    productName: "Organic Wheat Flour",
    batchNumber: "wht101",
    productionDate: "2023-04-15",
    expiryDate: "2024-04-15",
    description: "Premium organic wheat flour, stone-ground and unbleached",
    ingredients: [
      { id: "1-1", name: "Organic Wheat", quantity: 100, unit: "%" },
    ],
    sampleImage: "/placeholder.svg?height=200&width=200",
    status: "approved",
    credentialStatus: "issued",
    qrCode: "/placeholder.svg?height=200&width=200",
    checklist: {
      hygiene: true,
      packaging: true,
      expiration: true,
    },
    feedback: "All quality standards met. Approved for distribution.",
    verifiedBy: "John Smith",
    verificationDate: "2023-04-20",
  },
  {
    id: "2",
    productName: "Fresh Milk",
    batchNumber: "mlk202",
    productionDate: "2023-05-01",
    expiryDate: "2023-05-15",
    description: "Pasteurized whole milk from grass-fed cows",
    ingredients: [{ id: "2-1", name: "Whole Milk", quantity: 100, unit: "%" }],
    sampleImage: "/placeholder.svg?height=200&width=200",
    status: "pending",
    credentialStatus: "none",
  },
  {
    id: "3",
    productName: "Sourdough Bread",
    batchNumber: "bre105",
    productionDate: "2023-05-05",
    expiryDate: "2023-05-12",
    description: "Artisanal sourdough bread made with organic flour",
    ingredients: [
      { id: "3-1", name: "Organic Flour", quantity: 80, unit: "%" },
      { id: "3-2", name: "Water", quantity: 15, unit: "%" },
      { id: "3-3", name: "Salt", quantity: 2, unit: "%" },
      { id: "3-4", name: "Sourdough Starter", quantity: 3, unit: "%" },
    ],
    sampleImage: "/placeholder.svg?height=200&width=200",
    status: "rejected",
    credentialStatus: "none",
    feedback:
      "Packaging does not meet safety standards. Please revise and resubmit.",
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [batches, setBatches] = useState<Batch[]>(initialBatches);

  // Generate a simple QR code URL (in a real app, this would be more sophisticated)
  const generateQRCode = (batchNumber: string) => {
    return `/placeholder.svg?height=200&width=200`;
  };

  const addBatch = (
    newBatch: Omit<Batch, "id" | "status" | "credentialStatus">
  ) => {
    const batch: Batch = {
      ...newBatch,
      id: Date.now().toString(),
      status: "pending",
      credentialStatus: "none",
    };
    setBatches((prev) => [...prev, batch]);
  };

  const updateBatchStatus = (
    id: string,
    status: "approved" | "rejected",
    feedback?: string
  ) => {
    setBatches((prev) =>
      prev.map((batch) => {
        if (batch.id === id) {
          const updatedBatch: Batch = {
            ...batch,
            status,
            feedback: feedback || batch.feedback,
          };

          if (status === "approved") {
            updatedBatch.credentialStatus = "issued";
            updatedBatch.qrCode = generateQRCode(batch.batchNumber);
            updatedBatch.verifiedBy = "Safety Officer";
            updatedBatch.verificationDate = new Date()
              .toISOString()
              .split("T")[0];
            updatedBatch.checklist = {
              hygiene: true,
              packaging: true,
              expiration: true,
            };
          }

          return updatedBatch;
        }
        return batch;
      })
    );
  };

  const getBatchByNumber = (batchNumber: string) => {
    return batches.find((batch) => batch.batchNumber === batchNumber);
  };

  return (
    <DataContext.Provider
      value={{
        batches,
        addBatch,
        updateBatchStatus,
        getBatchByNumber,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
