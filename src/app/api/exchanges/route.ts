import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createExchangeSchema = z.object({
  offeredSkillId: z.string().min(1),
  requestedSkillId: z.string().min(1),
  message: z.string().max(300).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createExchangeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { offeredSkillId, requestedSkillId, message } = parsed.data;

    const [offeredSkill, requestedSkill] = await Promise.all([
      prisma.skill.findUnique({ where: { id: offeredSkillId } }),
      prisma.skill.findUnique({ where: { id: requestedSkillId } }),
    ]);

    if (!offeredSkill || offeredSkill.isDeleted || offeredSkill.userId !== session.user.id) {
      return NextResponse.json({ error: "Invalid offered skill" }, { status: 400 });
    }
    if (!requestedSkill || requestedSkill.isDeleted || requestedSkill.userId === session.user.id) {
      return NextResponse.json({ error: "Invalid requested skill" }, { status: 400 });
    }

    const exchange = await prisma.exchangeRequest.create({
      data: {
        fromUserId: session.user.id,
        toUserId: requestedSkill.userId,
        offeredSkillId,
        requestedSkillId,
        message,
        status: "PENDING",
      },
    });

    return NextResponse.json(exchange, { status: 201 });
  } catch (error) {
    console.error("Create exchange error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const tab = url.searchParams.get("tab") || "incoming";

    let where: any;
    switch (tab) {
      case "incoming":
        where = { toUserId: session.user.id, status: "PENDING" };
        break;
      case "outgoing":
        where = { fromUserId: session.user.id, status: "PENDING" };
        break;
      case "active":
        where = {
          OR: [
            { fromUserId: session.user.id },
            { toUserId: session.user.id },
          ],
          status: "ACCEPTED",
        };
        break;
      case "completed":
        where = {
          OR: [
            { fromUserId: session.user.id },
            { toUserId: session.user.id },
          ],
          status: "COMPLETED",
        };
        break;
      default:
        where = { toUserId: session.user.id, status: "PENDING" };
    }

    const exchanges = await prisma.exchangeRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        message: true,
        status: true,
        createdAt: true,
        fromUserId: true,
        toUserId: true,
        offeredSkill: { select: { title: true, coinValue: true } },
        requestedSkill: { select: { title: true, coinValue: true } },
        fromUser: { select: { id: true, name: true, image: true } },
        toUser: { select: { id: true, name: true, image: true } },
        reviews: { select: { id: true } },
      },
    });

    return NextResponse.json(exchanges);
  } catch (error) {
    console.error("List exchanges error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 500 }
    );
  }
}
