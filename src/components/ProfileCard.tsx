import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Coins } from "lucide-react";

type ProfileCardUser = {
  id: string;
  name: string | null;
  image: string | null;
  bizCoins: number;
  businessProfile?: {
    businessName: string;
    industry: string | null;
  } | null;
  skills?: {
    title: string;
    isOffering: boolean;
  }[];
};

export function ProfileCard({ user }: { user: ProfileCardUser }) {
  const offered = user.skills?.filter((s) => s.isOffering).slice(0, 2) ?? [];

  return (
    <Link href={`/profile/${user.id}`}>
      <Card className="group border-white/10 bg-white/[0.03] p-5 transition-all hover:border-white/20 hover:bg-white/[0.06]">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              {user.name?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{user.name}</p>
            {user.businessProfile && (
              <p className="truncate text-sm text-muted-foreground">
                {user.businessProfile.businessName}
              </p>
            )}
            {user.businessProfile?.industry && (
              <Badge variant="outline" className="mt-1 text-xs">
                {user.businessProfile.industry.replace(/_/g, " ")}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-amber-400">
            <Coins className="h-4 w-4" />
            <span className="font-medium">{user.bizCoins}</span>
          </div>
        </div>

        {offered.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {offered.map((s) => (
              <Badge key={s.title} variant="secondary" className="text-xs">
                {s.title}
              </Badge>
            ))}
          </div>
        )}
      </Card>
    </Link>
  );
}
