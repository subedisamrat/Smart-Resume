import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link } from "react-router";
import { useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RESUMAI - AI Resume Analysis" },
    { name: "description", content: "Get AI-powered feedback on your resume and improve your job applications" },
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

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

const AnimatedCard = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: delay * 0.1, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const EmptyState = ({ isLoggedIn }: { isLoggedIn: boolean }) => (
  <section className="max-w-4xl mx-auto px-3 sm:px-4 py-10 sm:py-16">
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div 
        className="relative mx-auto mb-5 sm:mb-8"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl sm:rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 cursor-pointer text-sm sm:text-base"
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
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: delay * 0.1, ease: "easeOut" }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-indigo-100 cursor-pointer"
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg shadow-indigo-200">
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
        <section className="max-w-6xl mx-auto px-4 py-10">
          <div className="mb-8">
            <div className="h-8 bg-slate-200 rounded-lg w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-slate-100 rounded w-32 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-slate-200 rounded w-32"></div>
                    <div className="h-4 bg-slate-100 rounded w-24"></div>
                  </div>
                  <div className="w-[80px] h-[80px] bg-slate-100 rounded-full"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 bg-slate-100 rounded-full w-16"></div>
                  <div className="h-6 bg-slate-100 rounded-full w-16"></div>
                </div>
              </div>
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
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="h-10 bg-slate-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-5 bg-slate-100 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </section>
      ) : showLandingPage ? (
        <>
          <AnimatedSection className="max-w-6xl mx-auto px-4 pt-12 sm:pt-20 pb-8 sm:pb-12">
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI-Powered Resume Analysis
              </motion.div>
              
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                Land Your Dream Job with{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Smart Feedback
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 sm:mb-10 leading-relaxed px-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Upload your resume and get instant AI-powered analysis with actionable insights to improve your chances of getting hired.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/upload"
                  className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 cursor-pointer"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="text-base sm:text-lg">Analyze Your Resume</span>
                </Link>
              </motion.div>
            </div>
          </AnimatedSection>

          <AnimatedSection className="max-w-6xl mx-auto px-4 py-10 sm:py-20">
            <motion.div 
              className="text-center mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
                How It Works
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
                Get professional resume feedback in three simple steps
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {[
                { num: "1", title: "Upload Resume", desc: "Simply drag and drop your PDF resume or click to upload", color: "indigo" },
                { num: "2", title: "Add Job Details", desc: "Enter the job title and description you're targeting", color: "purple" },
                { num: "3", title: "Get Insights", desc: "Receive detailed feedback and actionable recommendations", color: "green" },
              ].map((item, index) => (
                <AnimatedCard key={item.num} delay={index}>
                  <motion.div 
                    className="text-center p-4 sm:p-0"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-${item.color}-100 rounded-2xl flex items-center justify-center`}>
                      <span className={`text-xl sm:text-2xl font-bold text-${item.color}-600`}>{item.num}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </motion.div>
                </AnimatedCard>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className="max-w-6xl mx-auto px-4 py-10 sm:py-20">
            <motion.div 
              className="text-center mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
                Key Features
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
                Everything you need to improve your resume
              </p>
            </motion.div>

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
          </AnimatedSection>

          <AnimatedSection className="max-w-6xl mx-auto px-4 py-10 sm:py-20">
            <motion.div 
              className="bg-indigo-600 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center text-white shadow-xl shadow-indigo-500/30"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.h2 
                className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Ready to Improve Your Resume?
              </motion.h2>
              <motion.p 
                className="text-indigo-100 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Join thousands of job seekers who have improved their resumes and landed their dream jobs.
              </motion.p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  to="/upload"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all shadow-xl cursor-pointer w-full sm:w-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Get Started Free
                </Link>
              </motion.div>
            </motion.div>
          </AnimatedSection>

          <footer className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
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
