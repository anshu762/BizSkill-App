import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ skillId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { skillId } = await params;

  const skill = await prisma.skill.findUnique({ where: { id: skillId } });
  if (!skill || skill.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.skill.update({
    where: { id: skillId },
    data: { isDeleted: true },
  });

  return NextResponse.json({ message: "Skill deleted" });
}
