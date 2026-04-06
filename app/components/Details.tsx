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
  explanation: string;
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

interface CategoryContentProps {
  tips: Tip[];
}

const CategoryContent = memo(({ tips }: CategoryContentProps) => {
  if (!tips || tips.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <p>No detailed feedback available for this category.</p>
      </div>
    );
  }

  const goodTips = tips.filter((t) => t.type === "good");
  const improveTips = tips.filter((t) => t.type === "improve");

  return (
    <div className="space-y-6">
      {goodTips.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-green-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            What's Working Well
          </h4>
          <div className="space-y-3">
            {goodTips.map((tip, index) => (
              <div
                key={`good-${index}`}
                className="bg-green-50 border border-green-200 rounded-xl p-4"
              >
                <h5 className="font-medium text-green-900 mb-1">{tip.tip}</h5>
                <p className="text-sm text-green-700">{tip.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {improveTips.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-amber-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Areas for Improvement
          </h4>
          <div className="space-y-3">
            {improveTips.map((tip, index) => (
              <div
                key={`improve-${index}`}
                className="bg-amber-50 border border-amber-200 rounded-xl p-4"
              >
                <h5 className="font-medium text-amber-900 mb-1">{tip.tip}</h5>
                <p className="text-sm text-amber-700">{tip.explanation}</p>
              </div>
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
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900">Detailed Feedback</h2>
        <p className="text-sm text-slate-500 mt-1">
          Comprehensive analysis of your resume by category
        </p>
      </div>

      <Accordion defaultOpen="tone-style" className="p-2">
        <AccordionItem id="tone-style">
          <AccordionHeader itemId="tone-style">
            <CategoryHeader
              title="Tone & Style"
              categoryScore={feedback?.toneAndStyle?.score || 0}
            />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <div className="pt-2">
              <CategoryContent tips={feedback?.toneAndStyle?.tips || []} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <CategoryHeader
              title="Content"
              categoryScore={feedback?.content?.score || 0}
            />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <div className="pt-2">
              <CategoryContent tips={feedback?.content?.tips || []} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="structure">
          <AccordionHeader itemId="structure">
            <CategoryHeader
              title="Structure"
              categoryScore={feedback?.structure?.score || 0}
            />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <div className="pt-2">
              <CategoryContent tips={feedback?.structure?.tips || []} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <CategoryHeader
              title="Skills"
              categoryScore={feedback?.skills?.score || 0}
            />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <div className="pt-2">
              <CategoryContent tips={feedback?.skills?.tips || []} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
});

Details.displayName = "Details";

export default Details;
