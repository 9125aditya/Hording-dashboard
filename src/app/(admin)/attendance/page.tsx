"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Download, Calendar } from "lucide-react";

type Employee = {
  name: string;
  id: string;
  role: string;
  city: string;
  location: "Office" | "On Field" | "—";
  checkIn: string;
  checkOut: string;
  status: "Present" | "Absent" | "Half-day";
  payType: "Full Day" | "Half Day" | "No Pay";
  type: "Admin" | "Worker";
};

const employees: Employee[] = [
  { name: "Rajesh Sharma", id: "E01", role: "Field Executive", city: "Mumbai", location: "Office", checkIn: "09:00", checkOut: "18:00", status: "Present", payType: "Full Day", type: "Worker" },
  { name: "Priya Nair", id: "E02", role: "Sales Executive", city: "Mumbai", location: "Office", checkIn: "09:12", checkOut: "18:12", status: "Present", payType: "Full Day", type: "Admin" },
  { name: "Amit Patil", id: "E03", role: "Site Supervisor", city: "Mumbai", location: "Office", checkIn: "09:30", checkOut: "18:30", status: "Present", payType: "Full Day", type: "Worker" },
  { name: "Sneha Kulkarni", id: "E04", role: "Ops Manager", city: "Mumbai", location: "—", checkIn: "—", checkOut: "—", status: "Absent", payType: "No Pay", type: "Admin" },
  { name: "Vikram Joshi", id: "E05", role: "Installer", city: "Mumbai", location: "Office", checkIn: "09:45", checkOut: "13:45", status: "Half-day", payType: "Half Day", type: "Worker" },
  { name: "Anil Deshmukh", id: "E06", role: "Field Executive", city: "Pune", location: "On Field", checkIn: "08:30", checkOut: "17:30", status: "Present", payType: "Full Day", type: "Worker" },
  { name: "Megha Rao", id: "E07", role: "Coordinator", city: "Pune", location: "Office", checkIn: "09:15", checkOut: "18:15", status: "Present", payType: "Full Day", type: "Admin" },
  { name: "Suresh Kumar", id: "E08", role: "Installer", city: "Nagpur", location: "On Field", checkIn: "08:00", checkOut: "16:00", status: "Present", payType: "Full Day", type: "Worker" },
  { name: "Kiran Patil", id: "E09", role: "Site Supervisor", city: "Nagpur", location: "Office", checkIn: "09:00", checkOut: "18:00", status: "Present", payType: "Full Day", type: "Worker" },
  { name: "Ravi Sharma", id: "E10", role: "Sales Executive", city: "Delhi", location: "—", checkIn: "—", checkOut: "—", status: "Absent", payType: "No Pay", type: "Admin" },
  { name: "Pooja Singh", id: "E11", role: "Field Executive", city: "Delhi", location: "Office", checkIn: "09:20", checkOut: "18:20", status: "Present", payType: "Full Day", type: "Worker" },
  { name: "Deepak Verma", id: "E12", role: "Installer", city: "Delhi", location: "On Field", checkIn: "10:00", checkOut: "14:00", status: "Half-day", payType: "Half Day", type: "Worker" },
  { name: "Anjali Mehta", id: "E13", role: "Ops Manager", city: "Mumbai", location: "Office", checkIn: "09:05", checkOut: "18:05", status: "Present", payType: "Full Day", type: "Admin" },
  { name: "Rahul Gupta", id: "E14", role: "Field Executive", city: "Pune", location: "—", checkIn: "—", checkOut: "—", status: "Absent", payType: "No Pay", type: "Worker" },
  { name: "Neha Jain", id: "E15", role: "Coordinator", city: "Nagpur", location: "Office", checkIn: "09:10", checkOut: "18:10", status: "Present", payType: "Full Day", type: "Admin" },
  { name: "Manoj Tiwari", id: "E16", role: "Installer", city: "Mumbai", location: "Office", checkIn: "09:40", checkOut: "18:40", status: "Present", payType: "Full Day", type: "Worker" },
  { name: "Sanjay Patel", id: "E17", role: "Site Supervisor", city: "Delhi", location: "—", checkIn: "—", checkOut: "—", status: "Absent", payType: "No Pay", type: "Worker" },
];

const allCities = ["All", "Mumbai", "Pune", "Nagpur", "Delhi"];
const typeFilters = ["Admin", "Worker"];

