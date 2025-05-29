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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useData } from "@/context/data-context";
import { ClipboardList, Package, QrCode } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export default function ManufacturerDashboard() {
  const [manufacturerBatches, setManufacturerBatches] = useState<any[]>([]);

  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");

  useEffect(() => {
    api
      .get("/batch/user")
      .then((response) => {
        const data = response.data;
        setManufacturerBatches(data);
      })
      .catch((error) => {
        console.error("Error fetching batches:", error);
      });
  }, []);

  const pendingCount = manufacturerBatches.filter(
    (batch) => batch.status === "pending"
  ).length;
  const approvedCount = manufacturerBatches.filter(
    (batch) => batch.status === "approved"
  ).length;
  const rejectedCount = manufacturerBatches.filter(
    (batch) => batch.status === "rejected"
  ).length;

  useEffect(() => {
    if (selectedBatch) {
      api.get(`batch/${selectedBatch._id}/qr-details`).then((response) => {
        const data = response.data;
        setQrCodeData(data);
      }
      ).catch((error) => {
        console.error("Error fetching QR code data:", error);
      });
    }
  }, [selectedBatch]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manufacturer Dashboard
          </h1>
          <p className="text-gray-500">
            Manage your product batches and credentials
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Batches</CardTitle>
              <CardDescription>Awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <ClipboardList className="h-5 w-5 text-yellow-600" />
                  </div>
                  <span className="text-2xl font-bold">{pendingCount}</span>
                </div>
                <BatchStatusBadge status="pending" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Approved Batches</CardTitle>
              <CardDescription>Ready for distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-full">
                    <QrCode className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold">{approvedCount}</span>
                </div>
                <BatchStatusBadge status="approved" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Rejected Batches</CardTitle>
              <CardDescription>Requires attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 rounded-full">
                    <Package className="h-5 w-5 text-red-600" />
                  </div>
                  <span className="text-2xl font-bold">{rejectedCount}</span>
                </div>
                <BatchStatusBadge status="rejected" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Batches</h2>
          <Link href="/manufacturer/new-batch">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Submit New Batch
            </Button>
          </Link>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Production Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credential
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {manufacturerBatches.length === 0 ? (
                <tr key="no-batches">
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No batches found.{" "}
                    <a href="/manufacturer/new-batch">Submit</a> your first
                    batch.
                  </td>
                </tr>
              ) : (
                manufacturerBatches.map((batch) => (
                  <tr key={batch.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {batch.productName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {batch.batchNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {batch.productionDate.split("T")[0]}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <BatchStatusBadge status={batch.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {batch.credentialExId ? (
                          <span className="text-green-600 font-medium">
                            {batch.credentialExId}
                          </span>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {batch.status === "approved" &&
                      batch.credentialExId ? (
                          <Button onClick={()=>{
                            setSelectedBatch(batch);
                            setQrModalOpen(true);
                          }} variant="outline" size="sm">
                            View QR Code
                          </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          View QR Code
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen} >
        <DialogContent title="" >
          <DialogTitle className="text-lg font-semibold">
            QR Code for Batch {selectedBatch?.batchNumber || "Batch"}
          </DialogTitle>
        <div className="flex flex-col items-center mt-4 gap-4">
                      <div
                        id="qr-code-container"
                        className="border p-4 rounded-md bg-gray-50 flex justify-center"
                      >
                        <QRCode
                          id="qr-code"
                          size={256}

                          style={{ height: "auto", maxWidth: "100%", width: "100%", }}
                          value={JSON.stringify(qrCodeData)}
                          viewBox={`0 0 256 256`}
                        />
                      </div>
                      <Button
                        onClick={() => {
                          const svg = document.getElementById("qr-code");
                          const serializer = new XMLSerializer();

                          if (!svg) {
                            alert("QR code not found!");
                            return;
                          }
                          const source = serializer.serializeToString(svg);

                          const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
                          const url = URL.createObjectURL(svgBlob);

                          const downloadLink = document.createElement("a");
                          downloadLink.href = url;
                          downloadLink.download = `qr-${selectedBatch?.batchNumber || "batch"}.svg`;
                          document.body.appendChild(downloadLink);
                          downloadLink.click();
                          document.body.removeChild(downloadLink);
                          URL.revokeObjectURL(url);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Download QR
                      </Button>
                    </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
