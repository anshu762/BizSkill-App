import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsForm } from "./SettingsForm";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      age: true,
      location: true,
      bizCoins: true,
      businessProfile: true,
      skills: {
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/auth/signin");

  return (
    <div className="mx-auto max-w-3xl px-8 py-8">
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>
      <SettingsForm user={user} />
    </div>
  );
}
