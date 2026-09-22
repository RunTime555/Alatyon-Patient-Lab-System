"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Heart, Calendar, ClipboardList, Download,
  Droplet, TestTube, Activity, User,
  BrainCircuit, Loader2, Stethoscope, Clock,
  CheckCircle2, AlertCircle
} from "lucide-react";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function ResultIcon({ type }) {
  const t = type?.toLowerCase() ?? "";
  if (t.includes("blood")) return <Droplet className="h-4 w-4 text-red-500" />;
  if (t.includes("glucose") || t.includes("sugar")) return <Activity className="h-4 w-4 text-orange-500" />;
  return <TestTube className="h-4 w-4 text-blue-500" />;
}

function MetricCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl border border-blue-50 p-4 sm:p-5 shadow-sm flex items-center gap-4">
      <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
        <Icon size={17} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
        <p className="text-base font-black text-slate-800 mt-1 truncate">{value}</p>
      </div>
    </div>
  );
}

const isApproved = (s) => ["Verified", "COMPLETED"].includes(s);

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData]                     = useState({ name: "", mrn: "", results: [] });
  const [loading, setLoading]               = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(r => { if (!r.ok) { router.push("/login"); return null; } return r.json(); })
      .then(d => {
        if (!d) return;
        setData(d);
        const approved = (d.results ?? []).filter(r => isApproved(r.status));
        if (approved.length > 0) setSelectedResult(approved[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const getParsed = (text) => {
    if (!text) return { doctor: null, ai: null };
    const parts = text.split("---");
    return {
      doctor: parts[0]?.replace(/DOCTOR['']?S?\s*NOTE:?/i, "").trim() || null,
      ai:     parts[1]?.replace(/AI\s*(INSIGHT|ANALYSIS):?/i, "").trim() || null,
    };
  };

  // ── Only show approved results ──
  const approvedResults = (data.results ?? []).filter(r => isApproved(r.status));

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="h-9 w-9 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="space-y-5 pb-10">

      {/* ── Welcome ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800">
            {getGreeting()}, {data.name || "Patient"}!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Medical ID:{" "}
            <span className="font-mono bg-blue-100 text-[#003a66] font-bold px-2 py-0.5 rounded-lg text-xs">
              {data.mrn}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-blue-50 rounded-2xl px-4 py-3 shadow-sm w-fit">
          <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center border border-red-100 shrink-0">
            <Heart className="h-4 w-4 text-red-500 fill-red-400 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none">Health Status</p>
            <p className="text-sm font-black text-slate-700 mt-0.5">Active</p>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Total Tests"  value={data.results.length}   icon={ClipboardList} />
        <MetricCard label="Approved"     value={approvedResults.length} icon={CheckCircle2} />
        <MetricCard label="Pending"      value={data.results.filter(r => r.status === "PENDING_DOCTOR").length} icon={Clock} />
        <MetricCard
          label="Latest Visit"
          value={approvedResults[0] ? new Date(approvedResults[0].createdAt).toLocaleDateString() : "N/A"}
          icon={Calendar}
        />
      </div>

      {/* ── Main ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Approved results only */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">Approved Results</h2>
            <span className="text-[10px] font-bold text-slate-400">{approvedResults.length} result{approvedResults.length !== 1 ? "s" : ""}</span>
          </div>

          {approvedResults.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-blue-200 p-12 text-center">
              <Clock size={26} className="text-amber-300 mx-auto mb-3" />
              <p className="text-slate-500 font-bold text-sm">No approved results yet</p>
              <p className="text-xs text-slate-400 mt-1">Your results will appear here once the doctor reviews them.</p>
            </div>
          ) : (
            approvedResults.map((result) => {
              const active = selectedResult?.id === result.id;
              return (
                <div
                  key={result.id}
                  onClick={() => setSelectedResult(result)}
                  className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md
                    ${active ? "border-blue-400 ring-2 ring-blue-100 shadow-md" : "border-blue-50 hover:border-blue-200"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <ResultIcon type={result.testName} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-700 text-sm truncate">{result.testName}</p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 shrink-0">
                      <CheckCircle2 size={10} /> Approved
                    </span>
                    <button
                      onClick={e => e.stopPropagation()}
                      className="w-8 h-8 rounded-xl hover:bg-blue-50 flex items-center justify-center text-slate-300 hover:text-blue-600 transition-all shrink-0"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Clinical insight */}
        <div className="space-y-3">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">Clinical Insight</h2>
          <div className="bg-white rounded-2xl border border-blue-50 p-5 shadow-sm sticky top-20">
            {!selectedResult ? (
              <div className="text-center py-14">
                <Activity size={32} className="text-blue-100 mx-auto mb-3" />
                <p className="text-slate-400 font-bold text-sm">Select a result</p>
                <p className="text-xs text-slate-300 mt-1">Tap any row to view details</p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Value */}
                <div className="p-4 bg-[#f0f6ff] rounded-xl">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Measured Value</p>
                  <p className="text-3xl font-black text-[#003a66]">
                    {selectedResult.testValue ?? selectedResult.resultValue ?? "—"}
                    {selectedResult.unit && (
                      <span className="text-sm font-bold text-slate-400 ml-1">{selectedResult.unit}</span>
                    )}
                  </p>
                  <p className="text-xs font-bold text-slate-500 mt-1">{selectedResult.testName}</p>
                </div>

                {/* Doctor note */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Stethoscope size={13} className="text-[#003a66]" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Doctor's Remark</p>
                  </div>
                  <div className="p-3 bg-white border-l-4 border-[#003a66] rounded-r-xl text-xs text-slate-600 italic leading-relaxed">
                    {getParsed(selectedResult.interpretation).doctor
                      || selectedResult.doctorComment
                      || "No specific note from the doctor."}
                  </div>
                </div>

                
                
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}