import { ArrowUpRight, ArrowDownRight, MapPin, Target, Users, Activity } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI Card 1 */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Sites</h3>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <div className="text-3xl font-bold font-heading text-foreground mt-2">248</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-available flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> +4
              </span>
              since last month
            </p>
          </div>
        </div>
        
        {/* KPI Card 2 */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Occupancy</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <div className="text-3xl font-bold font-heading text-foreground mt-2">71%</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-available flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> +4%
              </span>
              since last month
            </p>
          </div>
        </div>

        {/* KPI Card 3 */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">New Enquiries</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <div className="text-3xl font-bold font-heading text-foreground mt-2">42</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-destructive flex items-center mr-1">
                <ArrowDownRight className="h-3 w-3 mr-0.5" /> -2%
              </span>
              since last week
            </p>
          </div>
        </div>

        {/* KPI Card 4 */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Conversion Rate</h3>
            <Target className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <div className="text-3xl font-bold font-heading text-foreground mt-2">18.2%</div>
             <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-available flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> +1.2%
              </span>
              since last month
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="rounded-xl border border-border bg-card shadow-sm lg:col-span-4 flex flex-col">
          <div className="p-6 pb-2">
            <h3 className="font-semibold leading-none tracking-tight">Recent Enquiries</h3>
            <p className="text-sm text-muted-foreground mt-2">You have 5 new enquiries today.</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {/* Dummy Enquiry Rows */}
              {[
                { name: "Acme Corp", contact: "john@acme.com", status: "New", color: "bg-primary text-primary-foreground", time: "10 min ago" },
                { name: "Globex Inc", contact: "sarah@globex.co", status: "Contacted", color: "bg-muted text-muted-foreground", time: "2 hours ago" },
                { name: "Initech", contact: "peter@initech.com", status: "Converted", color: "bg-available text-primary-foreground", time: "Yesterday" }
              ].map((eq, i) => (
                <div key={i} className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center font-medium text-sm text-secondary-foreground">
                    {eq.name.substring(0,2).toUpperCase()}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{eq.name}</p>
                    <p className="text-sm text-muted-foreground">{eq.contact}</p>
                  </div>
                  <div className="ml-auto font-medium text-sm flex items-center gap-3">
                    <span className="text-xs text-muted-foreground hidden sm:inline-block">{eq.time}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${eq.color}`}>
                      {eq.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card shadow-sm lg:col-span-3">
          <div className="p-6 pb-2">
            <h3 className="font-semibold leading-none tracking-tight">Occupancy by Area</h3>
            <p className="text-sm text-muted-foreground mt-2">Current fill rate across districts.</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { area: "Downtown", percent: 92 },
                { area: "North Ring", percent: 78 },
                { area: "Airport Zone", percent: 85 },
                { area: "West End", percent: 45 },
              ].map((area, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{area.area}</span>
                    <span className="text-muted-foreground">{area.percent}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${area.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
