"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Handshake, Coins, Loader2 } from "lucide-react";

type SkillItem = {
  id: string;
  title: string;
  coinValue: number;
};

type ExchangeModalProps = {
  otherUserId: string;
  otherUserOffered: SkillItem[];
  currentUserOffered: SkillItem[];
};

export function ExchangeModal({
  otherUserId: _otherUserId,
  otherUserOffered,
  currentUserOffered,
}: ExchangeModalProps) {
  const [open, setOpen] = useState(false);
  const [requestedSkill, setRequestedSkill] = useState("");
  const [offerSkill, setOfferSkill] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit() {
    // Phase 3: wire actual exchange logic
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSending(false);
    setOpen(false);
  }

  const canSubmit = requestedSkill;

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

        <div className="space-y-6 py-4">
          {/* What you want */}
          <div className="space-y-2">
            <Label>I want their help with...</Label>
            <Select value={requestedSkill} onValueChange={(v) => v && setRequestedSkill(v)}>
              <SelectTrigger className="border-white/10">
                <SelectValue placeholder="Select a skill..." />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-gray-950">
                {otherUserOffered.length === 0 ? (
                  <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                    This user hasn't listed any skills yet
                  </div>
                ) : (
                  otherUserOffered.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <span className="flex items-center gap-2">
                        {s.title}
                        <Badge
                          variant="outline"
                          className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs"
                        >
                          <Coins className="mr-0.5 h-3 w-3" />
                          {s.coinValue}
                        </Badge>
                      </span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* What you offer in return */}
          <div className="space-y-2">
            <Label>I can offer in exchange...</Label>
            <Select value={offerSkill} onValueChange={(v) => v && setOfferSkill(v)}>
              <SelectTrigger className="border-white/10">
                <SelectValue placeholder="Select a skill..." />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-gray-950">
                {currentUserOffered.length === 0 ? (
                  <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                    You haven't listed any skills yet
                  </div>
                ) : (
                  currentUserOffered.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <span className="flex items-center gap-2">
                        {s.title}
                        <Badge
                          variant="outline"
                          className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs"
                        >
                          <Coins className="mr-0.5 h-3 w-3" />
                          {s.coinValue}
                        </Badge>
                      </span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label>Message (optional)</Label>
            <Textarea
              className="border-white/10"
              placeholder="Hi! I'd love to exchange skills with you..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-white/10 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              disabled={!canSubmit || sending}
              onClick={handleSubmit}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
            >
              {sending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Handshake className="mr-2 h-4 w-4" />
              )}
              Send Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
