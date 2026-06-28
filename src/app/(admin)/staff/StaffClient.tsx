"use client";

import { useState } from "react";
import { Search, UserCircle2, Briefcase, Phone, IndianRupee } from "lucide-react";
import StaffActions from "./StaffActions";

type StaffMember = {
  id: string;
  name: string;
  role: string | null;
  department: string | null;
  contact: string | null;
  pay_type: string | null;
  salary: number | null;
};

export default function StaffClient({ initialStaff }: { initialStaff: StaffMember[] }) {
  const [search, setSearch] = useState("");

  const filteredStaff = initialStaff.filter(member => {
    const s = search.toLowerCase();
    return (
      member.name?.toLowerCase().includes(s) ||
      member.department?.toLowerCase().includes(s) ||
      member.role?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by name, role or department..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto min-h-[400px]">
        {filteredStaff.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <UserCircle2 className="h-16 w-16 mb-4 opacity-20" />
            <p className="font-medium text-foreground">No staff members found</p>
            <p className="text-sm">Try adjusting your search criteria or add a new staff member.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Role & Department</th>
                <th className="px-6 py-3 font-medium">Contact</th>
                <th className="px-6 py-3 font-medium">Pay Type</th>
                <th className="px-6 py-3 font-medium text-right">Compensation</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <span className="font-medium text-foreground">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-foreground flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5 text-muted-foreground" />{member.role || 'N/A'}</span>
                      <span className="text-xs text-muted-foreground mt-0.5">{member.department || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground flex items-center gap-1.5 pt-6">
                    <Phone className="h-3.5 w-3.5" />
                    {member.contact || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${member.pay_type === 'Salaried' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
                      {member.pay_type || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-foreground">
                    <div className="flex items-center justify-end gap-1">
                      <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                      {member.salary ? member.salary.toLocaleString('en-IN') : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <StaffActions staffId={member.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
