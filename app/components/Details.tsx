import { memo } from "react";
import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "../components/Accordion";

interface Tip {
  type: "good" | "improve";
  tip: string;
  explanation?: string;
}

interface CategoryData {
  score: number;
  tips: Tip[];
}

const ScoreBadge = memo(({ score }: { score: number }) => {
  const getStatus = () => {
    if (score > 69) {
      return {
        bg: "bg-green-100 text-green-700",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
      };
    }
    if (score > 39) {
      return {
        bg: "bg-yellow-100 text-yellow-700",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
          </svg>
        ),
      };
    }
    return {
      bg: "bg-red-100 text-red-700",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    };
  };

  const status = getStatus();

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium", status.bg)}>
      {status.icon}
      <span>{score}/100</span>
    </div>
  );
});

ScoreBadge.displayName = "ScoreBadge";

const CategoryHeader = memo(({ title, categoryScore }: { title: string; categoryScore: number }) => (
  <div className="flex items-center justify-between w-full">
    <span className="text-lg font-semibold text-slate-900">{title}</span>
    <ScoreBadge score={categoryScore} />
  </div>
));

CategoryHeader.displayName = "CategoryHeader";

interface TipCardProps {
  tip: Tip;
}

const TipCard = memo(({ tip }: TipCardProps) => {
  const isGood = tip.type === "good";
  const colors = isGood
    ? { bg: "bg-green-50", border: "border-green-200", text: "green" }
    : { bg: "bg-amber-50", border: "border-amber-200", text: "amber" };

  return (
    <div className={cn("rounded-xl p-4 border", colors.bg, colors.border)}>
      <div className="flex items-start gap-3">
        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", isGood ? "bg-green-100" : "bg-amber-100")}>
          {isGood ? (
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h5 className={cn("font-medium mb-1", `text-${colors.text}-900`)}>{tip.tip}</h5>
          <p className={cn("text-sm", `text-${colors.text}-700`)}>
            {tip.explanation || "No detailed explanation available."}
          </p>
        </div>
      </div>
    </div>
  );
});

TipCard.displayName = "TipCard";

interface CategoryContentProps {
  tips: Tip[];
}

const CategoryContent = memo(({ tips }: CategoryContentProps) => {
  if (!tips || tips.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100">
        <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-slate-500 font-medium">No feedback available</p>
        <p className="text-slate-400 text-sm mt-1">Analysis did not generate tips for this category.</p>
      </div>
    );
  }

  const goodTips = tips.filter((t) => t.type === "good");
  const improveTips = tips.filter((t) => t.type === "improve");

  return (
    <div className="space-y-6">
      {goodTips.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Strengths ({goodTips.length})
          </h4>
          <div className="space-y-3">
            {goodTips.map((tip, index) => (
              <TipCard key={`good-${index}`} tip={tip} />
            ))}
          </div>
        </div>
      )}

      {improveTips.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-amber-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Areas to Improve ({improveTips.length})
          </h4>
          <div className="space-y-3">
            {improveTips.map((tip, index) => (
              <TipCard key={`improve-${index}`} tip={tip} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

CategoryContent.displayName = "CategoryContent";

interface DetailsProps {
  feedback: Feedback;
}

const Details = memo(({ feedback }: DetailsProps) => {
  const categories = [
    { id: "tone-style", title: "Tone & Style", data: feedback?.toneAndStyle },
    { id: "content", title: "Content Quality", data: feedback?.content },
    { id: "structure", title: "Resume Structure", data: feedback?.structure },
    { id: "skills", title: "Skills Match", data: feedback?.skills },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900">Detailed Feedback</h2>
        <p className="text-sm text-slate-500 mt-1">
          Click on each category to see specific recommendations
        </p>
      </div>

      <Accordion defaultOpen="tone-style" className="divide-y divide-slate-100">
        {categories.map((category) => (
          <AccordionItem key={category.id} id={category.id}>
            <AccordionHeader itemId={category.id}>
              <CategoryHeader
                title={category.title}
                categoryScore={category.data?.score || 0}
              />
            </AccordionHeader>
            <AccordionContent itemId={category.id}>
              <div className="pt-4">
                <CategoryContent tips={category.data?.tips || []} />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
});

Details.displayName = "Details";

export default Details;
