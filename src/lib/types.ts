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
