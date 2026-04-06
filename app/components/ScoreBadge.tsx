import { memo } from "react";

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge = memo(({ score }: ScoreBadgeProps) => {
  let badgeColor = "";
  let badgeText = "";

  if (score > 70) {
    badgeColor = "bg-badge-green text-green-600";
    badgeText = "Strong";
  } else if (score > 49) {
    badgeColor = "bg-badge-yellow text-yellow-600";
    badgeText = "Good Start";
  } else {
    badgeColor = "bg-badge-red text-red-600";
    badgeText = "Needs Work";
  }

  return (
    <div className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${badgeColor}`}>
      <p className="text-xs sm:text-sm font-medium">{badgeText}</p>
    </div>
  );
});

ScoreBadge.displayName = "ScoreBadge";

export default ScoreBadge;
