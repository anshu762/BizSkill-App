import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileCard } from "@/components/ProfileCard";
import { Coins, ArrowLeftRight, Star, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const userId = session.user.id;

  const [user, skillCount, exchangeCount, reviewCount, recentUsers] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { name: true, bizCoins: true } }),
    prisma.skill.count({ where: { userId, isDeleted: false } }),
    prisma.exchangeRequest.count({
      where: { OR: [{ fromUserId: userId }, { toUserId: userId }], status: "ACCEPTED" },
    }),
    prisma.review.count({ where: { revieweeId: userId } }),
    prisma.user.findMany({
      where: { id: { not: userId }, hasOnboarded: true },
      take: 6,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, name: true, image: true, bizCoins: true,
        businessProfile: { select: { businessName: true, industry: true } },
        skills: {
          where: { isDeleted: false, isOffering: true },
          select: { title: true, category: true, coinValue: true, level: true },
          take: 2,
        },
      },
    }),
  ]);

  const stats = [
    { label: "BizCoins", value: user?.bizCoins ?? 0, icon: Coins, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Skills", value: skillCount, icon: Sparkles, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { label: "Active Exchanges", value: exchangeCount, icon: ArrowLeftRight, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Reviews", value: reviewCount, icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name ?? "Entrepreneur"}</h1>
      <p className="mt-1 text-sm text-gray-400">Here&apos;s your business overview.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-white/10 bg-white/[0.03]">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.bg}`}>
                <s.icon className={`h-6 w-6 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-sm text-gray-400">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold text-white">Recent Entrepreneurs</h2>
        {recentUsers.length === 0 ? (
          <Card className="border-white/10 bg-white/[0.03] py-12 text-center">
            <p className="text-sm text-muted-foreground">No other entrepreneurs yet. Be the first!</p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentUsers.map((u) => (
              <ProfileCard key={u.id} user={u} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
