"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Coins,
  ShoppingBag,
  Rss,
  Users,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { href: "/feed", label: "Feed", icon: Rss },
  { href: "/teams", label: "Teams", icon: Users },
  { href: `/profile`, label: "My Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/10 bg-gray-950">
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-white/10 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/30">
          B
        </div>
        <span className="text-lg font-bold text-white">BizSkills</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-white/10" />

      <div className="shrink-0 space-y-3 px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={session?.user?.image ?? ""} alt={session?.user?.name ?? ""} />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs">
              {session?.user?.name?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {session?.user?.name}
            </p>
            <p className="truncate text-xs text-gray-400">
              {session?.user?.email}
            </p>
          </div>
        </div>

        <Badge className="flex w-full items-center justify-center gap-1.5 border-amber-500/20 bg-amber-500/10 py-1.5 text-amber-400">
          <Coins className="h-4 w-4" />
          <span className="font-semibold">{session?.user?.bizCoins ?? 0} BizCoins</span>
        </Badge>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ redirectTo: "/" })}
          className="w-full justify-start text-gray-400 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
