import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

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

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = onboardingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

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

    return NextResponse.json({ message: "Onboarding complete" }, { status: 201 });
  } catch (error) {
    console.error("Onboarding error:", error);
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
