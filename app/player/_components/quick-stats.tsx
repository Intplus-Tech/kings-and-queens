import { Card, CardContent } from "@/components/ui/card";
import { Star, Trophy, Users, GraduationCap } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { QuickStat } from "./mock-data";

interface QuickStatsProps {
  stats: QuickStat[];
}

const iconMap = {
  star: Star,
  trophy: Trophy,
  users: Users,
  school: GraduationCap,
};

export function QuickStats({ stats }: QuickStatsProps) {
  return (
    <TooltipProvider>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Quick Stats:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = iconMap[stat.icon as keyof typeof iconMap];
            return (
              <Tooltip key={stat.id}>
                <TooltipTrigger asChild>
                  <Card className="bg-secondary">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                      <div className="flex flex-col w-full">
                        <p className="text-xs font-medium">{stat.title}</p>
                        {/* <p className="text-sm font-semibold">{stat.value}</p> */}
                      </div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="max-w-[600px] bg-white text-black p-4"
                >
                  {stat.tooltip}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
