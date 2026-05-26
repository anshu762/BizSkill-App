import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
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

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

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

  return NextResponse.json({ message: "Profile updated" });
}
