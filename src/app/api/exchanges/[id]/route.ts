import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED", "CANCELLED", "COMPLETED"]),
});

export async function PUT(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await _req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { status } = parsed.data;

    const exchange = await prisma.exchangeRequest.findUnique({
      where: { id },
      include: {
        offeredSkill: true,
        requestedSkill: true,
      },
    });

    if (!exchange) {
      return NextResponse.json({ error: "Exchange not found" }, { status: 404 });
    }

    if (status === "ACCEPTED") {
      if (exchange.status !== "PENDING" || exchange.toUserId !== session.user.id) {
        return NextResponse.json({ error: "Cannot accept this request" }, { status: 403 });
      }

      await prisma.$transaction(async (tx) => {
        await tx.exchangeRequest.update({
          where: { id },
          data: { status: "ACCEPTED" },
        });

        const coinValue = exchange.requestedSkill.coinValue;

        await tx.transaction.create({
          data: {
            fromUserId: exchange.fromUserId,
            toUserId: exchange.toUserId,
            amount: coinValue,
            type: "EXCHANGE",
            description: `Skill exchange: ${exchange.offeredSkill.title} ↔ ${exchange.requestedSkill.title}`,
            relatedExchangeId: id,
          },
        });

        await tx.user.update({
          where: { id: exchange.fromUserId },
          data: { bizCoins: { decrement: coinValue } },
        });
        await tx.user.update({
          where: { id: exchange.toUserId },
          data: { bizCoins: { increment: coinValue } },
        });
      });
    } else if (status === "COMPLETED") {
      if (exchange.status !== "ACCEPTED") {
        return NextResponse.json({ error: "Can only complete accepted exchanges" }, { status: 403 });
      }

      await prisma.$transaction(async (tx) => {
        await tx.exchangeRequest.update({
          where: { id },
          data: { status: "COMPLETED" },
        });

        const now = new Date();
        await tx.transaction.createMany({
          data: [
            {
              fromUserId: null,
              toUserId: exchange.fromUserId,
              amount: 10,
              type: "REWARD",
              description: "Exchange completed bonus",
              relatedExchangeId: id,
              createdAt: now,
            },
            {
              fromUserId: null,
              toUserId: exchange.toUserId,
              amount: 10,
              type: "REWARD",
              description: "Exchange completed bonus",
              relatedExchangeId: id,
              createdAt: now,
            },
          ],
        });

        await tx.user.update({
          where: { id: exchange.fromUserId },
          data: { bizCoins: { increment: 10 } },
        });
        await tx.user.update({
          where: { id: exchange.toUserId },
          data: { bizCoins: { increment: 10 } },
        });
      });
    } else if (status === "REJECTED") {
      if (exchange.toUserId !== session.user.id || exchange.status !== "PENDING") {
        return NextResponse.json({ error: "Cannot reject" }, { status: 403 });
      }
      await prisma.exchangeRequest.update({ where: { id }, data: { status: "REJECTED" } });
    } else if (status === "CANCELLED") {
      if (exchange.fromUserId !== session.user.id) {
        return NextResponse.json({ error: "Cannot cancel" }, { status: 403 });
      }
      await prisma.exchangeRequest.update({ where: { id }, data: { status: "CANCELLED" } });
    }

    const updated = await prisma.exchangeRequest.findUnique({ where: { id } });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update exchange error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 500 }
    );
  }
}
