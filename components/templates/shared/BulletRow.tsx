import {
  AlertTriangle,
  ArrowDown,
  Bed,
  Brain,
  Check,
  Clock,
  Coffee,
  Dumbbell,
  Flame,
  Heart,
  LineChart,
  Shield,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Brand } from "@/lib/schema";
import { DEFAULT_ACCENT } from "@/lib/schema";

const ICON_MAP: Record<string, LucideIcon> = {
  bed: Bed,
  brain: Brain,
  coffee: Coffee,
  chart: LineChart,
  alert: AlertTriangle,
  dumbbell: Dumbbell,
  check: Check,
  "arrow-down": ArrowDown,
  heart: Heart,
  flame: Flame,
  clock: Clock,
  target: Target,
  zap: Zap,
  shield: Shield,
};

type BulletRowProps = {
  icon: string;
  text: string;
  brand?: Brand;
};

export function BulletRow({ icon, text, brand }: BulletRowProps) {
  const accent = brand?.accentColor ?? DEFAULT_ACCENT;
  const Icon = ICON_MAP[icon] ?? Check;

  return (
    <div className="flex items-start gap-4">
      <div
        className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${accent}33`, border: `2px solid ${accent}` }}
      >
        <Icon className="h-5 w-5 text-white" strokeWidth={2.5} />
      </div>
      <p className="pt-1.5 text-[26px] leading-snug font-medium text-white/95">
        {text}
      </p>
    </div>
  );
}
