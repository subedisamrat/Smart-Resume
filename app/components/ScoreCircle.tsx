import { memo } from "react";

const ScoreCircle = memo(({ score = 0 }: { score: number }) => {
  const radius = 36;
  const stroke = 5;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = score / 100;
  const strokeDashoffset = circumference * (1 - progress);

  const getColor = () => {
    if (score >= 80) return { stroke: "#22c55e", gradient: "from-green-400 to-green-600" };
    if (score >= 60) return { stroke: "#eab308", gradient: "from-yellow-400 to-yellow-600" };
    return { stroke: "#ef4444", gradient: "from-red-400 to-red-600" };
  };

  const colors = getColor();

  return (
    <div className="relative w-[80px] h-[80px]">
      <svg height="100%" width="100%" viewBox="0 0 80 80" className="transform -rotate-90">
        <defs>
          <linearGradient id={`scoreGrad-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.stroke} />
            <stop offset="100%" stopColor={colors.stroke} />
          </linearGradient>
        </defs>
        <circle
          cx="40"
          cy="40"
          r={normalizedRadius}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="transparent"
        />
        <circle
          cx="40"
          cy="40"
          r={normalizedRadius}
          stroke={`url(#scoreGrad-${score})`}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold text-lg text-slate-900">{score}</span>
        <span className="text-[10px] text-slate-400">/100</span>
      </div>
    </div>
  );
});

ScoreCircle.displayName = "ScoreCircle";

export default ScoreCircle;
