"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReviewModal } from "@/components/ReviewModal";
import { toast } from "sonner";
import {
  Loader2, Check, X, Ban, Star, ArrowLeftRight, MessageSquare,
} from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  ACCEPTED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
  COMPLETED: "bg-green-500/10 text-green-400 border-green-500/20",
  CANCELLED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export default function ExchangesPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [tab, setTab] = useState("incoming");
  const [reviewModal, setReviewModal] = useState<{ exchangeId: string; revieweeId: string; revieweeName: string } | null>(null);
  const queryClient = useQueryClient();

  const { data: exchanges = [], isLoading } = useQuery({
    queryKey: ["exchanges", tab],
    queryFn: async () => {
      const res = await fetch(`/api/exchanges?tab=${tab}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!userId,
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/exchanges/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchanges"] });
      toast.success("Exchange updated");
    },
    onError: () => toast.error("Failed to update exchange"),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">My Exchanges</h1>
      <p className="mt-1 text-sm text-gray-400">Manage your skill exchange requests.</p>

      <Tabs value={tab} onValueChange={(v) => v && setTab(v)} className="mt-8">
        <TabsList className="border-white/10 bg-white/[0.03]">
          <TabsTrigger value="incoming" className="data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-400">Incoming</TabsTrigger>
          <TabsTrigger value="outgoing" className="data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-400">Outgoing</TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400">Active</TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-400">Completed</TabsTrigger>
        </TabsList>

        {["incoming", "outgoing", "active", "completed"].map((t) => (
          <TabsContent key={t} value={t} className="mt-6 space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
            ) : exchanges.length === 0 ? (
              <Card className="border-white/10 bg-white/[0.03] py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                  <ArrowLeftRight className="h-6 w-6 text-indigo-400" />
                </div>
                <p className="mt-4 font-medium text-white">No exchanges yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t === "incoming" ? "No one has sent you a request." :
                   t === "outgoing" ? "You haven't sent any requests." :
                   t === "active" ? "No active exchanges." : "No completed exchanges yet."}
                </p>
              </Card>
            ) : (
              exchanges.map((exchange: any) => {
                const isFromMe = exchange.fromUserId === userId;
                const otherParty = isFromMe ? exchange.toUser : exchange.fromUser;

                return (
                  <Card key={exchange.id} className="border-white/10 bg-white/[0.03]">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarImage src={otherParty?.image ?? ""} />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-xs text-white">
                              {otherParty?.name?.charAt(0) ?? "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-white truncate">{otherParty?.name}</p>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              <Badge variant="outline" className="text-xs border-white/10 text-gray-300">
                                Wants: {exchange.requestedSkill?.title} ({exchange.requestedSkill?.coinValue} BC)
                              </Badge>
                              <Badge variant="outline" className="text-xs border-white/10 text-gray-300">
                                Offers: {exchange.offeredSkill?.title} ({exchange.offeredSkill?.coinValue} BC)
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Badge className={`shrink-0 ${statusColors[exchange.status] ?? ""}`}>
                          {exchange.status}
                        </Badge>
                      </div>

                      {exchange.message && (
                        <div className="mt-3 flex items-start gap-2 rounded-lg bg-white/[0.02] p-3">
                          <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                          <p className="text-sm text-gray-400">{exchange.message}</p>
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-xs text-gray-500">{new Date(exchange.createdAt).toLocaleDateString()}</p>
                        <div className="flex gap-2">
                          {t === "incoming" && exchange.status === "PENDING" && (
                            <>
                              <Button size="sm" className="bg-green-600 text-white hover:bg-green-700"
                                onClick={() => statusMutation.mutate({ id: exchange.id, status: "ACCEPTED" })}>
                                <Check className="mr-1 h-4 w-4" />Accept
                              </Button>
                              <Button size="sm" variant="destructive"
                                onClick={() => statusMutation.mutate({ id: exchange.id, status: "REJECTED" })}>
                                <X className="mr-1 h-4 w-4" />Reject
                              </Button>
                            </>
                          )}
                          {t === "outgoing" && exchange.status === "PENDING" && (
                            <Button size="sm" variant="outline" className="border-white/10 text-gray-300"
                              onClick={() => statusMutation.mutate({ id: exchange.id, status: "CANCELLED" })}>
                              <Ban className="mr-1 h-4 w-4" />Cancel
                            </Button>
                          )}
                          {t === "active" && exchange.status === "ACCEPTED" && (
                            <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                              onClick={() => statusMutation.mutate({ id: exchange.id, status: "COMPLETED" })}>
                              <Check className="mr-1 h-4 w-4" />Mark Complete
                            </Button>
                          )}
                          {t === "completed" && (!exchange.reviews || exchange.reviews.length === 0) && (
                            <Button size="sm" variant="outline" className="border-white/10 text-yellow-400"
                              onClick={() => setReviewModal({
                                exchangeId: exchange.id,
                                revieweeId: otherParty?.id,
                                revieweeName: otherParty?.name ?? "User",
                              })}>
                              <Star className="mr-1 h-4 w-4" />Leave Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        ))}
      </Tabs>

      {reviewModal && (
        <ReviewModal
          exchangeId={reviewModal.exchangeId}
          revieweeId={reviewModal.revieweeId}
          revieweeName={reviewModal.revieweeName}
          open={!!reviewModal}
          onOpenChange={() => setReviewModal(null)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["exchanges"] })}
        />
      )}
    </div>
  );
}
