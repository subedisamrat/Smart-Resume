import { useEffect, useState, useCallback, memo } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "Resume Analysis | RESUMAI" },
  { name: "description", content: "Detailed analysis of your resume" },
];

interface ResumeData {
  id: string;
  resumePath: string;
  imagePath: string;
  companyName?: string;
  jobTitle?: string;
  jobDescription?: string;
  feedback: Feedback | null;
  createdAt?: string;
}

const SkeletonLine = ({ className = "" }: { className?: string }) => (
  <div className={`bg-slate-200 rounded animate-pulse ${className}`}></div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 bg-slate-200 rounded-xl animate-pulse"></div>
      <div className="flex-1 space-y-2">
        <SkeletonLine className="h-5 w-32" />
        <SkeletonLine className="h-4 w-24" />
      </div>
    </div>
    <SkeletonLine className="h-4 w-full" />
    <SkeletonLine className="h-4 w-3/4" />
  </div>
);

const Resume = () => {
  const fs = usePuterStore((state) => state.fs);
  const kv = usePuterStore((state) => state.kv);
  const auth = usePuterStore((state) => state.auth);
  const isLoading = usePuterStore((state) => state.isLoading);
  const isAuthenticated = auth.isAuthenticated;
  const { id } = useParams();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loadingState, setLoadingState] = useState<"loading" | "loaded" | "error">("loading");
  const [retryCount, setRetryCount] = useState(0);

  const loadResume = useCallback(async () => {
    if (!id) return;

    try {
      setLoadingState("loading");
      const resume = await kv.get(`resume:${id}`);
      
      if (!resume) {
        setLoadingState("error");
        return;
      }

      const data: ResumeData = JSON.parse(resume);
      setResumeData(data);

      if (data.feedback && typeof data.feedback === "object" && data.feedback.overallScore !== undefined) {
        setFeedback(data.feedback);
      }

      if (data.resumePath) {
        const resumeBlob = await fs.read(data.resumePath);
        if (resumeBlob) {
          const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
          setResumeUrl(URL.createObjectURL(pdfBlob));
        }
      }

      if (data.imagePath) {
        const imageBlob = await fs.read(data.imagePath);
        if (imageBlob) {
          setImageUrl(URL.createObjectURL(imageBlob));
        }
      }

      setLoadingState("loaded");
    } catch (err) {
      console.error("Error loading resume:", err);
      setLoadingState("error");
    }
  }, [id, kv, fs]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [isLoading, isAuthenticated, navigate, id]);

  useEffect(() => {
    if (isAuthenticated && id) {
      loadResume();
    }
  }, [isAuthenticated, id, loadResume]);

  useEffect(() => {
    if (loadingState === "loaded" && resumeData && !feedback && retryCount < 5) {
      const timer = setTimeout(async () => {
        const resume = await kv.get(`resume:${id}`);
        if (resume) {
          const data = JSON.parse(resume);
          if (data.feedback && typeof data.feedback === "object" && data.feedback.overallScore !== undefined) {
            setFeedback(data.feedback);
          } else {
            setRetryCount((prev) => prev + 1);
          }
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loadingState, resumeData, feedback, retryCount, id, kv]);

  const handleRefresh = () => {
    setRetryCount(0);
    loadResume();
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              RESUMAI
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {resumeData && (
              <div className="hidden md:flex items-center gap-3">
                {resumeData.companyName && (
                  <span className="text-sm text-slate-500">{resumeData.companyName}</span>
                )}
                {resumeData.jobTitle && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="text-sm text-slate-500">{resumeData.jobTitle}</span>
                  </>
                )}
              </div>
            )}
          </div>

          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New
          </Link>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        <section className="lg:w-1/2 bg-gradient-to-b from-slate-50 to-white border-b lg:border-b-0 lg:border-r border-slate-200 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] flex flex-col">
          <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900">Resume Preview</h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">Your uploaded document</p>
                </div>
              </div>
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="hidden sm:inline">Download</span>
                </a>
              )}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-3 sm:p-6">
            {loadingState === "loading" ? (
              <div className="w-full max-w-xs sm:max-w-md bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-3 sm:p-4 animate-pulse">
                <div className="aspect-[3/4] bg-slate-100 rounded-lg sm:rounded-xl"></div>
              </div>
            ) : imageUrl ? (
              <div className="w-full max-w-xs sm:max-w-md bg-white rounded-xl sm:rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-2 sm:p-4 hover:shadow-2xl transition-shadow duration-300">
                <div className="relative aspect-[3/4] rounded-lg sm:rounded-xl overflow-hidden bg-slate-50 ring-1 ring-slate-200/50">
                  <img
                    src={imageUrl}
                    alt="Resume preview"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
                </div>
                <div className="mt-2 sm:mt-3 flex items-center justify-center gap-2 text-[10px] sm:text-xs text-slate-400">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Scroll to view all pages
                </div>
              </div>
            ) : (
              <div className="w-full max-w-xs sm:max-w-md bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Preview not available</h4>
                <p className="text-xs sm:text-sm text-slate-500">The resume preview could not be generated.</p>
              </div>
            )}
          </div>
        </section>

        <section className="lg:w-1/2 p-4 sm:p-6 lg:p-10 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Resume Analysis</h1>
              <p className="text-xs sm:text-sm text-slate-500">
                AI-powered feedback to help you improve your resume
              </p>
            </div>

            {loadingState === "loading" && !feedback && (
              <div className="space-y-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            )}

            {loadingState === "error" && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-red-100 p-6 sm:p-8">
                <div className="text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                    Failed to Load
                  </h3>
                  <p className="text-slate-500 mb-4 text-sm">
                    Could not load resume analysis data.
                  </p>
                  <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {feedback && (
              <div className="space-y-4 sm:space-y-6">
                <Summary feedback={feedback} />
                <ATS
                  score={feedback.ATS?.score || 0}
                  suggestions={feedback.ATS?.tips || []}
                />
                <Details feedback={feedback} />
              </div>
            )}

            {loadingState === "loaded" && !feedback && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
                <div className="text-center py-6 sm:py-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                    Analysis in Progress
                  </h3>
                  <p className="text-slate-500 mb-4 text-sm">
                    Your resume is being analyzed. This may take a few moments.
                  </p>
                  <button
                    onClick={handleRefresh}
                    className="cursor-pointer px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Resume;
