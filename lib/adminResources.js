import { CATS, CABINS, AIRPORTS } from "@/lib/validations";
import { HttpError } from "@/lib/api";

// Whitelisted, config-driven CRUD. Table and column names come ONLY from here, never from user input.
export const RESOURCES = {
  hotels: {
    table: "hotels", order: "id DESC",
    fields: {
      name: { type: "text", required: true }, location: { type: "text", required: true },
      category: { type: "enum", values: CATS, required: true },
      price_per_night_bdt: { type: "number", required: true }, facilities: { type: "array" },
      description: { type: "text" }, image_url: { type: "text" }, room_types: { type: "json" },
      is_partner: { type: "bool" }, is_active: { type: "bool" },
    },
  },
  flights: {
    table: "flights", order: "id DESC",
    fields: {
      airline: { type: "text", required: true }, flight_number: { type: "text" },
      destination_code: { type: "enum", values: AIRPORTS, required: true }, destination_name: { type: "text", required: true },
      departure_time: { type: "text" }, arrival_time: { type: "text" }, duration_minutes: { type: "number" },
      cabin_class: { type: "enum", values: CABINS, required: true }, estimated_price_bdt: { type: "number", required: true },
      is_active: { type: "bool" },
    },
  },
  packages: {
    table: "travel_packages", order: "id DESC",
    fields: {
      name: { type: "text", required: true }, description: { type: "text" }, nights: { type: "number", required: true },
      hotel_id: { type: "number" }, airport_code: { type: "enum", values: AIRPORTS }, inclusions: { type: "array" },
      price_per_person_bdt: { type: "number", required: true }, image_url: { type: "text" }, is_active: { type: "bool" },
    },
  },
};

function coerce(name, spec, v) {
  const bad = (m) => { throw new HttpError(400, `${name}: ${m}`, { errors: { [name]: m } }); };
  if (v === undefined || v === null || v === "") {
    if (spec.required) bad("required");
    // NOT NULL columns with defaults: send the empty value, never NULL.
    return spec.type === "array" ? [] : spec.type === "json" ? "[]" : spec.type === "bool" ? false : null;
  }
  switch (spec.type) {
    case "text": return String(v).trim().slice(0, 2000);
    case "number": { const n = Number(v); if (!Number.isFinite(n) || n < 0) bad("must be a non-negative number"); return n; }
    case "bool": return v === true || v === "true";
    case "enum": if (!spec.values.includes(String(v))) bad(`must be one of ${spec.values.join(", ")}`); return String(v);
    case "array": return (Array.isArray(v) ? v : String(v).split(",")).map((s) => String(s).trim()).filter(Boolean);
    case "json": { try { const j = typeof v === "string" ? JSON.parse(v) : v; if (!Array.isArray(j)) bad("must be a JSON array"); return JSON.stringify(j); } catch { return bad("invalid JSON"); } }
  }
}

export function buildWrite(cfg, body, { partial }) {
  const cols = [], vals = [];
  for (const [name, spec] of Object.entries(cfg.fields)) {
    if (!(name in body) && (partial || !spec.required)) continue; // omitted optional fields keep DB defaults (e.g. is_active=TRUE)
    cols.push(name); vals.push(coerce(name, spec, body[name]));
  }
  if (!cols.length) throw new HttpError(400, "Nothing to update.");
  return { cols, vals };
}
