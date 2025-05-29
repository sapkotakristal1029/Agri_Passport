"use client";

import api from "@/api/axiosInstance";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { BatchStatusBadge } from "@/components/shared/batch-status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useData } from "@/context/data-context";
import { formatDate, getImageUrl } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RequestsPage() {
  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    api
      .get("/batch/")
      .then((response) => {
        const data = response.data;
        setBatches(data);
      })
      .catch((error) => {
        console.error("Error fetching batches:", error);
      });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/officer">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Batch Requests</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Batch Requests</CardTitle>
            <CardDescription>
              Review and verify product batches submitted by manufacturers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {batches.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No batch requests found.
                </p>
              ) : (
                batches.map((batch) => (
                  <div
                    key={batch._id}
                    className="border rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
                  >
                    <div className="flex items-center gap-4">
                      {/* <Image
                        src={
                          getImageUrl(batch.sampleImage) || "/placeholder.svg"
                        }
                        alt={batch.productName}
                        width={60}
                        height={60}
                        className="rounded-md object-cover"
                      /> */}
                      <div>
                        <h3 className="font-medium">{batch.productName}</h3>
                        <p className="text-sm text-gray-500">
                          Batch: {batch.batchNumber}
                        </p>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {batch.description}
                      </p>
                      <div className="flex gap-4 mt-1">
                        <p className="text-xs text-gray-500">
                          Production: {formatDate(batch.productionDate)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Expiry: {formatDate(batch.expiryDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end gap-2">
                      <BatchStatusBadge status={batch.status} />
                      {batch.status === "pending" ? (
                        <Link href={`/officer/requests/${batch._id}`}>
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            Review
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/officer/requests/${batch._id}`}>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
