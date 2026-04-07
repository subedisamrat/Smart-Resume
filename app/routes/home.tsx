import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link } from "react-router";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRef } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RESUMAI - AI Resume Analysis" },
    { name: "description", content: "Get AI-powered feedback on your resume and improve your job applications" },
  ];
}

const SkeletonCard = () => (
  <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 p-3 sm:p-5 animate-pulse">
    <div className="flex items-start justify-between mb-2 sm:mb-4">
      <div className="flex-1 space-y-2">
        <div className="h-4 sm:h-5 bg-slate-200 rounded w-24 sm:w-32"></div>
        <div className="h-3 sm:h-4 bg-slate-100 rounded w-16 sm:w-24"></div>
      </div>
      <div className="w-14 h-14 sm:w-[80px] sm:h-[80px] bg-slate-200 rounded-full"></div>
    </div>
    <div className="flex gap-2">
      <div className="h-5 sm:h-6 bg-slate-100 rounded-full w-12 sm:w-16"></div>
      <div className="h-5 sm:h-6 bg-slate-100 rounded-full w-12 sm:w-16"></div>
    </div>
  </div>
);

const FadeInSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const EmptyState = ({ isLoggedIn }: { isLoggedIn: boolean }) => (
  <section className="max-w-4xl mx-auto px-3 sm:px-4 py-10 sm:py-16">
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div 
        className="relative mx-auto mb-5 sm:mb-8"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-indigo-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </motion.div>
      
      <motion.h2 
        className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-2 sm:mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {isLoggedIn ? "No Resumes Analyzed Yet" : "Start Your Journey"}
      </motion.h2>
      
      <motion.p 
        className="text-slate-500 mb-6 sm:mb-8 md:mb-10 max-w-md sm:max-w-lg mx-auto text-xs sm:text-sm md:text-base px-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {isLoggedIn 
          ? "Upload your first resume to get AI-powered insights and improve your chances of landing your dream job."
          : "Upload your resume and get instant AI-powered analysis with actionable insights to land your dream job."
        }
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Link
          to="/upload"
          className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 text-white font-semibold rounded-xl sm:rounded-2xl hover:bg-indigo-700 transition-all duration-300 shadow-xl shadow-indigo-200 cursor-pointer text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Analyze Your Resume
        </Link>
      </motion.div>
      
      {isLoggedIn && (
        <motion.div 
          className="mt-6 sm:mt-10 p-3 sm:p-5 bg-white rounded-xl sm:rounded-2xl max-w-sm sm:max-w-md mx-auto shadow-sm border border-slate-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex items-start gap-2.5 sm:gap-4 text-left">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-indigo-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-slate-900 text-xs sm:text-sm mb-0.5 sm:mb-1">Pro Tip</p>
              <p className="text-slate-500 text-xs">Upload a job description along with your resume for more personalized feedback.</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  </section>
);

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-30px" }}
      transition={{ duration: 0.5, delay: delay * 0.1, ease: "easeOut" }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-indigo-100 cursor-pointer"
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-md">
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1 sm:mb-2">{title}</h3>
      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default function Home() {
  const kv = usePuterStore((state) => state.kv);
  const auth = usePuterStore((state) => state.auth);
  const isLoading = usePuterStore((state) => state.isLoading);
  const isAuthenticated = auth.isAuthenticated;

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
    if (isAuthenticated || !isLoading) {
      loadResumes();
    }
  }, [isAuthenticated, isLoading, loadResumes]);

  const showLandingPage = !isLoading && !isAuthenticated;
  const showEmptyDashboard = !isLoading && isAuthenticated && resumes.length === 0;
  const showDashboard = !isLoading && isAuthenticated && resumes.length > 0;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
        <Navbar />
        <section className="max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-10">
          <div className="mb-6 sm:mb-8">
            <div className="h-6 sm:h-8 bg-slate-200 rounded-lg w-40 sm:w-48 mb-2 animate-pulse"></div>
            <div className="h-3 sm:h-4 bg-slate-100 rounded w-24 sm:w-32 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      <Navbar />

      {loadingResumes && isAuthenticated ? (
        <section className="max-w-6xl mx-auto px-3 sm:px-4 py-12 sm:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <div className="h-8 sm:h-10 bg-slate-200 rounded-lg w-48 sm:w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 sm:h-5 bg-slate-100 rounded w-64 sm:w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </section>
      ) : showLandingPage ? (
        <>
          <section className="max-w-6xl mx-auto px-3 sm:px-4 pt-10 sm:pt-16 pb-6 sm:pb-12">
            <motion.div 
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-100 text-indigo-700 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI-Powered Resume Analysis
              </motion.div>
              
              <motion.h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 md:mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Land Your Dream Job with{" "}
                <span className="text-indigo-600">Smart Feedback</span>
              </motion.h1>
              
              <motion.p 
                className="text-slate-500 mb-6 sm:mb-8 md:mb-10 max-w-xl mx-auto text-xs sm:text-sm md:text-lg px-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Upload your resume and get instant AI-powered analysis with actionable insights to improve your chances of getting hired.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Link
                  to="/upload"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-indigo-600 text-white font-semibold rounded-xl sm:rounded-2xl hover:bg-indigo-700 transition-all duration-300 shadow-xl cursor-pointer text-sm sm:text-base md:text-lg"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Analyze Your Resume
                </Link>
              </motion.div>
            </motion.div>
          </section>

          <section className="max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16">
            <FadeInSection>
              <div className="text-center mb-6 sm:mb-8 md:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 md:mb-4">
                  How It Works
                </h2>
                <p className="text-slate-500 max-w-xl mx-auto text-xs sm:text-sm md:text-base">
                  Get professional resume feedback in three simple steps
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                {[
                  { num: "1", title: "Upload Resume", desc: "Simply drag and drop your PDF resume or click to upload", color: "bg-indigo-100", textColor: "text-indigo-600" },
                  { num: "2", title: "Add Job Details", desc: "Enter the job title and description you're targeting", color: "bg-purple-100", textColor: "text-purple-600" },
                  { num: "3", title: "Get Insights", desc: "Receive detailed feedback and actionable recommendations", color: "bg-green-100", textColor: "text-green-600" },
                ].map((item, index) => (
                  <motion.div 
                    key={item.num}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-30px" }}
                    transition={{ delay: index * 0.15, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 sm:p-0"
                  >
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 ${item.color} rounded-2xl flex items-center justify-center`}>
                      <span className={`text-xl sm:text-2xl font-bold ${item.textColor}`}>{item.num}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-xs sm:text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </FadeInSection>
          </section>

          <section className="max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16">
            <FadeInSection>
              <div className="text-center mb-6 sm:mb-8 md:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 md:mb-4">
                  Key Features
                </h2>
                <p className="text-slate-500 max-w-xl mx-auto text-xs sm:text-sm md:text-base">
                  Everything you need to improve your resume
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <FeatureCard
                  icon={
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  }
                  title="ATS Scoring"
                  description="Get accurate ATS compatibility scores to ensure your resume passes automated screening systems"
                  delay={0}
                />
                <FeatureCard
                  icon={
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  title="Detailed Analysis"
                  description="Receive comprehensive feedback on tone, content, structure, and skills alignment"
                  delay={1}
                />
                <FeatureCard
                  icon={
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  }
                  title="Actionable Tips"
                  description="Get specific, actionable recommendations to improve your resume's effectiveness"
                  delay={2}
                />
                <FeatureCard
                  icon={
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  title="Instant Results"
                  description="Get detailed feedback within seconds, no more waiting for recruiter responses"
                  delay={3}
                />
                <FeatureCard
                  icon={
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                  title="Track History"
                  description="Keep track of all your resume analyses and monitor your improvement over time"
                  delay={4}
                />
                <FeatureCard
                  icon={
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                  title="Secure & Private"
                  description="Your resumes are stored securely and only accessible by you"
                  delay={5}
                />
              </div>
            </FadeInSection>
          </section>

          <section className="max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16">
            <FadeInSection>
              <div className="bg-indigo-600 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 text-center text-white shadow-xl">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
                  Ready to Improve Your Resume?
                </h2>
                <p className="text-indigo-200 mb-5 sm:mb-6 md:mb-8 max-w-xl mx-auto text-xs sm:text-sm md:text-base">
                  Join thousands of job seekers who have improved their resumes and landed their dream jobs.
                </p>
                <Link
                  to="/upload"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all shadow-lg cursor-pointer text-xs sm:text-sm md:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Get Started Free
                </Link>
              </div>
            </FadeInSection>
          </section>

          <footer className="max-w-6xl mx-auto px-3 sm:px-4 py-5 sm:py-6 md:py-8">
            <div className="text-center">
              <p className="text-slate-400 text-xs sm:text-sm">
                © 2026 RESUMAI. All rights reserved.
              </p>
            </div>
          </footer>
        </>
      ) : showEmptyDashboard ? (
        <EmptyState isLoggedIn={true} />
      ) : (
        <section className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
          <motion.div 
            className="mb-5 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-0.5 sm:mb-1">Your Dashboard</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {resumes.length} resume{resumes.length !== 1 ? "s" : ""} analyzed
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {resumes.map((resume, index) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <ResumeCard resume={resume} />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
