"use client";

import { useOnboardingStore } from "@/store/onboarding";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Coins, Sparkles } from "lucide-react";

export function StepPreview() {
  const { data, setStep, reset } = useOnboardingStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLaunch() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      let errorMsg = "Something went wrong";
      try {
        const d = await res.json();
        if (typeof d.error === "string") errorMsg = d.error;
      } catch {}
      setError(errorMsg);
      setLoading(false);
      return;
    }

    reset();
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Preview Your Profile</h2>
        <p className="text-sm text-muted-foreground">Review everything before launching</p>
      </div>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            {data.name || "Your Name"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">📍</span> {data.location || "Location not set"}</p>
          <p><span className="text-muted-foreground">📝</span> {data.bio || "No bio"}</p>
          <p><span className="text-muted-foreground">🏢</span> {data.businessName} — {data.industry.replace(/_/g, " ")} ({data.stage})</p>
          {data.website && <p><span className="text-muted-foreground">🌐</span> {data.website}</p>}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Coins className="h-4 w-4 text-amber-400" />
              Skills I Offer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.offerSkills.filter(s => s.title).map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm">{s.title}</span>
                <Badge variant="outline" className="text-xs">{s.level} · {s.coinValue} BC</Badge>
              </div>
            ))}
            {data.offerSkills.every(s => !s.title) && (
              <p className="text-sm text-muted-foreground">None added</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Coins className="h-4 w-4 text-blue-400" />
              Skills I Need
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.needSkills.filter(s => s.title).map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm">{s.title}</span>
                <Badge variant="outline" className="text-xs">{s.level} · {s.coinValue} BC</Badge>
              </div>
            ))}
            {data.needSkills.every(s => !s.title) && (
              <p className="text-sm text-muted-foreground">None added</p>
            )}
          </CardContent>
        </Card>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-col sm:flex-row w-full gap-4 overflow-x-hidden">
        <Button variant="outline" onClick={() => setStep(3)} className="flex-1 min-w-0" disabled={loading}>
          Back
        </Button>
        <Button
          onClick={handleLaunch}
          className="flex-1 min-w-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Launch Profile
        </Button>
      </div>
    </div>
  );
}
