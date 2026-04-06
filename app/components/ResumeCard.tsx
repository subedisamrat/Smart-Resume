import { Link } from "react-router";
import ScoreCircle from "../components/ScoreCircle";
import { memo } from "react";

interface ResumeCardProps {
  resume: Resume;
}

const ResumeCard = memo(({ resume }: ResumeCardProps) => {
  const { id, jobTitle, companyName, feedback, createdAt } = resume;

  const getScoreLabel = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "text-green-600", bg: "bg-green-50" };
    if (score >= 60) return { label: "Good", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { label: "Needs Work", color: "text-red-600", bg: "bg-red-50" };
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const score = feedback?.overallScore || 0;
  const scoreStatus = getScoreLabel(score);

  return (
    <Link
      to={`/resume/${id}`}
      className="group block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            {companyName && (
              <h3 className="font-semibold text-slate-900 truncate pr-3">
                {companyName}
              </h3>
            )}
            {jobTitle && (
              <p className="text-sm text-slate-500 truncate">{jobTitle}</p>
            )}
            {!companyName && !jobTitle && (
              <h3 className="font-semibold text-slate-900">Resume Analysis</h3>
            )}
            {createdAt && (
              <p className="text-xs text-slate-400 mt-1">{formatDate(createdAt)}</p>
            )}
          </div>
          <ScoreCircle score={score} />
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${scoreStatus.bg} ${scoreStatus.color}`}>
            {scoreStatus.label}
          </span>
          {feedback?.ATS?.score && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
              ATS: {feedback.ATS.score}
            </span>
          )}
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </Link>
  );
});

ResumeCard.displayName = "ResumeCard";

export default ResumeCard;
