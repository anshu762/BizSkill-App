import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const level = url.searchParams.get("level") || "";
    const minCoins = url.searchParams.get("minCoins") || "";
    const maxCoins = url.searchParams.get("maxCoins") || "";
    const industry = url.searchParams.get("industry") || "";
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const sort = url.searchParams.get("sort") || "newest";

    const where: any = {
      isDeleted: false,
      isOffering: true,
    };

    if (category) {
      where.category = { in: category.split(",").filter(Boolean) as any };
    }
    if (level) {
      where.level = level as any;
    }
    if (minCoins || maxCoins) {
      where.coinValue = {};
      if (minCoins) where.coinValue.gte = parseInt(minCoins);
      if (maxCoins) where.coinValue.lte = parseInt(maxCoins);
    }

    const userFilter: any = {};
    if (search) {
      userFilter.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { user: { businessProfile: { businessName: { contains: search, mode: "insensitive" } } } },
      ];
    }
    if (industry) {
      userFilter.user = {
        ...(userFilter.user || {}),
        businessProfile: {
          industry: { in: industry.split(",").filter(Boolean) },
        },
      };
    }
    if (Object.keys(userFilter).length > 0) {
      where.AND = [userFilter];
    }

    const orderBy: any =
      sort === "coins_low" ? { coinValue: "asc" } :
      sort === "coins_high" ? { coinValue: "desc" } :
      { createdAt: "desc" };

    const [skills, total] = await Promise.all([
      prisma.skill.findMany({
        where,
        orderBy,
        take: 12,
        skip: (page - 1) * 12,
        select: {
          id: true,
          title: true,
          category: true,
          level: true,
          coinValue: true,
          description: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              bizCoins: true,
              businessProfile: { select: { businessName: true, industry: true } },
              skills: {
                where: { isDeleted: false, isOffering: true },
                select: { title: true, category: true, coinValue: true, level: true },
                take: 2,
              },
            },
          },
        },
      }),
      prisma.skill.count({ where }),
    ]);

    return NextResponse.json({
      skills,
      totalPages: Math.ceil(total / 12),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Marketplace error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 500 }
    );
  }
}
