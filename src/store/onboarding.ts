import { create } from "zustand";
import type { OnboardingData, SkillFormData } from "@/lib/types";

const defaultSkill = (): SkillFormData => ({
  title: "",
  category: "OTHER",
  description: "",
  level: "BEGINNER",
  coinValue: 10,
});

const initialState: OnboardingData = {
  name: "",
  age: "",
  location: "",
  bio: "",
  businessName: "",
  industry: "OTHER",
  stage: "IDEA",
  website: "",
  instagramHandle: "",
  description: "",
  offerSkills: [defaultSkill()],
  needSkills: [defaultSkill()],
};

type OnboardingStore = {
  data: OnboardingData;
  step: number;
  setStep: (step: number) => void;
  update: (partial: Partial<OnboardingData>) => void;
  addOfferSkill: () => void;
  removeOfferSkill: (i: number) => void;
  updateOfferSkill: (i: number, skill: Partial<SkillFormData>) => void;
  addNeedSkill: () => void;
  removeNeedSkill: (i: number) => void;
  updateNeedSkill: (i: number, skill: Partial<SkillFormData>) => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  data: { ...initialState },
  step: 0,
  setStep: (step) => set({ step }),
  update: (partial) =>
    set((s) => ({ data: { ...s.data, ...partial } })),
  addOfferSkill: () =>
    set((s) => ({
      data: { ...s.data, offerSkills: [...s.data.offerSkills, defaultSkill()] },
    })),
  removeOfferSkill: (i) =>
    set((s) => ({
      data: {
        ...s.data,
        offerSkills: s.data.offerSkills.filter((_, idx) => idx !== i),
      },
    })),
  updateOfferSkill: (i, skill) =>
    set((s) => ({
      data: {
        ...s.data,
        offerSkills: s.data.offerSkills.map((s2, idx) =>
          idx === i ? { ...s2, ...skill } : s2
        ),
      },
    })),
  addNeedSkill: () =>
    set((s) => ({
      data: { ...s.data, needSkills: [...s.data.needSkills, defaultSkill()] },
    })),
  removeNeedSkill: (i) =>
    set((s) => ({
      data: {
        ...s.data,
        needSkills: s.data.needSkills.filter((_, idx) => idx !== i),
      },
    })),
  updateNeedSkill: (i, skill) =>
    set((s) => ({
      data: {
        ...s.data,
        needSkills: s.data.needSkills.map((s2, idx) =>
          idx === i ? { ...s2, ...skill } : s2
        ),
      },
    })),
  reset: () => set({ data: { ...initialState }, step: 0 }),
}));
