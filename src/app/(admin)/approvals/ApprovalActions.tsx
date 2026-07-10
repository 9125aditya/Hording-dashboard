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
        className="inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 h-9 px-4"
      >
        <Check className="mr-1.5 h-3.5 w-3.5" /> Approve
      </button>
      <button 
        disabled={isPending}
        onClick={handleReject}
        className="inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 h-9 px-4"
      >
        <X className="mr-1.5 h-3.5 w-3.5" /> Reject
      </button>
    </div>
  );
}
