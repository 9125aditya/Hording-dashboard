import { Search, CheckCircle2, XCircle, Mail, Clock } from "lucide-react";

const ENQUIRIES = [
  { id: 1, name: "Priya Sharma", company: "Reliance Retail", email: "priya@reliance.com", site: "Cyber Hub", status: "New", date: "10 mins ago" },
  { id: 2, name: "Rahul Desai", company: "Tata Motors", email: "rahul@tata.com", site: "Bandra Kurla Complex", status: "New", date: "2 hours ago" },
  { id: 3, name: "Amit Singh", company: "HDFC Bank", email: "amit@hdfc.com", site: "Sector 17", status: "Contacted", date: "Yesterday" },
  { id: 4, name: "Neha Gupta", company: "FabIndia", email: "neha@fabindia.com", site: "Sector 18", status: "Converted", date: "3 days ago" },
  { id: 5, name: "Vikram Malhotra", company: "Zomato", email: "vikram@zomato.com", site: "MI Road", status: "Lost", date: "Last week" },
];

export default function EnquiriesPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-heading">Enquiries</h1>
          <p className="text-sm text-muted-foreground">Manage leads from the public catalog.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm flex flex-1 overflow-hidden">
        
        {/* Inbox List (Left Panel) */}
        <div className="w-1/3 border-r border-border flex flex-col bg-muted/10">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search leads..." 
                className="w-full h-9 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2 mt-3">
              <button className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">All (42)</button>
              <button className="px-3 py-1 rounded-full hover:bg-muted text-muted-foreground text-xs font-medium">New (12)</button>
              <button className="px-3 py-1 rounded-full hover:bg-muted text-muted-foreground text-xs font-medium">Contacted</button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {ENQUIRIES.map((eq, i) => (
              <div key={eq.id} className={`p-4 border-b border-border cursor-pointer transition-colors ${i === 0 ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-muted/50'}`}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-sm">{eq.name}</h4>
                  <span className="text-xs text-muted-foreground">{eq.date}</span>
                </div>
                <div className="text-xs text-muted-foreground mb-2">{eq.company}</div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-foreground truncate max-w-[150px]">{eq.site}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider
                    ${eq.status === 'New' ? 'bg-primary text-primary-foreground' : 
                      eq.status === 'Contacted' ? 'bg-secondary text-secondary-foreground' : 
                      eq.status === 'Converted' ? 'bg-available text-primary-foreground' : 'bg-muted text-muted-foreground'}`
                  }>
                    {eq.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Detail (Right Panel) */}
        <div className="flex-1 flex flex-col bg-background relative">
          {/* Header */}
          <div className="p-6 border-b border-border flex justify-between items-start">
             <div>
               <h2 className="text-2xl font-bold tracking-tight">Priya Sharma</h2>
               <p className="text-muted-foreground text-sm mt-1 flex items-center"><Mail className="h-3 w-3 mr-1"/> priya@reliance.com</p>
             </div>
             <div className="flex gap-2">
               <button className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm hover:bg-secondary/80 transition-colors">
                 <Clock className="mr-2 h-4 w-4" /> Mark Contacted
               </button>
               <button className="inline-flex h-9 items-center justify-center rounded-md bg-available px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-available/90 transition-colors">
                 <CheckCircle2 className="mr-2 h-4 w-4" /> Convert
               </button>
               <button className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive hover:border-destructive hover:bg-destructive/10 transition-colors">
                 <XCircle className="h-4 w-4" />
               </button>
             </div>
          </div>
          
          {/* Body */}
          <div className="p-6 flex-1 overflow-y-auto">
             <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                   <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Company Details</h3>
                   <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                     <p className="text-sm"><span className="text-muted-foreground mr-2">Company:</span> <span className="font-medium">Reliance Retail</span></p>
                     <p className="text-sm"><span className="text-muted-foreground mr-2">Contact:</span> <span className="font-medium">+91 98765 43210</span></p>
                   </div>
                </div>
                <div>
                   <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Interest</h3>
                   <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                     <p className="text-sm"><span className="text-primary/70 mr-2">Site:</span> <span className="font-medium text-primary">Cyber Hub</span></p>
                     <p className="text-sm"><span className="text-primary/70 mr-2">ID:</span> <span className="font-mono text-xs">S-1043</span></p>
                   </div>
                </div>
             </div>

             <div>
               <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Message</h3>
               <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
                 <p className="text-sm leading-relaxed whitespace-pre-wrap">
                   Hi team,
                   
                   We are looking to launch a new festive campaign next quarter and the Cyber Hub digital hoarding fits our demographic perfectly.
                   
                   Could you please send over the rate card for Q3 and confirm if this site is available for a 4-week buy starting in July?
                   
                   Thanks,
                   Priya
                 </p>
               </div>
             </div>
          </div>

          {/* Reply Box placeholder */}
          <div className="p-4 border-t border-border bg-muted/10">
            <div className="relative">
              <textarea placeholder="Write a reply or internal note..." className="w-full p-3 pr-24 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px] resize-none" />
              <div className="absolute right-3 bottom-3 flex gap-2">
                 <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80">Add Note</button>
                 <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">Reply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
