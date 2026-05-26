import { create } from "zustand";

export type SkillFormData = {
  title: string;
  category: string;
  description: string;
  level: string;
  coinValue: number;
};

export type OnboardingData = {
  name: string;
  age: string;
  location: string;
  bio: string;
  businessName: string;
  industry: string;
  stage: string;
  website: string;
  instagramHandle: string;
  description: string;
  offerSkills: SkillFormData[];
  needSkills: SkillFormData[];
};

type OnboardingStore = {
  data: OnboardingData;
  step: number;
  setStep: (step: number) => void;
  updateData: (partial: Partial<OnboardingData>) => void;
  updateSkill: (type: "offer" | "need", index: number, skill: Partial<SkillFormData>) => void;
  addSkill: (type: "offer" | "need") => void;
  removeSkill: (type: "offer" | "need", index: number) => void;
  reset: () => void;
};

const defaultSkill: SkillFormData = {
  title: "", category: "OTHER", description: "", level: "BEGINNER", coinValue: 10,
};

const defaultData: OnboardingData = {
  name: "", age: "", location: "", bio: "",
  businessName: "", industry: "OTHER", stage: "IDEA",
  website: "", instagramHandle: "", description: "",
  offerSkills: [{ ...defaultSkill }],
  needSkills: [{ ...defaultSkill }],
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  data: { ...defaultData, offerSkills: [{ ...defaultSkill }], needSkills: [{ ...defaultSkill }] },
  step: 0,
  setStep: (step) => set({ step }),
  updateData: (partial) => set((s) => ({ data: { ...s.data, ...partial } })),
  updateSkill: (type, index, skill) => set((s) => {
    const key = type === "offer" ? "offerSkills" : "needSkills";
    const skills = s.data[key].map((sk, i) => i === index ? { ...sk, ...skill } : sk);
    return { data: { ...s.data, [key]: skills } };
  }),
  addSkill: (type) => set((s) => {
    const key = type === "offer" ? "offerSkills" : "needSkills";
    if (s.data[key].length >= 5) return s;
    return { data: { ...s.data, [key]: [...s.data[key], { ...defaultSkill }] } };
  }),
  removeSkill: (type, index) => set((s) => {
    const key = type === "offer" ? "offerSkills" : "needSkills";
    const skills = s.data[key].filter((_, i) => i !== index);
    return { data: { ...s.data, [key]: skills } };
  }),
  reset: () => set({
    data: { ...defaultData, offerSkills: [{ ...defaultSkill }], needSkills: [{ ...defaultSkill }] },
    step: 0,
  }),
}));
