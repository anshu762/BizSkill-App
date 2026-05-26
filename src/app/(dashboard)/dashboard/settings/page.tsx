import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, email: true, image: true,
      bio: true, age: true, location: true, bizCoins: true,
      businessProfile: true,
      skills: { where: { isDeleted: false }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) redirect("/auth/signin");

  return <SettingsForm user={user} />;
}
