import ScoreBadge from "./ScoreBadge";
import ScoreGauge from "./ScoreGauge";
import { memo } from "react";

interface CategoryProps {
  title: string;
  score: number;
}

const Category = memo(({ title, score }: CategoryProps) => {
  const textColor = score > 70 ? "text-green-600" : score > 49 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <span className="text-sm font-medium text-slate-700">{title}</span>
      <div className="flex items-center gap-3">
        <ScoreBadge score={score} />
        <span className={`text-sm font-semibold ${textColor}`}>{score}</span>
      </div>
    </div>
  );
});

Category.displayName = "Category";

interface SummaryProps {
  feedback: Feedback;
}

const Summary = memo(({ feedback }: SummaryProps) => {
  const getOverallStatus = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
    if (score >= 60) return { label: "Good", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" };
    return { label: "Needs Improvement", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
  };

  const status = getOverallStatus(feedback.overallScore);

  return (
    <div className={`rounded-2xl bg-white border ${status.border} overflow-hidden`}>
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-6">
          <ScoreGauge score={feedback.overallScore} />
          <div>
            <h2 className="text-lg font-bold text-slate-900">Overall Score</h2>
            <p className="text-sm text-slate-500 mt-1">
              Based on tone, content, structure, and skills
            </p>
            <div className={`inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full ${status.bg}`}>
              <span className={`text-sm font-medium ${status.color}`}>
                {status.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Category title="Tone & Style" score={feedback.toneAndStyle?.score || 0} />
        <Category title="Content" score={feedback.content?.score || 0} />
        <Category title="Structure" score={feedback.structure?.score || 0} />
        <Category title="Skills" score={feedback.skills?.score || 0} />
      </div>
    </div>
  );
});

Summary.displayName = "Summary";

export default Summary;
