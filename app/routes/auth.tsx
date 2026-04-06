import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "Sign In | RESUMAI" },
  { name: "description", content: "Sign in to access your resume analysis dashboard" },
];

const Auth = () => {
  const { isLoading: storeLoading, auth } = usePuterStore();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const next = location.search.split("next=")[1] || "/";

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(next);
    }
  }, [auth.isAuthenticated, next, navigate]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await auth.signIn();
    } catch (error) {
      console.error("Sign in error:", error);
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningIn(true);
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningIn(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome to RESUMAI</h1>
            <p className="text-slate-500 mt-2 text-center">
              Sign in to analyze your resumes and get AI-powered feedback
            </p>
          </div>

          {storeLoading || isSigningIn ? (
            <div className="space-y-4">
              <div className="h-12 bg-slate-100 rounded-xl animate-pulse"></div>
              <p className="text-center text-slate-500 text-sm">Please wait...</p>
            </div>
          ) : auth.isAuthenticated ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">
                      {auth.user?.username?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{auth.user?.username}</p>
                    <p className="text-sm text-slate-500">Signed in</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full py-3 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleSignIn}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Sign In with Puter
              </button>
              <p className="text-xs text-slate-400 text-center">
                By signing in, you agree to our terms of service
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-slate-400 text-sm mt-6">
          Need help?{" "}
          <a href="#" className="text-indigo-600 hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </main>
  );
};

export default Auth;
