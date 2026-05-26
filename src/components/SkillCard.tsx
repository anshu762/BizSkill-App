import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Coins } from "lucide-react";

type SkillCardSkill = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  level: string | null;
  coinValue: number;
};

const levelColor: Record<string, string> = {
  BEGINNER: "bg-green-500/10 text-green-400 border-green-500/20",
  INTERMEDIATE: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  EXPERT: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export function SkillCard({ skill }: { skill: SkillCardSkill }) {
  return (
    <Card className="group border-white/10 bg-white/[0.03] transition-all hover:border-indigo-500/30 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-indigo-500/5">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-white">
              {skill.title}
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="text-xs">
                {skill.category.replace(/_/g, " ")}
              </Badge>
              {skill.level && (
                <Badge
                  variant="outline"
                  className={`text-xs ${levelColor[skill.level] ?? ""}`}
                >
                  {skill.level}
                </Badge>
              )}
            </div>
          </div>
          <Badge
            variant="outline"
            className="shrink-0 border-amber-500/30 bg-amber-500/10 text-amber-400"
          >
            <Coins className="mr-1 h-3 w-3" />
            {skill.coinValue}
          </Badge>
        </div>
        {skill.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-400">
            {skill.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
