import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OnboardingForm } from "./OnboardingForm";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.hasOnboarded) redirect("/dashboard");

  return <OnboardingForm />;
}
