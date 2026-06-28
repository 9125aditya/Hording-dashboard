"use client";

import { useTransition } from "react";
import { Check, X } from "lucide-react";
import { approveRequest, rejectRequest } from "@/backend/actions/approvals";

export default function ApprovalActions({ requestId }: { requestId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const res = await approveRequest(requestId);
      if (res?.error) alert(res.error);
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const res = await rejectRequest(requestId);
      if (res?.error) alert(res.error);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        disabled={isPending}
        onClick={handleApprove}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 h-8 px-3 py-1"
      >
        <Check className="mr-1.5 h-3.5 w-3.5" /> Approve
      </button>
      <button 
        disabled={isPending}
        onClick={handleReject}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-red-100 text-red-700 hover:bg-red-200 h-8 px-3 py-1"
      >
        <X className="mr-1.5 h-3.5 w-3.5" /> Reject
      </button>
    </div>
  );
}
