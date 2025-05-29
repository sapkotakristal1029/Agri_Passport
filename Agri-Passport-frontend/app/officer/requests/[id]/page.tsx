"use client";

import api from "@/api/axiosInstance";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { BatchStatusBadge } from "@/components/shared/batch-status-badge";
import { IngredientsList } from "@/components/shared/ingredients-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useData } from "@/context/data-context";
import { formatDate, getImageUrl } from "@/lib/utils";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BatchRequestDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [batch, setBatch] = useState<any>();
  const [checklist, setChecklist] = useState({
    hygiene: false,
    packaging: false,
    expiration: false,
  });
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    api.get(`/batch/${id}`).then((response) => {
      const data = response.data;
      setBatch(data);
    });

    // if (foundBatch?.checklist) {
    //   setChecklist(foundBatch.checklist);
    // }

    // if (foundBatch?.feedback) {
    //   setFeedback(foundBatch.feedback);
    // }
  }, [id]);

  const handleChecklistChange = (field: keyof typeof checklist) => {
    setChecklist((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleApprove = () => {
    api
      .patch(`/batch/${id}/status`, {
        status: "approved",
      })
      .then(() => {
        router.push("/officer/requests");
      });
  };

  const handleReject = () => {
    api
      .patch(`/batch/${id}/status`, {
        status: "rejected",
      })
      .then(() => {
        router.push("/officer/requests");
      });
  };

  if (!batch) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Batch not found</h2>
          <p className="text-gray-500 mt-2">
            The requested batch could not be found.
          </p>
          <Link href="/officer/requests">
            <Button className="mt-4">Back to Requests</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/officer/requests">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Batch Request Details
          </h1>
          <div className="ml-auto">
            <BatchStatusBadge status={batch.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{batch.productName}</CardTitle>
                <CardDescription>
                  Batch Number: {batch.batchNumber}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Product Details
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-gray-500">
                          Production Date:
                        </span>
                        <p className="text-sm">
                          {formatDate(batch.productionDate)}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">
                          Expiry Date:
                        </span>
                        <p className="text-sm">
                          {formatDate(batch.expiryDate)}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">
                          Description:
                        </span>
                        <p className="text-sm">{batch.description}</p>
                      </div>
                    </div>
                  </div>
                  {/* <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Sample Image
                    </h3>
                    <Image
                      src={getImageUrl(batch.sampleImage) || "/placeholder.svg"}
                      alt={batch.productName}
                      width={200}
                      height={200}
                      className="rounded-md object-cover"
                    />
                  </div> */}
                </div>

                <Separator />

                <IngredientsList ingredients={batch.ingredients} />

                <Separator />

                <Separator />
                

                {
                  batch.sources && batch.sources.length > 0 ? (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Sources
                      </h3>
                      <ul className="list-disc list-inside space-y-1">
                        {batch.sources.map((source: any) => (
                          <li key={source.id} className="text-sm">
                            {source.name} - {source.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ): <p className="text-sm text-gray-500">No ingredients listed</p>
                }

                <Separator />

                {/* {batch.status === "pending" ? (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Safety Checklist
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hygiene"
                          checked={checklist.hygiene}
                          onCheckedChange={() =>
                            handleChecklistChange("hygiene")
                          }
                        />
                        <Label htmlFor="hygiene">Meets hygiene standards</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="packaging"
                          checked={checklist.packaging}
                          onCheckedChange={() =>
                            handleChecklistChange("packaging")
                          }
                        />
                        <Label htmlFor="packaging">
                          Packaging meets safety requirements
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="expiration"
                          checked={checklist.expiration}
                          onCheckedChange={() =>
                            handleChecklistChange("expiration")
                          }
                        />
                        <Label htmlFor="expiration">
                          Expiration date properly labeled
                        </Label>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <Label htmlFor="feedback">Feedback</Label>
                      <Textarea
                        id="feedback"
                        placeholder="Provide feedback about this batch"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Verification Results
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`h-5 w-5 rounded-full flex items-center justify-center ${
                            batch.checklist?.hygiene
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          {batch.checklist?.hygiene ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <span>Hygiene standards</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`h-5 w-5 rounded-full flex items-center justify-center ${
                            batch.checklist?.packaging
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          {batch.checklist?.packaging ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <span>Packaging requirements</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`h-5 w-5 rounded-full flex items-center justify-center ${
                            batch.checklist?.expiration
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          {batch.checklist?.expiration ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <span>Expiration labeling</span>
                      </div>
                    </div>

                    {batch.feedback && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Feedback:
                        </h4>
                        <p className="text-sm">{batch.feedback}</p>
                      </div>
                    )}
                  </div>
                )} */}
              </CardContent>
              {batch.status === "pending" && (
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={handleReject}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleApprove}
                    // disabled={
                    //   !checklist.hygiene ||
                    //   !checklist.packaging ||
                    //   !checklist.expiration
                    // }
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve & Issue Credential
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Verification Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-full ${
                        batch.status === "approved"
                          ? "bg-green-100"
                          : batch.status === "rejected"
                          ? "bg-red-100"
                          : "bg-yellow-100"
                      }`}
                    >
                      {batch.status === "approved" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : batch.status === "rejected" ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-yellow-600 border-t-transparent" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {batch.status === "approved"
                          ? "Approved"
                          : batch.status === "rejected"
                          ? "Rejected"
                          : "Pending Review"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {batch.status === "approved"
                          ? "Credential issued"
                          : batch.status === "rejected"
                          ? "Failed verification"
                          : "Awaiting verification"}
                      </p>
                    </div>
                  </div>

                  {batch.status === "approved" && batch.verificationDate && (
                    <div>
                      <p className="text-xs text-gray-500">Verified on:</p>
                      <p className="text-sm">{batch.verificationDate}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
