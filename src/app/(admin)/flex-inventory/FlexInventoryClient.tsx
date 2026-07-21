"use client";

import { useState, useTransition } from "react";
import { PackageSearch, ArrowUpRight, ArrowDownRight, Package, Plus, Loader2 } from "lucide-react";
import { addFlexTransaction } from "@/backend/actions/actions";

const STANDARD_SIZES = [
  "25X25", "25X20", "20X20", "20X10", "30X20", 
  "40X30", "40X31", "40X20", "20X30", "50X25", 
  "30X30", "50X8", "18X10", "40X8", "60X8", 
  "10X8", "100X8", "60X20", "100X20", "40X25"
];

type FlexTransaction = {
  id: string;
  type: "INWARD" | "OUTWARD";
  size: string;
  quantity: number;
  notes?: string;
  created_at: string;
};

export default function FlexInventoryClient({ transactions }: { transactions: FlexTransaction[] }) {
  const [activeTab, setActiveTab] = useState<"Stock" | "Transactions">("Stock");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [txType, setTxType] = useState<"INWARD" | "OUTWARD">("INWARD");
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Calculate Real-time Stock per Size
  const stockMap: Record<string, { inward: number; outward: number; available: number }> = {};
  STANDARD_SIZES.forEach(size => {
    stockMap[size] = { inward: 0, outward: 0, available: 0 };
  });

  transactions.forEach(tx => {
    if (!stockMap[tx.size]) stockMap[tx.size] = { inward: 0, outward: 0, available: 0 };
    if (tx.type === "INWARD") {
      stockMap[tx.size].inward += tx.quantity;
      stockMap[tx.size].available += tx.quantity;
    } else if (tx.type === "OUTWARD") {
      stockMap[tx.size].outward += tx.quantity;
      stockMap[tx.size].available -= tx.quantity;
    }
  });

  const handleTransactionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("type", txType);
    
    startTransition(async () => {
      const res = await addFlexTransaction(formData);
      if (res.success) {
        setIsModalOpen(false);
      } else {
        alert(res.error || "Failed to add transaction");
      }
    });
  };

  const totalAvailable = Object.values(stockMap).reduce((acc, curr) => acc + curr.available, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Flex Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage real-time inward and outward stock</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Transaction
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-900">{totalAvailable}</p>
            <p className="text-sm text-gray-500 font-medium">Total Flex Available</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <PackageSearch className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab("Stock")}
          className={`pb-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "Stock" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Current Stock
        </button>
        <button 
          onClick={() => setActiveTab("Transactions")}
          className={`pb-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "Transactions" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Transaction History
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {activeTab === "Stock" ? (
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sr No.</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-4 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Inward</th>
                <th className="px-4 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Outward</th>
                <th className="px-4 py-4 text-right text-xs font-bold text-indigo-600 uppercase tracking-wider">Available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.keys(stockMap).map((size, idx) => (
                <tr key={size} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{size}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{stockMap[size].inward}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{stockMap[size].outward}</td>
                  <td className="px-4 py-3 text-right font-bold text-indigo-600 bg-indigo-50/30">{stockMap[size].available}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-4 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No transactions recorded yet.</td></tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(tx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${tx.type === 'INWARD' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {tx.type === 'INWARD' ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">{tx.size}</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-700">{tx.quantity}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs truncate max-w-[140px]">{tx.notes || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">New Transaction</h3>
                <p className="text-xs text-gray-500 mt-0.5">Log inward or outward flex rolls.</p>
              </div>
            </div>
            
            <form onSubmit={handleTransactionSubmit} className="p-6 space-y-5">
              {/* Type Switch */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setTxType("INWARD")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${txType === "INWARD" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  📥 INWARD
                </button>
                <button
                  type="button"
                  onClick={() => setTxType("OUTWARD")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${txType === "OUTWARD" ? "bg-white text-rose-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  📤 OUTWARD
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Size</label>
                  <select 
                    name={isCustomSize ? undefined : "size"} 
                    onChange={(e) => setIsCustomSize(e.target.value === "custom")}
                    required={!isCustomSize} 
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                  >
                    <option value="">Select a size...</option>
                    {STANDARD_SIZES.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                    <option value="custom">Custom Size...</option>
                  </select>
                  {isCustomSize && (
                    <input 
                      type="text" 
                      name="size" 
                      required 
                      className="w-full mt-2 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" 
                      placeholder="e.g. 15X15" 
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Quantity (Rolls)</label>
                  <input type="number" name="quantity" required min="1" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" placeholder="e.g. 5" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Notes (Optional)</label>
                  <input type="text" name="notes" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" placeholder="e.g. Received from supplier..." />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
