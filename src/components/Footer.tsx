import Link from "next/link";

const footerLinks = {
  Platform: [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/feed", label: "Feed" },
    { href: "/teams", label: "Teams" },
    { href: "/dashboard", label: "Dashboard" },
  ],
  Resources: [
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#features", label: "Features" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/30">
                B
              </div>
              <span className="text-lg font-bold text-white">BizSkills</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-400">
              The skill exchange platform for student entrepreneurs. Trade
              services using BizCoins — no money needed.
            </p>
            <p className="mt-6 text-sm font-medium text-gray-300">
              Trade skills. Build businesses. Grow together.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-5 text-sm font-semibold text-white">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} BizSkills. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sm text-gray-500 transition-colors hover:text-gray-300"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-500 transition-colors hover:text-gray-300"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="text-sm text-gray-500 transition-colors hover:text-gray-300"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
