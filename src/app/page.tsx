import Link from "next/link";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Repeat2,
  Coins,
  Users,
  Sparkles,
  Palette,
  Camera,
  TrendingUp,
  Code2,
  Megaphone,
  GraduationCap,
  BarChart3,
} from "lucide-react";

const features = [
  {
    title: "Skill Exchange",
    description:
      "Offer your expertise in design, marketing, or coding and get help with what you need. No money involved.",
    icon: Repeat2,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "BizCoins",
    description:
      "Earn virtual currency by helping others. Spend BizCoins to access skills you need for your startup.",
    icon: Coins,
    gradient: "from-amber-500 to-orange-500",
  },
  {
    title: "Startup Teams",
    description:
      "Find co-founders and team members who complement your skills. Build your dream startup team.",
    icon: Users,
    gradient: "from-purple-500 to-pink-500",
  },
];

const steps = [
  {
    step: "01",
    title: "Sign Up",
    description:
      "Create your profile in minutes. Tell the community about your skills and what you're building.",
  },
  {
    step: "02",
    title: "Earn BizCoins",
    description:
      "Offer your skills to others and earn BizCoins. The more you help, the more you earn.",
  },
  {
    step: "03",
    title: "Grow Together",
    description:
      "Use BizCoins to get help on your projects. Find team members and build your startup.",
  },
];

const categories = [
  { icon: Palette, label: "Graphic Design", count: "120+ skills" },
  { icon: TrendingUp, label: "Social Media", count: "95+ skills" },
  { icon: Camera, label: "Photography", count: "60+ skills" },
  { icon: Code2, label: "Web Development", count: "85+ skills" },
  { icon: Megaphone, label: "Marketing", count: "110+ skills" },
  { icon: Sparkles, label: "Branding", count: "70+ skills" },
  { icon: BarChart3, label: "Finance", count: "45+ skills" },
  { icon: GraduationCap, label: "Pitch Deck", count: "55+ skills" },
];

const testimonials = [
  {
    quote:
      "BizSkills helped me find a co-founder who complemented my technical skills. We built our MVP in just 2 months!",
    author: "Priya Sharma",
    role: "CS Student, DTU",
  },
  {
    quote:
      "I earned 500 BizCoins by designing logos for other startups. Now I'm using them to get marketing help for my own venture.",
    author: "Rahul Verma",
    role: "Design Student, NID",
  },
  {
    quote:
      "The best part? No money involved. Just pure skill exchange. It's like barter system 2.0 for student entrepreneurs.",
    author: "Ananya Gupta",
    role: "Business Student, IIM",
  },
];

export default async function Home() {
  const session = await auth();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pb-32 pt-28 sm:pt-36">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[500px] bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span className="text-muted-foreground">
                Student Entrepreneurs Community
              </span>
            </div>
            <h1 className="bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-5xl font-bold leading-tight tracking-tight text-transparent sm:text-7xl sm:leading-tight">
              Trade Skills.
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Build Businesses.
              </span>
              <br />
              Grow Together.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              The skill exchange platform for student entrepreneurs. Offer your
              expertise, earn BizCoins, and get the help you need to build your
              startup — without spending a rupee.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href={session ? "/dashboard" : "/auth/signup"}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="outline" size="lg">
                  Explore Skills
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-white/5 bg-white/[0.02] py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-8 text-center sm:grid-cols-3">
              {[
                { value: "500+", label: "Student Entrepreneurs" },
                { value: "1,000+", label: "Skills Listed" },
                { value: "50,000+", label: "BizCoins Traded" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to build your startup
              </h2>
              <p className="mt-4 text-muted-foreground">
                No money? No problem. Trade skills and grow together.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="group relative overflow-hidden border-white/10 bg-white/[0.03] p-8 transition-all hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div
                    className={`mb-5 inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3 text-white shadow-lg`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="border-y border-white/5 bg-white/[0.02] px-6 py-24"
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How it works
              </h2>
              <p className="mt-4 text-muted-foreground">
                Three simple steps to start trading skills
              </p>
            </div>
            <div className="mt-16 grid gap-12 sm:grid-cols-3">
              {steps.map((step, i) => (
                <div key={step.step} className="relative text-center">
                  {i < steps.length - 1 && (
                    <div className="absolute left-[60%] top-8 hidden h-px w-[80%] bg-gradient-to-r from-indigo-500/50 to-transparent sm:block" />
                  )}
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white shadow-lg shadow-indigo-500/25">
                    {step.step}
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skill Categories */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Browse skill categories
              </h2>
              <p className="mt-4 text-muted-foreground">
                From design to finance — find the exact skill you need
              </p>
            </div>
            <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat) => (
                <Link key={cat.label} href="/marketplace">
                  <div className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:border-white/20 hover:bg-white/[0.06]">
                    <div className="inline-flex rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-2.5 text-indigo-400">
                      <cat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{cat.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {cat.count}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-y border-white/5 bg-white/[0.02] px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Loved by student entrepreneurs
              </h2>
              <p className="mt-4 text-muted-foreground">
                Hear from students who are building and growing on BizSkills
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {testimonials.map((t) => (
                <Card
                  key={t.author}
                  className="border-white/10 bg-white/[0.03] p-8"
                >
                  <div className="mb-6 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-4 w-4 fill-yellow-500"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <p className="text-sm font-medium">{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 px-12 py-20 text-center">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
              <div className="relative">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Ready to build your startup?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                  Join hundreds of student entrepreneurs. Start trading skills
                  and growing your business today.
                </p>
                <div className="mt-10 flex items-center justify-center gap-4">
                  <Link href={session ? "/dashboard" : "/auth/signup"}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/marketplace">
                    <Button variant="outline" size="lg">
                      Browse Skills
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
