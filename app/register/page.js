import { Suspense } from "react";
import AuthForm from "@/components/ui/AuthForm";
export const metadata = { title: "Create account – TripMate" };
export default function Page() { return <Suspense><AuthForm mode="register" /></Suspense>; }
