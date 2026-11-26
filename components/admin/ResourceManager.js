"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

// Generic admin CRUD driven by the field spec returned from the API.
export default function ResourceManager({ resource, columns }) {
  const [rows, setRows] = useState([]); const [fields, setFields] = useState({});
  const [edit, setEdit] = useState(null); // null | {} (new) | row
  const [form, setForm] = useState({}); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const load = useCallback(async () => { const d = await api("GET", `/api/admin/resources/${resource}`); if (d.ok) { setRows(d.data.rows); setFields(d.data.fields); } }, [resource]);
  useEffect(() => { load(); }, [load]);

  const open = (row) => {
    const f = {};
    for (const [k, s] of Object.entries(fields)) {
      const val = row?.[k];
      f[k] = s.type === "array" ? (val || []).join(", ") : s.type === "json" ? JSON.stringify(val || []) : s.type === "bool" ? (row ? !!val : k === "is_active") : val ?? "";
    }
    setForm(f); setEdit(row || {}); setErr("");
  };
  async function save(e) {
    e.preventDefault(); setBusy(true); setErr("");
    const isNew = !edit.id;
    const d = await api(isNew ? "POST" : "PUT", isNew ? `/api/admin/resources/${resource}` : `/api/admin/resources/${resource}/${edit.id}`, form);
    setBusy(false);
    if (!d.ok) return setErr(d.data.error || "Could not save.");
    setEdit(null); load();
  }
  async function archive(id) { if (!confirm("Archive this item? It will be hidden from customers.")) return; await api("DELETE", `/api/admin/resources/${resource}/${id}`); load(); }

  return (
    <div>
      <button className="btn-primary mb-4 !py-2" onClick={() => open(null)}>Add new</button>
      {edit && (
        <form onSubmit={save} className="card mb-6 grid gap-3 p-5 sm:grid-cols-2">
          {Object.entries(fields).map(([k, s]) => (
            <div key={k} className={s.type === "json" || k === "description" ? "sm:col-span-2" : ""}>
              <label className="label" htmlFor={`f-${k}`}>{k.replace(/_/g, " ")}{s.required && " *"}{s.type === "array" && " (comma separated)"}{s.type === "json" && " (JSON array)"}</label>
              {s.type === "bool" ? <input id={`f-${k}`} type="checkbox" className="h-5 w-5 accent-[#087E8B]" checked={!!form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.checked })} />
                : s.type === "enum" ? <select id={`f-${k}`} className="field" value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })}><option value="">Select</option>{s.values.map((x) => <option key={x}>{x}</option>)}</select>
                : <input id={`f-${k}`} className="field" type={s.type === "number" ? "number" : "text"} step="any" value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />}
            </div>))}
          {err && <p role="alert" className="text-sm text-red-600 sm:col-span-2">{err}</p>}
          <div className="flex gap-3 sm:col-span-2"><button className="btn-primary !py-2" disabled={busy}>{busy ? "Saving…" : "Save"}</button><button type="button" className="text-sm" onClick={() => setEdit(null)}>Cancel</button></div>
        </form>)}
      <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
        <table className="w-full text-left text-sm"><thead className="bg-canvas text-xs uppercase text-navy/60"><tr>{columns.map((c) => <th key={c} className="px-4 py-3">{c.replace(/_/g, " ")}</th>)}<th className="px-4 py-3" /></tr></thead>
          <tbody className="divide-y divide-slate-100">{rows.map((r) => (
            <tr key={r.id} className={r.is_active ? "" : "opacity-50"}>{columns.map((c) => <td key={c} className="px-4 py-3">{Array.isArray(r[c]) ? r[c].join(", ") : typeof r[c] === "boolean" ? (r[c] ? "yes" : "no") : String(r[c] ?? "")}</td>)}
              <td className="space-x-3 whitespace-nowrap px-4 py-3 text-right"><button className="font-semibold text-ocean" onClick={() => open(r)}>Edit</button>{r.is_active && <button className="font-semibold text-red-600" onClick={() => archive(r.id)}>Archive</button>}</td></tr>))}</tbody></table>
      </div>
    </div>
  );
}
