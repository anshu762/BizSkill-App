"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ProfileCard } from "@/components/ProfileCard";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Package } from "lucide-react";

const categories = [
  "GRAPHIC_DESIGN","SOCIAL_MEDIA","PHOTOGRAPHY","WEBSITE",
  "MARKETING","BRANDING","FINANCE","PITCH_DECK","CONTENT","OTHER",
] as const;

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "most_popular", label: "Most Popular" },
  { value: "coins_low", label: "Lowest Coins" },
  { value: "coins_high", label: "Highest Coins" },
];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categories_, setCategories] = useState<string[]>([]);
  const [level, setLevel] = useState("");
  const [minCoins, setMinCoins] = useState("");
  const [maxCoins, setMaxCoins] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const queryParams = new URLSearchParams();
  if (debouncedSearch) queryParams.set("search", debouncedSearch);
  if (categories_.length) queryParams.set("category", categories_.join(","));
  if (level) queryParams.set("level", level);
  if (minCoins) queryParams.set("minCoins", minCoins);
  if (maxCoins) queryParams.set("maxCoins", maxCoins);
  queryParams.set("sort", sort);
  queryParams.set("page", String(page));

  const { data, isLoading } = useQuery({
    queryKey: ["marketplace", queryParams.toString()],
    queryFn: async () => {
      const res = await fetch(`/api/marketplace?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const toggleCategory = useCallback((cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setPage(1);
  }, []);

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setCategories([]);
    setLevel("");
    setMinCoins("");
    setMaxCoins("");
    setSort("newest");
    setPage(1);
  }

  const hasFilters = search || categories_.length || level || minCoins || maxCoins;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="text-2xl font-bold text-white">Marketplace</h1>
      <p className="mt-1 text-sm text-gray-400">Find skills to exchange with other entrepreneurs.</p>

      <div className="mt-8 flex gap-8">
        {/* Sidebar */}
        <aside className="sticky top-8 hidden w-72 shrink-0 space-y-6 lg:block">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              className="border-white/10 pl-9"
              placeholder="Search skills or businesses..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Categories</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={categories_.includes(cat)}
                    onCheckedChange={() => toggleCategory(cat)}
                    className="border-white/20 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                  />
                  <span className="text-sm text-gray-300">{cat.replace(/_/g, " ")}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Level */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Level</h3>
            <Select value={level} onValueChange={(v) => { setLevel(v ?? ""); setPage(1); }}>
              <SelectTrigger className="border-white/10 w-full">
                <SelectValue placeholder="Any level" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-gray-950">
                <SelectItem value="">Any level</SelectItem>
                <SelectItem value="BEGINNER">Beginner</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                <SelectItem value="EXPERT">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Coin Range */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">BizCoin Range</h3>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                className="border-white/10"
                placeholder="Min"
                value={minCoins}
                onChange={(e) => { setMinCoins(e.target.value); setPage(1); }}
              />
              <span className="text-gray-500">—</span>
              <Input
                type="number"
                className="border-white/10"
                placeholder="Max"
                value={maxCoins}
                onChange={(e) => { setMaxCoins(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          {hasFilters && (
            <Button variant="outline" className="w-full border-white/10 text-gray-300" onClick={clearFilters}>
              <SlidersHorizontal className="mr-2 h-4 w-4" />Clear Filters
            </Button>
          )}
        </aside>

        {/* Main */}
        <div className="flex-1">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-400">
              {data ? `${data.total} skill${data.total !== 1 ? "s" : ""} found` : ""}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Sort:</span>
              <Select value={sort} onValueChange={(v) => { setSort(v ?? "newest"); setPage(1); }}>
                <SelectTrigger className="border-white/10 h-8 w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-gray-950">
                  {sortOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="border-white/10 bg-white/[0.03] animate-pulse">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-white/5" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-24 rounded bg-white/5" />
                        <div className="h-3 w-16 rounded bg-white/5" />
                      </div>
                    </div>
                    <div className="mt-4 h-6 w-20 rounded bg-white/5" />
                    <div className="mt-3 flex gap-2">
                      <div className="h-5 w-16 rounded bg-white/5" />
                      <div className="h-5 w-16 rounded bg-white/5" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : data?.skills?.length === 0 ? (
            <Card className="border-white/10 bg-white/[0.03] py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                <Package className="h-8 w-8 text-indigo-400" />
              </div>
              <p className="mt-4 text-lg font-medium text-white">No skills found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
              {hasFilters && (
                <Button variant="outline" className="mt-4 border-white/10 text-gray-300" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </Card>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {data?.skills?.map((skill: any) => (
                  <ProfileCard
                    key={skill.id}
                    user={{
                      id: skill.user.id,
                      name: skill.user.name,
                      image: skill.user.image,
                      bizCoins: skill.user.bizCoins,
                      businessProfile: skill.user.businessProfile,
                      skills: skill.user.skills ?? [],
                    }}
                  />
                ))}
              </div>

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-gray-300"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />Previous
                  </Button>
                  <span className="text-sm text-gray-400">
                    Page {data.currentPage} of {data.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-gray-300"
                    disabled={page >= data.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next<ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
