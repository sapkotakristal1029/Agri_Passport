"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import api from "@/api/axiosInstance";
import QRCode from "react-qr-code";

export default function CredentialsPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [manufacturer, setManufacturer] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [batchToShare, setBatchToShare] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [qrDetails, setQrDetails] = useState({})

  useEffect(() => {
    api.get("batch/approved").then((response) => setBatches(response.data));
    api
      .get("auth/manufacturers")
      .then((response) => setManufacturer(response.data));
  }, []);

  const manufacturerOptions = useMemo(
    () => manufacturer.map((m: any) => ({ value: m._id, label: m.username })),
    [manufacturer]
  );

  const openModal = (batch: any) => {
    setSelectedBatch(batch);
    setShowModal(true);
  };

  const onShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !batchToShare) return;

    try {
      const res = await api.post("batch/share", {
        batchId: batchToShare._id,
        userId: selectedUser,
      });
      if (res.status === 200) {
        alert("Batch shared successfully!");
        setShareModal(false);
        setBatchToShare(null);
        setSelectedUser(null);
      }
    } catch (err) {
      alert("Error sharing batch");
    }
  };

  useEffect(()=>{
    if(selectedBatch){
      api.get(`batch/${selectedBatch._id}/qr-details`).then((response) => {
        const data = response.data;
        setQrDetails(data);
      }
      ).catch((error) => {
        console.error("Error fetching QR details:", error);
      });
    }
  }, [selectedBatch])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/manufacturer">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Product Credentials
          </h1>
        </div>

        {batches.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Credentials Available</CardTitle>
              <CardDescription>
                You don't have any approved batches with issued credentials yet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">
                Submit a new batch for approval to receive a credential and QR
                code.
              </p>
              <Link href="/manufacturer/new-batch">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Submit New Batch
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Product Batch Credentials</CardTitle>
                <CardDescription>
                  Select a batch to view its credential
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="min-w-full table-auto text-sm">
                  <thead className="bg-gray-100 text-left">
                    <tr>
                      <th className="px-4 py-2">Product</th>
                      <th className="px-4 py-2">Batch No.</th>
                      <th className="px-4 py-2">Production</th>
                      <th className="px-4 py-2">Expiry</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches.map((batch) => (
                      <tr key={batch._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{batch.productName}</td>
                        <td className="px-4 py-2">{batch.batchNumber}</td>
                        <td className="px-4 py-2">
                          {batch.productionDate.split("T")[0]}
                        </td>
                        <td className="px-4 py-2">
                          {batch.expiryDate.split("T")[0]}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openModal(batch)}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                setBatchToShare(batch);
                                setShareModal(true);
                              }}
                            >
                              Share
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogContent className="max-w-4xl">
                {selectedBatch && (
                  <>
                    <DialogHeader>
                      <DialogTitle>{selectedBatch.productName}</DialogTitle>
                      <p className="text-sm text-gray-500">
                        Batch: {selectedBatch.batchNumber}
                      </p>
                    </DialogHeader>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-gray-500">
                            Production Date:{" "}
                          </span>
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
                        <Separator className="my-4" />
                        <IngredientsList
                          ingredients={selectedBatch.ingredients}
                        />
                        <Separator className="my-4" />
                        <h3 className="text-base font-semibold">Sources</h3>
                        {selectedBatch.sources?.map((src: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-3 border rounded bg-gray-50"
                          >
                            <p>
                              <strong>Name:</strong> {src.name}
                            </p>
                            <p>
                              <strong>Description:</strong> {src.description}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-center items-start">

                  <div className="mt-4 border p-4 rounded-md bg-gray-50 flex justify-center">

                    <div className="flex flex-col items-center mt-4 gap-4">
                      <div
                        id="qr-code-container"
                        className="border p-4 rounded-md bg-gray-50 flex justify-center"
                      >
                        <QRCode
                          id="qr-code"
                          size={256}

                          style={{ height: "auto", maxWidth: "100%", width: "100%", }}
                          value={JSON.stringify(qrDetails)}
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

                  </div>
                      </div>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>

            <Dialog open={shareModal} onOpenChange={setShareModal}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Share Credential</DialogTitle>
                  <p className="text-sm text-gray-500">
                    Share batch <strong>{batchToShare?.batchNumber}</strong>{" "}
                    with another manufacturer.
                  </p>
                </DialogHeader>
                <form onSubmit={onShare} className="space-y-4 mt-4">
                  <div> 
                    <label
                      htmlFor="manufacturer"
                      className="text-sm font-medium block mb-1"
                    >
                      Select Manufacturer
                    </label>s
                    <select
                      id="manufacturer"
                      value={selectedUser ?? ""}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-emerald-500"
                      required
                    >
                      <option value="" hidden>
                        -- Choose Manufacturer --
                      </option>
                      {manufacturerOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Share
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
