import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const [reviews, aggregate] = await Promise.all([
      prisma.review.findMany({
        where: { revieweeId: userId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          reviewer: {
            select: { id: true, name: true, image: true },
          },
        },
      }),
      prisma.review.aggregate({
        where: { revieweeId: userId },
        _avg: { rating: true },
        _count: true,
      }),
    ]);

    return NextResponse.json({
      reviews,
      averageRating: aggregate._avg.rating ?? null,
      totalReviews: aggregate._count,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 500 }
    );
  }
}
