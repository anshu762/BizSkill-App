import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createReviewSchema = z.object({
  exchangeId: z.string().min(1),
  revieweeId: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().max(200).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { exchangeId, revieweeId, rating, comment } = parsed.data;

    const exchange = await prisma.exchangeRequest.findUnique({
      where: { id: exchangeId },
    });

    if (!exchange || exchange.status !== "COMPLETED") {
      return NextResponse.json({ error: "Exchange not found or not completed" }, { status: 400 });
    }

    const userId = session.user.id;
    if (exchange.fromUserId !== userId && exchange.toUserId !== userId) {
      return NextResponse.json({ error: "Not part of this exchange" }, { status: 403 });
    }

    const otherUserId = exchange.fromUserId === userId ? exchange.toUserId : exchange.fromUserId;
    if (revieweeId !== otherUserId) {
      return NextResponse.json({ error: "Invalid reviewee" }, { status: 400 });
    }

    const existing = await prisma.review.findUnique({
      where: { reviewerId_exchangeId: { reviewerId: userId, exchangeId } },
    });
    if (existing) {
      return NextResponse.json({ error: "Already reviewed" }, { status: 409 });
    }

    const review = await prisma.review.create({
      data: { reviewerId: userId, revieweeId, exchangeId, rating, comment },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 500 }
    );
  }
}
