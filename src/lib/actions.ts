"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

/* ─────────── Onboarding ─────────── */

const skillSchema = z.object({
  title: z.string().min(1),
  category: z.string(),
  description: z.string().optional(),
  level: z.string(),
  coinValue: z.number().min(10).max(200),
});

const onboardingSchema = z.object({
  name: z.string().min(1),
  age: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(160).optional(),
  businessName: z.string().min(1),
  industry: z.string(),
  stage: z.string(),
  website: z.string().optional(),
  instagramHandle: z.string().optional(),
  description: z.string().optional(),
  offerSkills: z.array(skillSchema).max(5),
  needSkills: z.array(skillSchema).max(5),
});

export async function submitOnboarding(formData: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = onboardingSchema.safeParse(formData);
  if (!parsed.success) throw new Error("Validation failed");

  const { name, age, location, bio, businessName, industry, stage, website, instagramHandle, description, offerSkills, needSkills } = parsed.data;

  await prisma.$transaction(
    async (tx) => {
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          name,
          age: age ? Number(age) : null,
          location,
          bio,
          hasOnboarded: true,
        },
      });

      await tx.businessProfile.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          businessName,
          industry: industry as any,
          stage: stage as any,
          website,
          instagramHandle,
          description,
        },
        update: {
          businessName,
          industry: industry as any,
          stage: stage as any,
          website,
          instagramHandle,
          description,
        },
      });

      if (offerSkills.length > 0) {
        await tx.skill.createMany({
          data: offerSkills.map((s) => ({
            userId: session.user.id,
            title: s.title,
            category: s.category as any,
            description: s.description,
            level: s.level as any,
            isOffering: true,
            coinValue: s.coinValue,
          })),
        });
      }

      if (needSkills.length > 0) {
        await tx.skill.createMany({
          data: needSkills.map((s) => ({
            userId: session.user.id,
            title: s.title,
            category: s.category as any,
            description: s.description,
            level: s.level as any,
            isOffering: false,
            coinValue: s.coinValue,
          })),
        });
      }
    },
    { timeout: 30000 }
  );

  revalidatePath("/dashboard");
}

/* ─────────── Update Profile ─────────── */

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  bio: z.string().max(160).optional(),
  location: z.string().optional(),
  age: z.number().optional(),
  businessName: z.string().optional(),
  industry: z.string().optional(),
  stage: z.string().optional(),
  website: z.string().optional(),
  instagramHandle: z.string().optional(),
  description: z.string().optional(),
});

export async function updateProfile(formData: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = updateProfileSchema.safeParse(formData);
  if (!parsed.success) throw new Error("Validation failed");

  const { name, bio, location, age, businessName, industry, stage, website, instagramHandle, description } = parsed.data;

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: session.user.id },
      data: { name, bio, location, age },
    });

    if (businessName || industry || stage || website !== undefined || instagramHandle !== undefined || description !== undefined) {
      const existing = await tx.businessProfile.findUnique({
        where: { userId: session.user.id },
      });

      if (existing) {
        await tx.businessProfile.update({
          where: { userId: session.user.id },
          data: { businessName, industry: industry as any, stage: stage as any, website, instagramHandle, description },
        });
      } else if (businessName) {
        await tx.businessProfile.create({
          data: {
            userId: session.user.id,
            businessName,
            industry: industry as any,
            stage: stage as any,
            website,
            instagramHandle,
            description,
          },
        });
      }
    }
  });

  revalidatePath("/dashboard/settings");
  revalidatePath(`/profile/${session.user.id}`);
}

/* ─────────── Delete Skill ─────────── */

export async function deleteSkill(skillId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const skill = await prisma.skill.findUnique({ where: { id: skillId } });
  if (!skill || skill.userId !== session.user.id) throw new Error("Not found");

  await prisma.skill.update({
    where: { id: skillId },
    data: { isDeleted: true },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath(`/profile/${session.user.id}`);
}
