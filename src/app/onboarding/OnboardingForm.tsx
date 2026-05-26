"use client";

import { useOnboardingStore } from "@/store/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Coins, Sparkles, Plus, Trash2 } from "lucide-react";
import { submitOnboarding } from "@/lib/actions";

const categories = [
  "GRAPHIC_DESIGN","SOCIAL_MEDIA","PHOTOGRAPHY","WEBSITE",
  "MARKETING","BRANDING","FINANCE","PITCH_DECK","CONTENT","OTHER",
] as const;

const levels = ["BEGINNER","INTERMEDIATE","EXPERT"] as const;
const stages = ["IDEA","BUILDING","LAUNCHED"] as const;
const stepLabels = ["Personal Info", "Business", "Offer Skills", "Need Skills", "Preview"];

export function OnboardingForm() {
  const { data, step, setStep, updateData, updateSkill, addSkill, removeSkill, reset } = useOnboardingStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLaunch() {
    setLoading(true);
    setError("");
    try {
      await submitOnboarding(data);
      reset();
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  const progress = ((step + 1) / 5) * 100;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <h1 className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
          Set Up Your Profile
        </h1>
        <p className="mt-1 text-sm text-gray-400">Step {step + 1} of 5 — {stepLabels[step]}</p>
        <Progress value={progress} className="mt-4 h-2 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-purple-600" />
      </div>

      {/* Step 0: Personal Info */}
      {step === 0 && (
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader><CardTitle>Personal Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input className="border-white/10" value={data.name} onChange={(e) => updateData({ name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Age</Label>
              <Input className="border-white/10" type="number" value={data.age} onChange={(e) => updateData({ age: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input className="border-white/10" value={data.location} onChange={(e) => updateData({ location: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea className="border-white/10" rows={3} maxLength={160}
                value={data.bio} onChange={(e) => updateData({ bio: e.target.value })} />
              <p className="text-xs text-gray-500">{data.bio.length}/160</p>
            </div>
            <Button onClick={() => setStep(1)} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
              disabled={!data.name}>Next</Button>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Business Profile */}
      {step === 1 && (
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader><CardTitle>Business Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Business Name *</Label>
              <Input className="border-white/10" value={data.businessName} onChange={(e) => updateData({ businessName: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select value={data.industry} onValueChange={(v) => v && updateData({ industry: v })}>
                  <SelectTrigger className="border-white/10 w-full"><SelectValue /></SelectTrigger>
                  <SelectContent className="border-white/10 bg-gray-950">
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c.replace(/_/g, " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Stage</Label>
                <Select value={data.stage} onValueChange={(v) => v && updateData({ stage: v })}>
                  <SelectTrigger className="border-white/10 w-full"><SelectValue /></SelectTrigger>
                  <SelectContent className="border-white/10 bg-gray-950">
                    {stages.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input className="border-white/10" placeholder="https://" value={data.website} onChange={(e) => updateData({ website: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input className="border-white/10" placeholder="@brand" value={data.instagramHandle} onChange={(e) => updateData({ instagramHandle: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea className="border-white/10" rows={3} value={data.description} onChange={(e) => updateData({ description: e.target.value })} />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 border-white/10 text-gray-300" onClick={() => setStep(0)}>Back</Button>
              <Button className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                onClick={() => setStep(2)} disabled={!data.businessName}>Next</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Offer Skills */}
      {step === 2 && (
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Coins className="h-5 w-5 text-amber-400" />Skills You Offer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.offerSkills.map((sk, i) => (
              <div key={i} className="rounded-lg border border-white/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Skill #{i + 1}</span>
                  {data.offerSkills.length > 1 && (
                    <button onClick={() => removeSkill("offer", i)} className="text-destructive hover:text-destructive/80">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Input className="border-white/10" placeholder="Title" value={sk.title}
                  onChange={(e) => updateSkill("offer", i, { title: e.target.value })} />
                <Input className="border-white/10" placeholder="Description" value={sk.description}
                  onChange={(e) => updateSkill("offer", i, { description: e.target.value })} />
                <div className="grid grid-cols-3 gap-3">
                  <Select value={sk.category} onValueChange={(v) => v && updateSkill("offer", i, { category: v })}>
                    <SelectTrigger className="border-white/10"><SelectValue /></SelectTrigger>
                    <SelectContent className="border-white/10 bg-gray-950">
                      {categories.map((c) => (<SelectItem key={c} value={c}>{c.replace(/_/g, " ")}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <Select value={sk.level} onValueChange={(v) => v && updateSkill("offer", i, { level: v })}>
                    <SelectTrigger className="border-white/10"><SelectValue /></SelectTrigger>
                    <SelectContent className="border-white/10 bg-gray-950">
                      {levels.map((l) => (<SelectItem key={l} value={l}>{l}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <Input type="number" min={10} max={200} className="border-white/10" placeholder="BC"
                    value={sk.coinValue} onChange={(e) => updateSkill("offer", i, { coinValue: parseInt(e.target.value) || 10 })} />
                </div>
              </div>
            ))}
            {data.offerSkills.length < 5 && (
              <Button variant="outline" size="sm" className="w-full border-white/10 text-gray-300"
                onClick={() => addSkill("offer")}><Plus className="mr-1 h-4 w-4" />Add Skill</Button>
            )}
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 border-white/10 text-gray-300" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                onClick={() => setStep(3)}>Next</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Need Skills */}
      {step === 3 && (
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Coins className="h-5 w-5 text-blue-400" />Skills You Need</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.needSkills.map((sk, i) => (
              <div key={i} className="rounded-lg border border-white/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Skill #{i + 1}</span>
                  {data.needSkills.length > 1 && (
                    <button onClick={() => removeSkill("need", i)} className="text-destructive hover:text-destructive/80">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Input className="border-white/10" placeholder="Title" value={sk.title}
                  onChange={(e) => updateSkill("need", i, { title: e.target.value })} />
                <Input className="border-white/10" placeholder="Description" value={sk.description}
                  onChange={(e) => updateSkill("need", i, { description: e.target.value })} />
                <div className="grid grid-cols-3 gap-3">
                  <Select value={sk.category} onValueChange={(v) => v && updateSkill("need", i, { category: v })}>
                    <SelectTrigger className="border-white/10"><SelectValue /></SelectTrigger>
                    <SelectContent className="border-white/10 bg-gray-950">
                      {categories.map((c) => (<SelectItem key={c} value={c}>{c.replace(/_/g, " ")}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <Select value={sk.level} onValueChange={(v) => v && updateSkill("need", i, { level: v })}>
                    <SelectTrigger className="border-white/10"><SelectValue /></SelectTrigger>
                    <SelectContent className="border-white/10 bg-gray-950">
                      {levels.map((l) => (<SelectItem key={l} value={l}>{l}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <Input type="number" min={10} max={200} className="border-white/10" placeholder="BC"
                    value={sk.coinValue} onChange={(e) => updateSkill("need", i, { coinValue: parseInt(e.target.value) || 10 })} />
                </div>
              </div>
            ))}
            {data.needSkills.length < 5 && (
              <Button variant="outline" size="sm" className="w-full border-white/10 text-gray-300"
                onClick={() => addSkill("need")}><Plus className="mr-1 h-4 w-4" />Add Skill</Button>
            )}
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 border-white/10 text-gray-300" onClick={() => setStep(2)}>Back</Button>
              <Button className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                onClick={() => setStep(4)}>Next</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Preview */}
      {step === 4 && (
        <div className="space-y-6">
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-indigo-400" />{data.name || "Your Name"}</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">📍</span> {data.location || "Location not set"}</p>
              <p><span className="text-muted-foreground">📝</span> {data.bio || "No bio"}</p>
              <p><span className="text-muted-foreground">🏢</span> {data.businessName} — {data.industry.replace(/_/g, " ")} ({data.stage})</p>
              {data.website && <p><span className="text-muted-foreground">🌐</span> {data.website}</p>}
            </CardContent>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-white/10 bg-white/[0.03]">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Coins className="h-4 w-4 text-amber-400" />Offering</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {data.offerSkills.filter(s => s.title).map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm">{s.title}</span>
                    <Badge variant="outline" className="text-xs">{s.level} · {s.coinValue} BC</Badge>
                  </div>
                ))}
                {data.offerSkills.every(s => !s.title) && <p className="text-sm text-muted-foreground">None</p>}
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/[0.03]">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Coins className="h-4 w-4 text-blue-400" />Needed</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {data.needSkills.filter(s => s.title).map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm">{s.title}</span>
                    <Badge variant="outline" className="text-xs">{s.level} · {s.coinValue} BC</Badge>
                  </div>
                ))}
                {data.needSkills.every(s => !s.title) && <p className="text-sm text-muted-foreground">None</p>}
              </CardContent>
            </Card>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1 border-white/10 text-gray-300" onClick={() => setStep(3)} disabled={loading}>Back</Button>
            <Button className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
              onClick={handleLaunch} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Launch Profile
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
