import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Ban,
  Bed,
  Bookmark,
  Brain,
  Check,
  Clock,
  Coffee,
  Dumbbell,
  Flame,
  Heart,
  LineChart,
  Shield,
  Star,
  Target,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type IconId =
  | "none"
  | "swipe"
  | "bed"
  | "brain"
  | "coffee"
  | "chart"
  | "alert"
  | "dumbbell"
  | "check"
  | "arrow-down"
  | "arrow-right"
  | "heart"
  | "flame"
  | "clock"
  | "target"
  | "zap"
  | "shield"
  | "bookmark"
  | "star"
  | "trophy"
  | "activity"
  | "ban";

export type IconOption = {
  id: IconId;
  label: string;
};

const LUCIDE_MAP: Record<string, LucideIcon> = {
  bed: Bed,
  brain: Brain,
  coffee: Coffee,
  chart: LineChart,
  alert: AlertTriangle,
  dumbbell: Dumbbell,
  check: Check,
  "arrow-down": ArrowDown,
  "arrow-right": ArrowRight,
  heart: Heart,
  flame: Flame,
  clock: Clock,
  target: Target,
  zap: Zap,
  shield: Shield,
  bookmark: Bookmark,
  star: Star,
  trophy: Trophy,
  activity: Activity,
  ban: Ban,
};

export const ICON_OPTIONS: IconOption[] = [
  { id: "none", label: "None" },
  { id: "swipe", label: "Swipe →" },
  { id: "check", label: "Check" },
  { id: "arrow-right", label: "Arrow right" },
  { id: "arrow-down", label: "Arrow down" },
  { id: "alert", label: "Alert" },
  { id: "bed", label: "Sleep" },
  { id: "brain", label: "Brain" },
  { id: "coffee", label: "Coffee" },
  { id: "dumbbell", label: "Dumbbell" },
  { id: "heart", label: "Heart" },
  { id: "flame", label: "Flame" },
  { id: "clock", label: "Clock" },
  { id: "target", label: "Target" },
  { id: "zap", label: "Energy" },
  { id: "shield", label: "Shield" },
  { id: "chart", label: "Chart" },
  { id: "bookmark", label: "Bookmark" },
  { id: "star", label: "Star" },
  { id: "trophy", label: "Trophy" },
  { id: "activity", label: "Activity" },
  { id: "ban", label: "Ban" },
];

export function SwipeIcon({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-bold tracking-wider ${className}`}
    >
      <span className="text-[0.65em] leading-none">SWIPE</span>
      <ArrowRight className="h-[1em] w-[1em]" strokeWidth={3} />
    </span>
  );
}

type CarouselIconProps = {
  icon: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function CarouselIcon({
  icon,
  className = "",
  size = "md",
}: CarouselIconProps) {
  if (icon === "none") return null;

  const sizeClass =
    size === "sm" ? "h-4 w-4 text-[10px]" : size === "lg" ? "h-8 w-8 text-sm" : "h-5 w-5 text-xs";

  if (icon === "swipe") {
    return (
      <SwipeIcon
        className={`${size === "lg" ? "text-base" : size === "sm" ? "text-[10px]" : "text-xs"} ${className}`}
      />
    );
  }

  const Lucide = LUCIDE_MAP[icon] ?? Check;
  return <Lucide className={`${sizeClass} ${className}`} strokeWidth={2.5} />;
}

export function isKnownIcon(icon: string): icon is IconId {
  return ICON_OPTIONS.some((option) => option.id === icon);
}
