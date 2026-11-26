import { redirect } from "next/navigation";
import AdminPanel from "@/components/admin/AdminPanel";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Admin – TripMate" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/dashboard"); // server-side check in addition to middleware
  return (
    <div className="section"><h1 className="mb-6 text-4xl font-bold">Admin dashboard</h1><AdminPanel /></div>
  );
}
