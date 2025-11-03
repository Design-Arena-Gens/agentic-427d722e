"use client";
import { useEffect, useMemo, useState } from "react";
import LeadForm from "../components/LeadForm";
import LeadsTable from "../components/LeadsTable";
import CampaignControls from "../components/CampaignControls";

const STORAGE_KEY = "noidaHub.leads.v1";
const SCRIPT_KEY = "noidaHub.script.v1";

export default function Page() {
  const [leads, setLeads] = useState([]);
  const [script, setScript] = useState("Hello, this is Noida Hub. We have premium apartments and offices in Noida and Greater Noida. Are you interested in learning more?");
  const [calling, setCalling] = useState(false);
  const [provider, setProvider] = useState("mock");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedScript = localStorage.getItem(SCRIPT_KEY);
    if (saved) setLeads(JSON.parse(saved));
    if (savedScript) setScript(savedScript);

    if (
      process.env.NEXT_PUBLIC_TWILIO_FROM_NUMBER &&
      process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID
    ) {
      setProvider("twilio");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(SCRIPT_KEY, script);
  }, [script]);

  const pendingLeads = useMemo(() => leads.filter(l => l.status === "pending"), [leads]);

  const addLead = (lead) => {
    setLeads(prev => [{ id: crypto.randomUUID(), ...lead, status: "pending" }, ...prev]);
  };

  const removeLead = (id) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const updateLeadStatus = (id, updates) => {
    setLeads(prev => prev.map(l => (l.id === id ? { ...l, ...updates } : l)));
  };

  const startCampaign = async () => {
    setCalling(true);
    try {
      for (const lead of leads) {
        if (lead.status !== "pending") continue;
        updateLeadStatus(lead.id, { status: "dialing" });
        const res = await fetch("/api/call", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: lead.phone,
            script,
            provider,
            leadId: lead.id,
            name: lead.name,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          updateLeadStatus(lead.id, { status: "failed", error: data?.error || "Unknown error" });
        } else {
          updateLeadStatus(lead.id, { status: data.status || "completed", callSid: data.callSid });
        }
        await new Promise(r => setTimeout(r, 600));
      }
    } finally {
      setCalling(false);
    }
  };

  const stopCampaign = () => {
    setCalling(false);
  };

  return (
    <main>
      <div className="mb-6 rounded-lg border bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Campaign</h2>
          <span className="text-xs text-gray-500">Mode: {provider === "twilio" ? "Twilio" : "Mock"}</span>
        </div>
        <textarea
          className="mt-3 w-full rounded-md border p-3 text-sm"
          rows={4}
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Enter the call script..."
        />
        <CampaignControls
          calling={calling}
          onStart={startCampaign}
          onStop={stopCampaign}
          pendingCount={pendingLeads.length}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">Add Lead</h2>
          <LeadForm onAdd={addLead} />
        </div>
        <div className="rounded-lg border bg-white p-4 md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Leads</h2>
            <button
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setLeads([])}
            >
              Clear All
            </button>
          </div>
          <LeadsTable leads={leads} onRemove={removeLead} />
        </div>
      </div>
    </main>
  );
}
