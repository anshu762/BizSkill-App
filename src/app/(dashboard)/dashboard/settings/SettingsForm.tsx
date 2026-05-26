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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Trash2, Coins } from "lucide-react";
import { toast } from "sonner";
import { updateProfile, deleteSkill } from "@/lib/actions";

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
  id: string; name: string | null; email: string | null; image: string | null;
  bio: string | null; age: number | null; location: string | null; bizCoins: number;
  businessProfile: {
    id: string; businessName: string; industry: string | null;
    description: string | null; stage: string | null;
    website: string | null; instagramHandle: string | null;
  } | null;
  skills: {
    id: string; title: string; category: string; description: string | null;
    level: string | null; isOffering: boolean; coinValue: number;
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
    try {
      await updateProfile({ ...data, age: data.age ? Number(data.age) : undefined });
      toast.success("Profile updated");
      router.refresh();
    } catch { toast.error("Failed to update"); }
    setSaving(false);
  }

  async function handleDeleteSkill(skillId: string) {
    setDeleting(skillId);
    try {
      await deleteSkill(skillId);
      toast.success("Skill deleted");
      router.refresh();
    } catch { toast.error("Failed to delete"); }
    setDeleting(null);
  }

  const offered = user.skills.filter((s) => s.isOffering);
  const needed = user.skills.filter((s) => !s.isOffering);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" className="border-white/10" {...form.register("name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" className="border-white/10" rows={3} {...form.register("bio")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" className="border-white/10" {...form.register("location")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" className="border-white/10" {...form.register("age")} />
              </div>
            </div>
            <Button type="submit" disabled={saving} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader><CardTitle>Business Profile</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Business Name</Label>
              <Input className="border-white/10" {...form.register("businessName")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select value={form.watch("industry") ?? "OTHER"} onValueChange={(v) => v && form.setValue("industry", v)}>
                  <SelectTrigger className="border-white/10"><SelectValue /></SelectTrigger>
                  <SelectContent className="border-white/10 bg-gray-950">
                    {categories.map((c) => (<SelectItem key={c} value={c}>{c.replace(/_/g, " ")}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Stage</Label>
                <Select value={form.watch("stage")} onValueChange={(v) => v && form.setValue("stage", v)}>
                  <SelectTrigger className="border-white/10"><SelectValue /></SelectTrigger>
                  <SelectContent className="border-white/10 bg-gray-950">
                    {stages.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input className="border-white/10" placeholder="https://" {...form.register("website")} />
            </div>
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input className="border-white/10" placeholder="@brand" {...form.register("instagramHandle")} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea className="border-white/10" rows={3} {...form.register("description")} />
            </div>
            <Button type="submit" disabled={saving} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Business
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader><CardTitle>Your Skills</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <Coins className="h-4 w-4 text-amber-400" /> Skills You Offer
            </h3>
            {offered.length === 0 ? (
              <p className="text-sm text-muted-foreground">No skills listed.</p>
            ) : (
              <div className="space-y-2">
                {offered.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-white">{s.title}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{s.category.replace(/_/g, " ")}</Badge>
                        <Badge variant="outline" className="text-xs">{s.level} · {s.coinValue} BC</Badge>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteSkill(s.id)} disabled={deleting === s.id}
                      className="text-destructive hover:text-destructive/80">
                      {deleting === s.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Separator className="bg-white/10" />
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <Coins className="h-4 w-4 text-blue-400" /> Skills You Need
            </h3>
            {needed.length === 0 ? (
              <p className="text-sm text-muted-foreground">No skills listed.</p>
            ) : (
              <div className="space-y-2">
                {needed.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-white">{s.title}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{s.category.replace(/_/g, " ")}</Badge>
                        <Badge variant="outline" className="text-xs">{s.level} · {s.coinValue} BC</Badge>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteSkill(s.id)} disabled={deleting === s.id}
                      className="text-destructive hover:text-destructive/80">
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
