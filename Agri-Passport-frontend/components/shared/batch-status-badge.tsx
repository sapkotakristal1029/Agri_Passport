import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface BatchStatusBadgeProps {
  status: "pending" | "approved" | "rejected"
  className?: string
}

export function BatchStatusBadge({ status, className }: BatchStatusBadgeProps) {
  return (
    <Badge
      className={cn(
        "text-xs font-medium",
        status === "pending" && "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        status === "approved" && "bg-green-100 text-green-800 hover:bg-green-100",
        status === "rejected" && "bg-red-100 text-red-800 hover:bg-red-100",
        className,
      )}
    >
      {status === "pending" && "Pending"}
      {status === "approved" && "Approved"}
      {status === "rejected" && "Rejected"}
    </Badge>
  )
}
