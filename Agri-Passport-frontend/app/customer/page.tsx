"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { CheckCircle, XCircle } from "lucide-react";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const ScannedProductDetails = ({ data }: { data: any }) => {
  if (!data) return null;

  return (
    <div className="bg-white shadow rounded p-6 space-y-6 max-w-2xl w-full mx-auto mt-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-emerald-800">
            {data.productName}
          </h2>
          <p className="text-gray-500">Batch: {data.batchNumber}</p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            data.status === "approved"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {data.status === "approved" ? "Verified" : "Not Verified"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p>
            <strong>Production Date:</strong> {formatDate(data.productionDate)}
          </p>
          <p>
            <strong>Expiry Date:</strong> {formatDate(data.expiryDate)}
          </p>
          <p>
            <strong>Description:</strong> {data.description}
          </p>
        </div>
        {/* <div className="text-center">
          {data.sampleImage ? (
            <img
              src={data.sampleImage}
              alt={data.productName}
              className="w-48 h-48 object-cover mx-auto rounded"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center bg-gray-100 text-gray-400 rounded mx-auto">
              No Image
            </div>
          )}
        </div> */}
      </div>

      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-2">
          Ingredients
        </h3>
        <ul className="space-y-2">
          {data.ingredients?.map((ing: any, idx: number) => (
            <li key={idx} className="bg-gray-50 p-3 rounded border">
              <p>
                <strong>{ing.name}</strong> – {ing.quantity} {ing.unit}
              </p>
              {ing.credential_id && (
                <div className="ml-4 mt-2 text-sm text-gray-600">
                  <p>
                    <em>From: {ing.credential_id.productName}</em>
                  </p>
                  <p>
                    Batch {ing.credential_id.batchNumber} |{" "}
                    {formatDate(ing.credential_id.productionDate)} →{" "}
                    {formatDate(ing.credential_id.expiryDate)}
                  </p>
                  {
                    ing.credential_id.status === "approved" && <p>
                    Status:{" "}
                    <span
                      className={
                        ing.credential_id.status === "approved"
                          ? "text-green-700"
                          : "text-red-700"
                      }
                    >
                      {ing.credential_id.status}
                    </span>
                  </p>
                  }
                  
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {data.sources?.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-2">Sources</h3>
          <ul className="list-disc ml-6 text-sm text-gray-700">
            {data.sources.map((src: any) => (
              <li key={src._id}>
                <strong>{src.name}</strong>: {src.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded">
        {data.status === "approved" ? (
          <>
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800">Verified & Safe</p>
              <p className="text-sm text-gray-600">
                This product was verified by a food safety authority.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="p-2 bg-red-100 rounded-full">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-red-800">Not Verified</p>
              <p className="text-sm text-gray-600">
                This product is unverified or failed inspection.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default function QRScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        stream.getTracks().forEach((t) => t.stop());
        return navigator.mediaDevices.enumerateDevices();
      })
      .then((devices) => {
        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      })
      .catch((err) => {
        console.error("Camera error:", err);
        setError("Failed to access camera. Please check permissions.");
      });
  }, []);

  useEffect(() => {
    if (!selectedDeviceId || !videoRef.current) return;

    const startScanner = async () => {
      try {
        // Stop existing stream if any
        const existingStream = videoRef.current!.srcObject as MediaStream;
        existingStream?.getTracks().forEach((track) => track.stop());
        videoRef.current!.srcObject = null;

        if (!codeReaderRef.current) {
          codeReaderRef.current = new BrowserMultiFormatReader();
        }

        if (videoRef.current) {
          await codeReaderRef.current.decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.current,
            (result, err) => {
              if (result) {
                try {
                  const raw = result.getText();
                  console.log("Scanned raw text:", raw);
                  const parsed = JSON.parse(raw);
                  setScanResult(parsed);
                } catch (e) {
                  console.error("Failed to parse QR data", e);
                  setError("Invalid QR code data");
                }
              }
            }
          );
        }
        
      } catch (err) {
        console.error("Scanner error:", err);
        setError("Could not start scanner.");
      }
    };

    startScanner();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [selectedDeviceId]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-center mb-4">
        QR Code Product Scanner
      </h1>

      {devices.length > 1 && (
        <select
          className="mb-4 p-2 rounded border"
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
        >
          {devices.map((device, idx) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${idx + 1}`}
            </option>
          ))}
        </select>
      )}

      <video
        ref={videoRef}
        className="w-full max-w-md rounded shadow border"
        autoPlay
        muted
      />

      {error && (
        <div className="mt-4 text-red-600 bg-red-100 p-3 rounded">{error}</div>
      )}

      {scanResult && <ScannedProductDetails data={scanResult} />}
    </div>
  );
}
