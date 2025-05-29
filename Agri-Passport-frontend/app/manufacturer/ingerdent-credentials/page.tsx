"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { BatchStatusBadge } from "@/components/shared/batch-status-badge";
import { IngredientsList } from "@/components/shared/ingredients-list";
import { QRCodeDisplay } from "@/components/shared/qr-code-display";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useData } from "@/context/data-context";
import { ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";

export default function CredentialsPage() {
  const [batches, setBatches] = useState<any[]>([]);

  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get("batch/shared").then((response) => {
      const data = response.data;
      if (data && Array.isArray(data)) {
        setBatches(data);
      } else {
        setBatches([]);
      }
    })
  }, []);

  const openModal = (batch:any) => {
    setSelectedBatch(batch);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedBatch(null);
    setShowModal(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Link href="/manufacturer">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Ingredient Credentials
          </h1>
        </div>

        {batches.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Credentials Available</CardTitle>
              <CardDescription>
                You don't have any approved batches with issued credentials.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">
                Submit a new batch for approval to receive a credential and QR code.
              </p>
              <Link href="/manufacturer/new-batch">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Submit New Batch
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
  <CardTitle className="text-lg">Received Credentials</CardTitle>
  <CardDescription>Credentials received after purchasing ingredients from manufacturer</CardDescription>
</CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="px-4 py-2 font-medium text-gray-700">Product</th>
                    <th className="px-4 py-2 font-medium text-gray-700">Batch No.</th>
                    <th className="px-4 py-2 font-medium text-gray-700">Production</th>
                    <th className="px-4 py-2 font-medium text-gray-700">Expiry</th>
                    <th className="px-4 py-2 font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((batch, index) => (
                    <tr
                      key={batch.id}
                      className={`border-b hover:bg-gray-50 transition ${
                        selectedBatch?.id === batch.id ? "bg-emerald-50" : index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-2">{batch.productName}</td>
                      <td className="px-4 py-2">{batch.batchNumber}</td>
                      <td className="px-4 py-2">{batch.productionDate.split("T")[0]}</td>
                      <td className="px-4 py-2">{batch.expiryDate.split("T")[0]}</td>
                      <td className="px-4 py-2">
                        <Button size="sm" variant="outline" onClick={() => openModal(batch)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {/* Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-4xl">
            {selectedBatch && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    {selectedBatch.productName}
                  </DialogTitle>
                  <p className="text-sm text-gray-500">
                    Batch: {selectedBatch.batchNumber}
                  </p>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-500">Production Date: </span>
                        {selectedBatch.productionDate.split("T")[0]}
                      </p>
                      <p>
                        <span className="text-gray-500">Expiry Date: </span>
                        {selectedBatch.expiryDate.split("T")[0]}
                      </p>
                      <p>
                        <span className="text-gray-500">Description: </span>
                        {selectedBatch.description}
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Verification Status: </span>
                        {selectedBatch.status === "approved" ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-green-600">Verified</span>
                          </>
                        ) : selectedBatch.status === "pending" ? (
                          <>
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <span className="text-yellow-600">Pending</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="text-red-600">Rejected</span>
                          </>
                        )}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <IngredientsList ingredients={selectedBatch.ingredients} />
                  </div>

                  <div className="flex justify-center items-start">
                    {selectedBatch.qrCode ? (
                      <QRCodeDisplay
                        qrCodeUrl={selectedBatch.qrCode}
                        batchNumber={selectedBatch.batchNumber}
                      />
                    ) : (
                      <p className="text-gray-500">QR Code not available</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
