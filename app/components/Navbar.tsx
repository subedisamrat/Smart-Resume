import { useState } from "react";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";
import Modal from "./Modal";

const Navbar = () => {
  const auth = usePuterStore((state) => state.auth);
  const isAuthenticated = auth.isAuthenticated;
  const user = auth.user;
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleSignOut = async () => {
    setShowSignOutModal(false);
    await auth.signOut();
    window.location.href = "/";
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-lg sm:text-xl font-bold text-indigo-600">
                RESUMAI
              </span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              {isAuthenticated && user ? (
                <>
                  <Link
                    to="/upload"
                    className="inline-flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="hidden sm:inline">New Analysis</span>
                    <span className="sm:hidden">New</span>
                  </Link>
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-xs sm:text-sm font-semibold text-indigo-600">
                        {user.username?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowSignOutModal(true)}
                      className="text-xs sm:text-sm text-slate-500 hover:text-red-600 transition-colors cursor-pointer hidden sm:inline"
                    >
                      Sign Out
                    </button>
                    <button
                      onClick={() => setShowSignOutModal(true)}
                      className="sm:hidden p-1.5 text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                      title="Sign Out"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Modal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleSignOut}
        title="Sign Out"
        message="Are you sure you want to sign out? You'll need to sign in again to access your resume analyses."
        confirmText="Sign Out"
        cancelText="Stay Signed In"
        variant="danger"
      />
    </>
  );
};

export default Navbar;
