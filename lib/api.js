export class HttpError extends Error {
  constructor(status, message, extra = {}) { super(message); this.status = status; this.extra = extra; }
}
export const ok = (data, status = 200) => Response.json(data, { status });
export const fail = (message, status = 400, extra = {}) => Response.json({ error: message, ...extra }, { status });

// Parses JSON and rejects cross-origin browser requests (CSRF defense in depth beside SameSite cookies).
export async function readJson(req) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    let o; try { o = new URL(origin).host; } catch { o = null; }
    if (o !== host) throw new HttpError(403, "Cross-origin request blocked.");
  }
  try { return await req.json(); } catch { throw new HttpError(400, "Invalid JSON body."); }
}

export function handle(fn) {
  return async (req, ctx) => {
    try { return await fn(req, ctx); }
    catch (e) {
      if (e instanceof HttpError) return fail(e.message, e.status, e.extra);
      console.error(e);
      return fail("Something went wrong. Please try again.", 500);
    }
  };
}

export const intParam = (v) => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : null; };
