import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Coins, LogOut, Settings, User } from "lucide-react";

export async function Navbar() {
  const session = await auth();

  const navLinks = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/feed", label: "Feed" },
    { href: "/teams", label: "Teams" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            BizSkills
          </Link>
          {session && (
            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <Badge
                variant="secondary"
                className="flex items-center gap-1.5 px-3 py-1.5"
              >
                <Coins className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">{session.user.bizCoins}</span>
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger className="relative h-9 w-9 rounded-full cursor-pointer hover:bg-muted inline-flex items-center justify-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={session.user.image ?? ""}
                      alt={session.user.name ?? ""}
                    />
                    <AvatarFallback>
                      {session.user.name?.charAt(0) ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{session.user.name}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {session.user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link
                      href="/profile"
                      className="flex w-full items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/profile/settings"
                      className="flex w-full items-center"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <form
                      action={async () => {
                        "use server";
                        await signOut({ redirectTo: "/" });
                      }}
                      className="w-full"
                    >
                      <button
                        type="submit"
                        className="flex w-full items-center"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button>
              <a href="/auth/signin">Sign In</a>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
