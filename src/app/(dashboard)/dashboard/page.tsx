import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProfileCard } from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, User } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { hasOnboarded: true },
  });

  if (!user?.hasOnboarded) redirect("/onboarding");

  const recentUsers = await prisma.user.findMany({
    where: {
      hasOnboarded: true,
      id: { not: session.user.id },
    },
    select: {
      id: true,
      name: true,
      image: true,
      bizCoins: true,
      businessProfile: {
        select: { businessName: true, industry: true },
      },
      skills: {
        where: { isDeleted: false, isOffering: true },
        select: { title: true, isOffering: true },
        take: 2,
      },
    },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.user.name}</p>
        </div>
        <Link href={`/profile/${session.user.id}`}>
          <Button variant="outline" size="sm">
            <User className="mr-1 h-4 w-4" /> View Profile
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              BizCoin Balance
            </CardTitle>
            <Coins className="h-5 w-5 text-amber-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-400">{session.user.bizCoins} BC</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Skills Offered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-indigo-400">--</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Skills Needed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-400">--</p>
          </CardContent>
        </Card>
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-semibold">Recent Entrepreneurs</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentUsers.map((u) => (
            <ProfileCard key={u.id} user={u} />
          ))}
        </div>
      </section>
    </div>
  );
}
