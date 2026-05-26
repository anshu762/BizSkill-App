"use client";

import { useOnboardingStore } from "@/store/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  "GRAPHIC_DESIGN", "SOCIAL_MEDIA", "PHOTOGRAPHY", "WEBSITE",
  "MARKETING", "BRANDING", "FINANCE", "PITCH_DECK", "CONTENT", "OTHER",
] as const;

const stages = [
  { value: "IDEA", label: "Idea" },
  { value: "BUILDING", label: "Building" },
  { value: "LAUNCHED", label: "Launched" },
] as const;

export function StepBusiness() {
  const { data, update, setStep } = useOnboardingStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Business Profile</h2>
        <p className="text-sm text-muted-foreground">Tell us about your startup</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessName">Business Name</Label>
        <Input
          id="businessName"
          value={data.businessName}
          onChange={(e) => update({ businessName: e.target.value })}
          placeholder="My Startup"
        />
      </div>

      <div className="space-y-2">
        <Label>Industry</Label>
        <Select
          value={data.industry}
          onValueChange={(v) => v && update({ industry: v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Stage</Label>
        <Select
          value={data.stage}
          onValueChange={(v) => v && update({ stage: v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {stages.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          value={data.website}
          onChange={(e) => update({ website: e.target.value })}
          placeholder="https://"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagram">Instagram Handle</Label>
        <Input
          id="instagram"
          value={data.instagramHandle}
          onChange={(e) => update({ instagramHandle: e.target.value })}
          placeholder="@yourbrand"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="desc">Description</Label>
        <Textarea
          id="desc"
          value={data.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="What does your startup do?"
          rows={3}
        />
      </div>

      <div className="flex flex-col sm:flex-row w-full gap-4 overflow-x-hidden">
        <Button variant="outline" onClick={() => setStep(0)} className="flex-1 min-w-0">
          Back
        </Button>
        <Button onClick={() => setStep(2)} className="flex-1 min-w-0">
          Next
        </Button>
      </div>
    </div>
  );
}
