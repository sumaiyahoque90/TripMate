const MAP = {
  pending: "bg-amber-100 text-amber-800", confirmed: "bg-sky-100 text-sky-800", completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-slate-200 text-slate-600", approved: "bg-emerald-100 text-emerald-800", rejected: "bg-red-100 text-red-700",
  active: "bg-emerald-100 text-emerald-800", redeemed: "bg-slate-200 text-slate-600", expired: "bg-red-100 text-red-700",
  within: "bg-emerald-100 text-emerald-800", slightly_over: "bg-amber-100 text-amber-800", over: "bg-red-100 text-red-700",
};
const LABEL = { slightly_over: "Slightly Over Budget", within: "Within Budget", over: "Over Budget" };
export default function StatusBadge({ status }) {
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${MAP[status] || "bg-slate-100"}`}>{LABEL[status] || status}</span>;
}
