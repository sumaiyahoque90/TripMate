import { withTransaction } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ok, fail, readJson, handle, intParam, HttpError } from "@/lib/api";
import { maybeIssueVoucher } from "@/lib/rewards";

// Admin approves/rejects. Approval can automatically issue a voucher in the same transaction.
export const PATCH = handle(async (req, { params }) => {
  const { user, error } = await requireUser("admin"); if (error) return error;
  const id = intParam((await params).id); if (!id) return fail("Invalid review id.", 400);
  const { status } = await readJson(req);
  if (!["approved", "rejected"].includes(status)) return fail("Status must be approved or rejected.", 400);
  const result = await withTransaction(async (c) => {
    const r = (await c.query("SELECT id, user_id, status FROM reviews WHERE id=$1 FOR UPDATE", [id])).rows[0];
    if (!r) throw new HttpError(404, "Review not found.");
    if (r.status !== "pending") throw new HttpError(409, `This review is already ${r.status}.`);
    await c.query("UPDATE reviews SET status=$1, reviewed_by=$2, reviewed_at=NOW() WHERE id=$3", [status, user.id, id]);
    const vouchers = status === "approved" ? await maybeIssueVoucher(c, r.user_id) : [];
    return { id, status, vouchers_issued: vouchers.map((v) => v.code) };
  });
  return ok(result);
});
