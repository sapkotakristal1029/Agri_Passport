"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface QRCodeDisplayProps {
  qrCodeUrl: string
  batchNumber: string
}

export function QRCodeDisplay({ qrCodeUrl, batchNumber }: QRCodeDisplayProps) {
  const handleDownload = () => {
    // In a real app, this would download the QR code
    alert("QR Code download functionality would be implemented here")
  }

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg bg-white">
      {/* <div className="mb-4">
        <Image
          src={qrCodeUrl || "/placeholder.svg"}
          alt={`QR Code for batch ${batchNumber}`}
          width={200}
          height={200}
          className="border"
        />
      </div> */}
      <p className="text-sm text-gray-500 mb-4">Batch: {batchNumber}</p>
      <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleDownload}>
        <Download className="h-4 w-4" />
        Download QR Code
      </Button>
    </div>
  )
}
