import { Search, Plus, UserCircle2, Briefcase, Phone, IndianRupee } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import AddStaffModal from "./AddStaffModal";
import StaffActions from "./StaffActions";

export default async function StaffPage() {
  const supabase = await createClient();
  const { data: dbStaff } = await supabase.from('staff').select('*').order('created_at', { ascending: false });

  const staff = dbStaff || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-heading">Staff Directory</h1>
          <p className="text-sm text-muted-foreground">Manage your employees, roles, and payroll information.</p>
        </div>
        <AddStaffModal />
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by name or department..." 
              className="w-full h-9 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          {staff.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <UserCircle2 className="h-16 w-16 mb-4 opacity-20" />
              <p className="font-medium text-foreground">No staff members found</p>
              <p className="text-sm">Click "Add Staff Member" to populate your directory.</p>
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
                {staff.map((member: any) => (
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
    </div>
  );
}
