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
import { Plus, X } from "lucide-react";

const categories = [
  "GRAPHIC_DESIGN","SOCIAL_MEDIA","PHOTOGRAPHY","WEBSITE",
  "MARKETING","BRANDING","FINANCE","PITCH_DECK","CONTENT","OTHER",
] as const;

const levels = ["BEGINNER","INTERMEDIATE","EXPERT"] as const;

export function StepOffer() {
  const { data, update, addOfferSkill, removeOfferSkill, updateOfferSkill, setStep } = useOnboardingStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Skills You Offer</h2>
        <p className="text-sm text-muted-foreground">What can you help others with? (max 5)</p>
      </div>

      {data.offerSkills.map((skill, i) => (
        <div key={i} className="space-y-3 rounded-lg border border-white/10 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Skill #{i + 1}</span>
            {data.offerSkills.length > 1 && (
              <button onClick={() => removeOfferSkill(i)} className="text-destructive hover:text-destructive/80">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={skill.title}
              onChange={(e) => updateOfferSkill(i, { title: e.target.value })}
              placeholder="Logo Design"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={skill.category}
                onValueChange={(v) => v && updateOfferSkill(i, { category: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c.replace(/_/g, " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <Select
                value={skill.level}
                onValueChange={(v) => v && updateOfferSkill(i, { level: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {levels.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={skill.description}
              onChange={(e) => updateOfferSkill(i, { description: e.target.value })}
              placeholder="Describe this skill..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>BizCoin Value (10–200)</Label>
            <Input
              type="number"
              min={10}
              max={200}
              value={skill.coinValue}
              onChange={(e) => updateOfferSkill(i, { coinValue: Number(e.target.value) })}
            />
          </div>
        </div>
      ))}

      {data.offerSkills.length < 5 && (
        <Button variant="outline" onClick={addOfferSkill} className="w-full max-w-full overflow-hidden">
          <Plus className="mr-1 h-4 w-4 shrink-0" /> Add Another Skill
        </Button>
      )}

      <div className="flex flex-col sm:flex-row w-full gap-4 overflow-x-hidden">
        <Button variant="outline" onClick={() => setStep(1)} className="flex-1 min-w-0">Back</Button>
        <Button onClick={() => setStep(3)} className="flex-1 min-w-0">Next</Button>
      </div>
    </div>
  );
}
