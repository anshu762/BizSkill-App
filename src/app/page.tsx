import Link from "next/link";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ArrowRight,
  Repeat2,
  Coins,
  Users,
} from "lucide-react";

const features = [
  {
    title: "Skill Exchange",
    description:
      "Offer your expertise in design, marketing, or coding and get help with what you need. No money involved.",
    icon: Repeat2,
  },
  {
    title: "BizCoins",
    description:
      "Earn virtual currency by helping others. Spend BizCoins to access skills you need for your startup.",
    icon: Coins,
  },
  {
    title: "Startup Teams",
    description:
      "Find co-founders and team members who complement your skills. Build your dream startup team.",
    icon: Users,
  },
];

export default async function Home() {
  const session = await auth();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
              BizSkills
            </h1>
            <p className="mt-6 text-xl leading-8 text-muted-foreground">
              Trade skills. Build businesses. Grow together.
            </p>
            <p className="mt-4 text-base text-muted-foreground">
              The skill exchange platform for student entrepreneurs — trade services
              using BizCoins instead of money.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href={session ? "/dashboard" : "/auth/signin"}>
                <Button size="lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="outline" size="lg">Explore Skills</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-2">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={session ? "/dashboard" : "/auth/signin"}>
                    <Button variant="ghost" className="p-0">
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
