import { getCurrentUser } from "@/lib/auth";
import NavLinks from "./NavLinks";

export default async function Navbar() {
  const user = await getCurrentUser().catch(() => null);
  return <NavLinks user={user ? { role: user.role, name: user.full_name } : null} />;
}
