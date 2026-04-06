import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import Modal from "~/components/Modal";

const WipeApp = () => {
  const fs = usePuterStore((state) => state.fs);
  const kv = usePuterStore((state) => state.kv);
  const auth = usePuterStore((state) => state.auth);
  const isLoading = usePuterStore((state) => state.isLoading);
  const error = usePuterStore((state) => state.error);
  const clearError = usePuterStore((state) => state.clearError);
  const isAuthenticated = auth.isAuthenticated;
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);
  const [showWipeModal, setShowWipeModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const loadFiles = async () => {
    try {
      const fileList = (await fs.readDir("./")) as FSItem[];
      setFiles(fileList || []);
    } catch (err) {
      console.error("Error loading files:", err);
      setFiles([]);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      for (const file of files) {
        await fs.delete(file.path);
      }
      await kv.flush();
      await loadFiles();
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 3000);
    } catch (err) {
      console.error("Error deleting files:", err);
    } finally {
      setIsDeleting(false);
      setShowWipeModal(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
        <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  RESUMAI
                </span>
              </Link>
            </div>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 py-20 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-200 rounded-full mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-32"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
        <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  RESUMAI
                </span>
              </Link>
            </div>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-slate-500 mb-4">{error}</p>
            <button
              onClick={clearError}
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                RESUMAI
              </span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Developer Tools
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage App Data</h1>
          <p className="text-slate-500">
            View and manage all stored files and cached data. This section is for debugging purposes.
          </p>
        </div>

        {deleteSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-green-800">All data deleted successfully</p>
              <p className="text-sm text-green-600">Your stored files and cache have been cleared.</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Stored Files</h2>
                <p className="text-sm text-slate-500">{files.length} file{files.length !== 1 ? "s" : ""} in storage</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {files.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <p className="text-slate-500">No files stored yet</p>
              </div>
            ) : (
              files.map((file) => (
                <div key={file.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{file.name}</p>
                      <p className="text-sm text-slate-400">{file.path}</p>
                    </div>
                  </div>
                  <span className="text-sm text-slate-400">
                    {file.size ? `${(file.size / 1024).toFixed(1)} KB` : ""}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Delete All Data</h2>
              <p className="text-sm text-slate-500 mb-4">
                This will permanently delete all stored files and cached resume analyses. This action cannot be undone.
              </p>
              <button
                onClick={() => setShowWipeModal(true)}
                disabled={files.length === 0}
                className={`px-4 py-2 font-medium rounded-lg transition-colors cursor-pointer ${
                  files.length === 0
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}
              >
                Delete All Data
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-slate-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-slate-500">
              <p className="font-medium text-slate-700 mb-1">What's stored here?</p>
              <p>This section shows all raw files stored by the app, including uploaded PDF resumes and generated preview images. Your resume analyses (scores, feedback) are stored in the key-value database.</p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showWipeModal}
        onClose={() => setShowWipeModal(false)}
        onConfirm={handleDelete}
        title="Delete All Data?"
        message={`This will permanently delete ${files.length} file${files.length !== 1 ? "s" : ""} and all cached resume analyses. This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete Everything"}
        cancelText="Cancel"
        variant="danger"
      />
    </main>
  );
};

export default WipeApp;
