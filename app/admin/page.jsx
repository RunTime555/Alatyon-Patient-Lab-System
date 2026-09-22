"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { DashboardCard } from "@/components/dashboard-card";
import { 
  FilePlus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Eye, 
  EyeOff,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"; // shadcn/ui switch ካለሽ
import { cn } from "@/lib/utils";

const initialPatients = [
  { id: "AL-901", name: "Abebe Kebede", test: "Lipid Profile", isPublished: false, date: "2026-05-09" },
  { id: "AL-902", name: "Sara Teklu", test: "Blood Glucose", isPublished: true, date: "2026-05-08" },
  { id: "AL-903", name: "Mulugeta Hailu", test: "Liver Function", isPublished: false, date: "2026-05-08" },
];

export default function AdminDashboard() {
  const [patients, setPatients] = useState(initialPatients);

  // የሪፖርቱን ታይነት (On/Off) ለመቀየር
  const toggleVisibility = (id) => {
    setPatients(patients.map(p => 
      p.id === id ? { ...p, isPublished: !p.isPublished } : p
    ));
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <Header title="Hospital Admin / Doctor Panel" />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Results Approval</h1>
            <p className="text-slate-500 text-sm font-medium">Verify and publish lab results for patients.</p>
          </div>
          <Button className="bg-[#004a7c] gap-2">
            <FilePlus size={18} /> New Entry
          </Button>
        </div>

        {/* Results Table */}
        <DashboardCard className="bg-white border-none shadow-sm p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 border-b border-slate-100">
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest">Patient & ID</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest">Test Type</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-center">Doctor Approval</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-right">Patient View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="py-5 px-6">
                    <p className="font-bold text-slate-700">{p.name}</p>
                    <p className="text-[10px] text-[#004a7c] font-black">{p.id}</p>
                  </td>
                  <td className="py-5 px-6">
                    <p className="text-sm font-semibold text-slate-600">{p.test}</p>
                    <p className="text-[10px] text-slate-400">{p.date}</p>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex flex-col items-center gap-2">
                      {/* On/Off Switch */}
                      <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-full px-3">
                        <span className={cn(
                          "text-[9px] font-black uppercase",
                          p.isPublished ? "text-slate-400" : "text-amber-600"
                        )}>Pending</span>
                        
                        <button 
                          onClick={() => toggleVisibility(p.id)}
                          className={cn(
                            "w-10 h-5 rounded-full transition-colors relative",
                            p.isPublished ? "bg-emerald-500" : "bg-slate-300"
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                            p.isPublished ? "left-6" : "left-1"
                          )} />
                        </button>

                        <span className={cn(
                          "text-[9px] font-black uppercase",
                          p.isPublished ? "text-emerald-600" : "text-slate-400"
                        )}>Approved</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {p.isPublished ? (
                        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-[10px] font-bold">
                          <Eye size={12} /> Visible
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-400 bg-slate-100 px-2 py-1 rounded text-[10px] font-bold">
                          <EyeOff size={12} /> Hidden
                        </div>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DashboardCard>
      </div>
    </div>
  );
}