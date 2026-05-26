import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Coins } from "lucide-react";

type ProfileCardUser = {
  id: string;
  name: string | null;
  image: string | null;
  bizCoins: number;
  businessProfile: { businessName: string; industry: string | null } | null;
  skills: { title: string; category: string; coinValue: number; level: string | null }[];
};

export function ProfileCard({ user }: { user: ProfileCardUser }) {
  const topSkills = user.skills.filter((s) => s.title).slice(0, 2);
  return (
    <Link href={`/profile/${user.id}`}>
      <Card className="group border-white/10 bg-white/[0.03] transition-all hover:border-indigo-500/30 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                {user.name?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-white">{user.name}</p>
              {user.businessProfile && (
                <p className="truncate text-sm text-gray-400">{user.businessProfile.businessName}</p>
              )}
            </div>
          </div>
          {user.businessProfile?.industry && (
            <Badge className="mt-3 border-indigo-500/20 bg-indigo-500/10 text-indigo-300 text-xs">
              {user.businessProfile.industry.replace(/_/g, " ")}
            </Badge>
          )}
          {topSkills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {topSkills.map((s, i) => (
                <Badge key={i} variant="outline" className="border-white/10 text-xs text-gray-300">
                  {s.title}
                </Badge>
              ))}
            </div>
          )}
          <div className="mt-3 flex items-center gap-1 text-sm text-amber-400">
            <Coins className="h-4 w-4" />
            <span className="font-medium">{user.bizCoins} BizCoins</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
