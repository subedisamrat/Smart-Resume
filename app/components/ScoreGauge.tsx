import { memo } from "react";

const PATH_LENGTH = 125.66370614359172;

const ScoreGauge = memo(({ score = 75 }: { score: number }) => {
  const percentage = score / 100;
  const strokeDashoffset = PATH_LENGTH * (1 - percentage);

  const getColor = () => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#eab308";
    return "#ef4444";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-20">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={getColor()} stopOpacity="0.6" />
              <stop offset="100%" stopColor={getColor()} />
            </linearGradient>
          </defs>

          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
            strokeLinecap="round"
          />

          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={PATH_LENGTH}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <div className="text-xl font-bold text-slate-900 pt-4">{score}</div>
          <div className="text-xs text-slate-400">/100</div>
        </div>
      </div>
    </div>
  );
});

ScoreGauge.displayName = "ScoreGauge";

export default ScoreGauge;
