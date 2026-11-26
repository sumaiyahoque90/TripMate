import { query } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ok, handle } from "@/lib/api";
import { getProgress } from "@/lib/rewards";

export const GET = handle(async () => {
  const { user, error } = await requireUser(); if (error) return error;
  return ok({ progress: await getProgress({ query }, user.id) });
});
