import { memo } from "react";

interface ATSProps {
  score: number;
  suggestions: { type: "good" | "improve"; tip: string }[];
}

const ATS = memo(({ score, suggestions }: ATSProps) => {
  const safeScore = score || 0;
  const safeSuggestions = suggestions || [];

  const getStatusInfo = () => {
    if (safeScore >= 80) {
      return {
        gradient: "from-green-50 to-white",
        iconBg: "bg-green-500",
        icon: (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
        title: "Excellent ATS Score",
        subtitle: "Your resume is well-optimized for applicant tracking systems",
        borderColor: "border-green-200",
        bgColor: "bg-green-50",
        textColor: "text-green-700",
      };
    }
    if (safeScore >= 60) {
      return {
        gradient: "from-yellow-50 to-white",
        iconBg: "bg-yellow-500",
        icon: (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
          </svg>
        ),
        title: "Good ATS Score",
        subtitle: "Your resume has decent ATS compatibility",
        borderColor: "border-yellow-200",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700",
      };
    }
    return {
      gradient: "from-red-50 to-white",
      iconBg: "bg-red-500",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      title: "Needs Improvement",
      subtitle: "Consider optimizing for better ATS compatibility",
      borderColor: "border-red-200",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
    };
  };

  const status = getStatusInfo();

  return (
    <div className={`bg-gradient-to-b ${status.gradient} rounded-2xl border ${status.borderColor} overflow-hidden`}>
      <div className="p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-10 h-10 ${status.iconBg} rounded-xl flex items-center justify-center`}>
            {status.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900">{status.title}</h2>
            </div>
            <p className="text-sm text-slate-500">{status.subtitle}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900">{safeScore}</div>
            <div className="text-xs text-slate-400">/100</div>
          </div>
        </div>

        <div className={`h-2 ${status.bgColor} rounded-full overflow-hidden`}>
          <div
            className={`h-full ${status.iconBg.replace('bg-', 'bg-')} transition-all duration-500`}
            style={{ width: `${safeScore}%` }}
          ></div>
        </div>
      </div>

      {safeSuggestions.length > 0 && (
        <div className="px-5 pb-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Key Points</h3>
          <div className="space-y-2">
            {safeSuggestions.slice(0, 4).map((suggestion, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 p-2 rounded-lg ${status.bgColor}`}
              >
                <span className={status.textColor}>
                  {suggestion.type === "good" ? (
                    <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                    </svg>
                  )}
                </span>
                <p className={`text-sm ${status.textColor}`}>{suggestion.tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

ATS.displayName = "ATS";

export default ATS;
