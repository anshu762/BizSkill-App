import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkillCard } from "@/components/SkillCard";
import {
  Globe,
  Camera,
  Coins,
  MapPin,
  Settings,
  Calendar,
  Sparkles,
  Handshake,
} from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { ExchangeModal } from "@/components/ExchangeModal";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const session = await auth();
  const { userId } = await params;
  const isOwnProfile = session?.user?.id === userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      age: true,
      location: true,
      bizCoins: true,
      createdAt: true,
      businessProfile: true,
      skills: {
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="border-white/10 bg-white/[0.03] p-12 text-center">
          <p className="text-muted-foreground">User not found</p>
        </Card>
      </div>
    );

  const offered = user.skills.filter((s) => s.isOffering);
  const needed = user.skills.filter((s) => !s.isOffering);

  // Current user's skills for exchange modal
  const currentUser = !isOwnProfile && session
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          skills: {
            where: { isDeleted: false, isOffering: true },
            select: { id: true, title: true, coinValue: true },
          },
        },
      })
    : null;

  return (
    <div className="min-h-screen">
      {/* Gradient Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/15 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-5xl px-6 py-12">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Hero Card */}
        <Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-indigo-500/[0.07] via-purple-500/[0.05] to-pink-500/[0.07]">
          {/* Decorative Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative flex flex-col items-center px-8 pb-8 pt-12 text-center sm:flex-row sm:items-start sm:gap-8 sm:pb-10 sm:pt-10 sm:text-left">
            {/* Avatar with Glow */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 blur-xl opacity-40" />
              <Avatar className="relative h-28 w-28 border-4 border-white/10 shadow-2xl sm:h-32 sm:w-32">
                <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl text-white sm:text-4xl">
                  {user.name?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="mt-6 flex-1 sm:mt-2">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap">
                <h1 className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                  {user.name}
                </h1>
                {user.bizCoins !== undefined && (
                  <Badge className="border-amber-500/20 bg-amber-500/10 px-3 py-1 text-amber-400">
                    <Coins className="mr-1 h-4 w-4" />
                    {user.bizCoins} BC
                  </Badge>
                )}
              </div>

              {user.businessProfile && (
                <>
                  <p className="mt-2 text-xl font-medium text-gray-300">
                    {user.businessProfile.businessName}
                  </p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                    {user.businessProfile.industry && (
                      <Badge className="border-indigo-500/20 bg-indigo-500/10 text-indigo-300">
                        {user.businessProfile.industry.replace(/_/g, " ")}
                      </Badge>
                    )}
                    {user.businessProfile.stage && (
                      <Badge
                        variant="outline"
                        className="border-purple-500/20 bg-purple-500/10 text-purple-300"
                      >
                        {user.businessProfile.stage}
                      </Badge>
                    )}
                  </div>
                </>
              )}

              <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-gray-400 sm:justify-start">
                {user.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {user.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-indigo-400" />{" "}
                  {offered.length + needed.length} skills
                </span>
              </div>

              {user.bio && (
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
                  {user.bio}
                </p>
              )}

              <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
                {user.businessProfile?.website && (
                  <a
                    href={user.businessProfile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-gray-300 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                )}
                {user.businessProfile?.instagramHandle && (
                  <a
                    href={`https://instagram.com/${user.businessProfile.instagramHandle.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-gray-300 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                  >
                    <Camera className="h-4 w-4" />
                    {user.businessProfile.instagramHandle}
                  </a>
                )}
              </div>
            </div>

            {isOwnProfile && (
              <Link href="/dashboard/settings" className="shrink-0 sm:self-start">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                >
                  <Settings className="mr-1.5 h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
            )}
          </div>
        </Card>

        {/* Skills Section */}
        <section className="mt-10">
          <Tabs defaultValue="offered" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList className="border-white/10 bg-white/[0.03]">
                <TabsTrigger
                  value="offered"
                  className="data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-400"
                >
                  Skills I Offer ({offered.length})
                </TabsTrigger>
                <TabsTrigger
                  value="needed"
                  className="data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-400"
                >
                  Skills I Need ({needed.length})
                </TabsTrigger>
              </TabsList>

              {isOwnProfile && (
                <Link href="/dashboard/settings">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <Sparkles className="mr-1.5 h-4 w-4" />
                    Manage Skills
                  </Button>
                </Link>
              )}
            </div>

            <TabsContent value="offered" className="mt-6">
              {offered.length === 0 ? (
                <Card className="border-white/10 bg-white/[0.03] py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                    <Sparkles className="h-6 w-6 text-indigo-400" />
                  </div>
                  <p className="mt-4 font-medium">No skills offered yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {isOwnProfile
                      ? "Add skills you can help others with."
                      : "This user hasn't listed any skills yet."}
                  </p>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {offered.map((skill) => (
                    <SkillCard key={skill.id} skill={skill} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="needed" className="mt-6">
              {needed.length === 0 ? (
                <Card className="border-white/10 bg-white/[0.03] py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <Handshake className="h-6 w-6 text-purple-400" />
                  </div>
                  <p className="mt-4 font-medium">No skills needed yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {isOwnProfile
                      ? "Add skills you're looking for help with."
                      : "This user isn't looking for any skills right now."}
                  </p>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {needed.map((skill) => (
                    <SkillCard key={skill.id} skill={skill} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>

        {/* Exchange CTA */}
        {session && (
          <div className="mt-12 flex justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
            >
              <Handshake className="mr-2 h-5 w-5" />
              {isOwnProfile ? "Browse Marketplace" : "Request Skill Exchange"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
