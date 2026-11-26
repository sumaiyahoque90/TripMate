import { Suspense } from "react";
import AuthForm from "@/components/ui/AuthForm";
export const metadata = { title: "Sign in – TripMate" };
export default function Page() { return <Suspense><AuthForm mode="login" /></Suspense>; }
