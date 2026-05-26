import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfileRootPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin?callbackUrl=/profile");
  redirect(`/profile/${session.user.id}`);
}
