"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, ShoppingBag, ArrowLeftRight, Wallet, Settings, Coins, LogOut,
} from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { href: "/dashboard/exchanges", label: "Exchanges", icon: ArrowLeftRight },
  { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },

  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/10 bg-gray-950/95 backdrop-blur-sm">
      <div className="shrink-0 border-b border-white/10 px-6 py-5">
        <Link href="/dashboard" className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
          BizSkills
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-4">
        {user && (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-xs text-white">
                {user.name?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user.name}</p>
              <p className="truncate text-xs text-gray-400">{user.email}</p>
              <Badge className="mt-1 border-amber-500/20 bg-amber-500/10 text-amber-400 text-xs">
                <Coins className="mr-0.5 h-3 w-3" />
                {user.bizCoins ?? 0} BC
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="shrink-0 text-gray-400 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
