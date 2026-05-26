import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Coins, TrendingUp, Sparkles, Star } from "lucide-react";

const typeColors: Record<string, string> = {
  EXCHANGE: "bg-blue-500/10 text-blue-400",
  REWARD: "bg-green-500/10 text-green-400",
  PURCHASE: "bg-purple-500/10 text-purple-400",
};

export default async function WalletPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { bizCoins: true },
  });

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [{ fromUserId: userId }, { toUserId: userId }],
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, amount: true, type: true, description: true, createdAt: true,
      fromUserId: true, toUserId: true,
      fromUser: { select: { id: true, name: true } },
      toUser: { select: { id: true, name: true } },
    },
  });

  return (
    <div>
      {/* Balance Card */}
      <Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
        <CardContent className="relative p-8">
          <p className="text-sm text-gray-400">Your Balance</p>
          <div className="mt-2 flex items-center gap-3">
            <Coins className="h-10 w-10 text-amber-400" />
            <span className="text-5xl font-bold text-white">{user?.bizCoins ?? 0}</span>
            <span className="text-2xl text-amber-400 font-semibold">BC</span>
          </div>
          <p className="mt-2 text-sm text-gray-400">Available for skill exchanges</p>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-white">Transaction History</h2>
        {transactions.length === 0 ? (
          <Card className="border-white/10 bg-white/[0.03] py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
              <Coins className="h-6 w-6 text-indigo-400" />
            </div>
            <p className="mt-4 font-medium text-white">No transactions yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Start exchanging skills to see your history.</p>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-400">Date</TableHead>
                  <TableHead className="text-gray-400">Type</TableHead>
                  <TableHead className="text-gray-400">Description</TableHead>
                  <TableHead className="text-right text-gray-400">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => {
                  const isIncoming = tx.toUserId === userId;
                  const isOutgoing = tx.fromUserId === userId && tx.fromUserId !== null;
                  return (
                    <TableRow key={tx.id} className="border-white/10 hover:bg-white/[0.02]">
                      <TableCell className="text-sm text-gray-400 whitespace-nowrap">
                        {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${typeColors[tx.type] ?? ""} text-xs`}>{tx.type}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-300">{tx.description ?? "—"}</TableCell>
                      <TableCell className={`text-right text-sm font-medium whitespace-nowrap ${
                        isIncoming ? "text-green-400" : isOutgoing ? "text-red-400" : "text-green-400"
                      }`}>
                        {isIncoming || tx.fromUserId === null ? "+" : "-"}{tx.amount} BC
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      {/* Earn More Section */}
      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold text-white">How to Earn More BizCoins</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-white/10 bg-white/[0.03]">
            <CardContent className="p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="mt-3 font-medium text-white">Complete Exchanges</h3>
              <p className="mt-1 text-sm text-gray-400">Earn 10 BC bonus for every successfully completed skill exchange.</p>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/[0.03]">
            <CardContent className="p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                <Sparkles className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="mt-3 font-medium text-white">Offer In-Demand Skills</h3>
              <p className="mt-1 text-sm text-gray-400">List skills that others need to attract more exchange requests.</p>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/[0.03]">
            <CardContent className="p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
              <h3 className="mt-3 font-medium text-white">Build Your Reputation</h3>
              <p className="mt-1 text-sm text-gray-400">Get good reviews to attract more exchange partners.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
