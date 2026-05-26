"use client";

import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Handshake, Coins, Loader2 } from "lucide-react";
import { toast } from "sonner";

type SkillItem = { id: string; title: string; coinValue: number };

type ExchangeModalProps = {
  otherUserId: string;
  otherUserOffered: SkillItem[];
  otherUserNeeded: SkillItem[];
  currentUserOffered: SkillItem[];
};

export function ExchangeModal({
  otherUserId,
  otherUserOffered,
  otherUserNeeded,
  currentUserOffered,
}: ExchangeModalProps) {
  const [open, setOpen] = useState(false);
  const [requestedSkillId, setRequestedSkillId] = useState("");
  const [offeredSkillId, setOfferedSkillId] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const selectedRequested = otherUserOffered.find((s) => s.id === requestedSkillId);
  const coinCost = selectedRequested?.coinValue ?? 0;

  async function handleSubmit() {
    if (!requestedSkillId || !offeredSkillId) return;
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/exchanges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offeredSkillId, requestedSkillId, message: message || undefined }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to create request");
      }
      toast.success("Exchange request sent!");
      setOpen(false);
      setRequestedSkillId("");
      setOfferedSkillId("");
      setMessage("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
    setSending(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          size="lg"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
        >
          <Handshake className="mr-2 h-5 w-5" />
          Request Skill Exchange
        </Button>
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-gray-950 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Request Skill Exchange</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">I want their help with...</label>
            <Select value={requestedSkillId} onValueChange={(v) => v && setRequestedSkillId(v)}>
              <SelectTrigger className="border-white/10 w-full">
                <SelectValue placeholder="Select a skill..." />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-gray-950">
                {otherUserOffered.length === 0 ? (
                  <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                    This user hasn't listed any skills
                  </div>
                ) : (
                  otherUserOffered.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <span className="flex items-center gap-2">
                        {s.title}
                        <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs">
                          <Coins className="mr-0.5 h-3 w-3" />{s.coinValue}
                        </Badge>
                      </span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">I can offer in exchange...</label>
            <Select value={offeredSkillId} onValueChange={(v) => v && setOfferedSkillId(v)}>
              <SelectTrigger className="border-white/10 w-full">
                <SelectValue placeholder="Select a skill..." />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-gray-950">
                {currentUserOffered.length === 0 ? (
                  <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                    You haven't listed any skills yet
                  </div>
                ) : (
                  currentUserOffered.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <span className="flex items-center gap-2">
                        {s.title}
                        <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs">
                          <Coins className="mr-0.5 h-3 w-3" />{s.coinValue}
                        </Badge>
                      </span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {coinCost > 0 && selectedRequested && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm">
              <span className="text-gray-300">Coin cost: </span>
              <span className="font-semibold text-amber-400">{coinCost} BizCoins</span>
              <span className="text-gray-400"> will be deducted from your balance when accepted</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Message (optional)</label>
            <Textarea
              className="border-white/10"
              placeholder="Hi! I'd love to exchange skills..."
              value={message}
              onChange={(e) => e.target.value.length <= 300 && setMessage(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-gray-500">{message.length}/300</p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)} className="border-white/10 text-gray-300">
              Cancel
            </Button>
            <Button
              disabled={!requestedSkillId || !offeredSkillId || sending}
              onClick={handleSubmit}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
            >
              {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Handshake className="mr-2 h-4 w-4" />}
              Send Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
