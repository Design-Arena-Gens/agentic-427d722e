"use client";
import { useState } from "react";

export default function LeadForm({ onAdd }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!phone) return;
    onAdd({ name: name || "Lead", phone });
    setName("");
    setPhone("");
  };

  const pasteCsv = async () => {
    const text = await navigator.clipboard.readText();
    const rows = text.split(/\n|\r/).map(r => r.trim()).filter(Boolean);
    const leads = rows.map(r => {
      const [n, p] = r.split(",").map(x => x.trim());
      return { name: n || "Lead", phone: p || n };
    }).filter(x => x.phone);
    for (const l of leads) onAdd(l);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm text-gray-700">Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="mt-1 w-full rounded-md border p-2 text-sm"
          placeholder="John Doe"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-700">Phone</label>
        <input
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="mt-1 w-full rounded-md border p-2 text-sm"
          placeholder="+91xxxxxxxxxx"
        />
      </div>
      <div className="flex items-center gap-2">
        <button type="submit" className="rounded-md bg-blue-600 px-3 py-2 text-white text-sm hover:bg-blue-700">Add Lead</button>
        <button type="button" onClick={pasteCsv} className="rounded-md bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200">Paste CSV from Clipboard</button>
      </div>
    </form>
  );
}
