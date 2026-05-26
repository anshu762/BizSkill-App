"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Trash2, Plus, Coins } from "lucide-react";
import { toast } from "sonner";

const categories = [
  "GRAPHIC_DESIGN","SOCIAL_MEDIA","PHOTOGRAPHY","WEBSITE",
  "MARKETING","BRANDING","FINANCE","PITCH_DECK","CONTENT","OTHER",
] as const;

const levels = ["BEGINNER","INTERMEDIATE","EXPERT"] as const;
const stages = ["IDEA","BUILDING","LAUNCHED"] as const;

const profileSchema = z.object({
  name: z.string().min(1),
  bio: z.string().max(160).optional(),
  location: z.string().optional(),
  age: z.string().optional(),
  businessName: z.string().optional(),
  industry: z.string().default("OTHER"),
  stage: z.string().default("IDEA"),
  website: z.string().optional(),
  instagramHandle: z.string().optional(),
  description: z.string().optional(),
});

type ProfileUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  bio: string | null;
  age: number | null;
  location: string | null;
  bizCoins: number;
  businessProfile: {
    id: string;
    businessName: string;
    industry: string | null;
    description: string | null;
    stage: string | null;
    website: string | null;
    instagramHandle: string | null;
  } | null;
  skills: {
    id: string;
    title: string;
    category: string;
    description: string | null;
    level: string | null;
    isOffering: boolean;
    coinValue: number;
  }[];
};

export function SettingsForm({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name ?? "",
      bio: user.bio ?? "",
      location: user.location ?? "",
      age: user.age?.toString() ?? "",
      businessName: user.businessProfile?.businessName ?? "",
      industry: user.businessProfile?.industry ?? "OTHER",
      stage: user.businessProfile?.stage ?? "IDEA",
      website: user.businessProfile?.website ?? "",
      instagramHandle: user.businessProfile?.instagramHandle ?? "",
      description: user.businessProfile?.description ?? "",
    },
  });

  async function onSubmit(data: any) {
    setSaving(true);
    const payload = {
      ...data,
      age: data.age ? Number(data.age) : undefined,
    };
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success("Profile updated");
      router.refresh();
    } else {
      toast.error("Failed to update");
    }
    setSaving(false);
  }

  async function handleDeleteSkill(skillId: string) {
    setDeleting(skillId);
    const res = await fetch(`/api/skills/${skillId}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Skill deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete");
    }
    setDeleting(null);
  }

  const offered = user.skills.filter((s) => s.isOffering);
  const needed = user.skills.filter((s) => !s.isOffering);

  return (
    <div className="space-y-8">
      {/* Profile Form */}
      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...form.register("name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" {...form.register("bio")} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...form.register("location")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" {...form.register("age")} />
              </div>
            </div>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Business Profile */}
      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Business Name</Label>
              <Input {...form.register("businessName")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select
                  value={form.watch("industry") ?? "OTHER"}
                  onValueChange={(v) => v && form.setValue("industry", v)}
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
                <Label>Stage</Label>
                <Select
                  value={form.watch("stage")}
                  onValueChange={(v) => v && form.setValue("stage", v)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {stages.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input {...form.register("website")} placeholder="https://" />
            </div>
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input {...form.register("instagramHandle")} placeholder="@brand" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...form.register("description")} rows={3} />
            </div>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Business Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Skills Management */}
      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle>Your Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Coins className="h-4 w-4 text-amber-400" /> Skills You Offer
            </h3>
            {offered.length === 0 ? (
              <p className="text-sm text-muted-foreground">No skills listed.</p>
            ) : (
              <div className="space-y-2">
                {offered.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{s.title}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{s.category.replace(/_/g, " ")}</Badge>
                        <Badge variant="outline" className="text-xs">{s.level} · {s.coinValue} BC</Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteSkill(s.id)}
                      disabled={deleting === s.id}
                      className="text-destructive hover:text-destructive/80"
                    >
                      {deleting === s.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator className="bg-white/10" />

          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Coins className="h-4 w-4 text-blue-400" /> Skills You Need
            </h3>
            {needed.length === 0 ? (
              <p className="text-sm text-muted-foreground">No skills listed.</p>
            ) : (
              <div className="space-y-2">
                {needed.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{s.title}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{s.category.replace(/_/g, " ")}</Badge>
                        <Badge variant="outline" className="text-xs">{s.level} · {s.coinValue} BC</Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteSkill(s.id)}
                      disabled={deleting === s.id}
                      className="text-destructive hover:text-destructive/80"
                    >
                      {deleting === s.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