export default function AttendancePage() {
  const [typeFilter, setTypeFilter] = useState<string>("Admin");
  const [cityFilter, setCityFilter] = useState<string>("All");
  const [currentDate] = useState(new Date());

  const filtered = employees.filter((e) => {
    const typeMatch = typeFilter === "Admin" ? e.type === "Admin" : e.type === "Worker";
    const cityMatch = cityFilter === "All" || e.city === cityFilter;
    return typeMatch && cityMatch;
  });

  const total = filtered.length;
  const present = filtered.filter((e) => e.status === "Present").length;
  const onField = filtered.filter((e) => e.location === "On Field").length;
  const halfDay = filtered.filter((e) => e.status === "Half-day").length;
  const absent = filtered.filter((e) => e.status === "Absent").length;

  const dateStr = currentDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const dateInput = currentDate.toISOString().split("T")[0];

  const statusColor = (s: string) => {
    if (s === "Present") return { bg: "#dcfce7", text: "#16a34a" };
    if (s === "Absent") return { bg: "#fee2e2", text: "#dc2626" };
    return { bg: "#fef9c3", text: "#ca8a04" };
  };

  const payColor = (p: string) => {
    if (p === "Full Day") return { bg: "#dbeafe", text: "#2563eb" };
    if (p === "No Pay") return { bg: "#fee2e2", text: "#dc2626" };
    return { bg: "#fef9c3", text: "#ca8a04" };
  };

  return (
    <div className="space-y-4">
      {/* Top Bar: Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Type Tabs */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
          {typeFilters.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                typeFilter === t ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* City Tabs */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
          {allCities.map((c) => (
            <button
              key={c}
              onClick={() => setCityFilter(c)}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                cityFilter === c ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
          <span className="hidden sm:inline">{dateStr}</span>
          <button className="p-1.5 rounded hover:bg-gray-200 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
            <input type="date" defaultValue={dateInput} className="text-sm bg-transparent outline-none w-28" />
            <Calendar className="h-4 w-4 text-gray-400" />
          </div>
          <button className="p-1.5 rounded hover:bg-gray-200 transition-colors"><ChevronRight className="h-4 w-4" /></button>
        </div>

        {/* Export */}
        <button className="flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
          <Download className="h-4 w-4" /> Export
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="TOTAL" value={total} color="#0f172a" bar="#3b82f6" />
        <KpiCard label="PRESENT" value={present} color="#16a34a" bar="#16a34a" />
        <KpiCard label="ON FIELD" value={onField} color="#2563eb" bar="#2563eb" />
        <KpiCard label="HALF-DAY" value={halfDay} color="#ca8a04" bar="#ca8a04" />
        <KpiCard label="ABSENT / OFF" value={absent} color="#dc2626" bar="#dc2626" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["EMPLOYEE", "ROLE", "CITY", "LOCATION", "CHECK-IN", "CHECK-OUT", "STATUS", "PAY TYPE", "MARK STATUS", "MARK PAY"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp) => {
              const sc = statusColor(emp.status);
              const pc = payColor(emp.payType);
              return (
                <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-gray-900">{emp.name}</div>
                    <div className="text-xs text-gray-400">{emp.id}</div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{emp.role}</td>
                  <td className="px-4 py-3.5 text-gray-600">{emp.city}</td>
                  <td className="px-4 py-3.5">
                    {emp.location === "Office" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        🏢 Office
                      </span>
                    ) : emp.location === "On Field" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                        🌍 On Field
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-gray-700">{emp.checkIn}</td>
                  <td className="px-4 py-3.5 font-mono text-gray-700">{emp.checkOut}</td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: pc.bg, color: pc.text }}>
                      {emp.payType}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <select
                      defaultValue={emp.status}
                      className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option>Present</option>
                      <option>Absent</option>
                      <option>Half-day</option>
                    </select>
                  </td>
                  <td className="px-4 py-3.5">
                    <select
                      defaultValue={emp.payType}
                      className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option>Full Day</option>
                      <option>Half Day</option>
                      <option>No Pay</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KpiCard({ label, value, color, bar }: { label: string; value: number; color: string; bar: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <p className="text-3xl font-bold" style={{ color }}>{value}</p>
      <p className="text-[11px] text-gray-400 uppercase font-semibold tracking-wider mt-1">{label}</p>
      <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: '100%', backgroundColor: bar, opacity: 0.6 }} />
      </div>
    </div>
  );
}
