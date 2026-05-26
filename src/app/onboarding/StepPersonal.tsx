"use client";

import { useOnboardingStore } from "@/store/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function StepPersonal() {
  const { data, update, setStep } = useOnboardingStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Personal Info</h2>
        <p className="text-sm text-muted-foreground">Tell us about yourself</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="John Doe"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          value={data.age}
          onChange={(e) => update({ age: e.target.value })}
          placeholder="21"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={data.location}
          onChange={(e) => update({ location: e.target.value })}
          placeholder="New Delhi, India"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Short Bio</Label>
        <Textarea
          id="bio"
          value={data.bio}
          onChange={(e) => update({ bio: e.target.value })}
          placeholder="A quick intro about yourself..."
          maxLength={160}
          rows={3}
        />
        <p className="text-xs text-muted-foreground text-right">
          {data.bio.length}/160
        </p>
      </div>

      <div className="flex flex-col sm:flex-row w-full gap-4 overflow-x-hidden">
        <Button onClick={() => setStep(1)} className="flex-1 min-w-0">
          Next
        </Button>
      </div>
    </div>
  );
}
