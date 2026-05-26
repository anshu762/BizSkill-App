import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="ml-64 flex-1">{children}</main>
    </div>
  );
}
