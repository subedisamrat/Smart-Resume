import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState, useCallback } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard | RESUMAI" },
    { name: "description", content: "AI-powered resume analysis to land your dream job" },
  ];
}

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-slate-200 rounded w-32"></div>
        <div className="h-4 bg-slate-100 rounded w-24"></div>
      </div>
      <div className="w-[80px] h-[80px] bg-slate-200 rounded-full"></div>
    </div>
    <div className="flex gap-2">
      <div className="h-6 bg-slate-100 rounded-full w-16"></div>
      <div className="h-6 bg-slate-100 rounded-full w-16"></div>
    </div>
  </div>
);

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  const loadResumes = useCallback(async () => {
    setLoadingResumes(true);
    try {
      const resumeList = await kv.list("resume:*", true);
      const parsedResumes = Array.isArray(resumeList)
        ? resumeList
            .map((item) => {
              if (typeof item === "string") {
                return JSON.parse(item) as Resume;
              }
              return JSON.parse(item.value) as Resume;
            })
            .sort((a, b) => {
              const dateA = new Date(a.createdAt || 0).getTime();
              const dateB = new Date(b.createdAt || 0).getTime();
              return dateB - dateA;
            })
        : [];
      setResumes(parsedResumes);
    } catch (error) {
      console.error("Error loading resumes:", error);
      setResumes([]);
    } finally {
      setLoadingResumes(false);
    }
  }, [kv]);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [auth.isAuthenticated, navigate]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      loadResumes();
    }
  }, [auth.isAuthenticated, loadResumes]);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Dashboard</h1>
          <p className="text-slate-500">
            Track and manage your resume analyses
          </p>
        </div>

        {loadingResumes ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="w-20 h-20 mx-auto mb-6 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              No Resumes Yet
            </h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Upload your first resume to get AI-powered feedback and improve your job applications.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload Your First Resume
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent Analyses
                </h2>
                <p className="text-sm text-slate-500">
                  {resumes.length} resume{resumes.length !== 1 ? "s" : ""} analyzed
                </p>
              </div>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 font-medium rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Analysis
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
