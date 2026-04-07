import { prepareInstructions } from "../../constants/index";
import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage, extractPdfText } from "../lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

type StepStatus = "pending" | "processing" | "complete" | "error";

interface ProcessingStep {
  id: string;
  label: string;
  subLabel?: string;
  status: StepStatus;
}

const Upload = () => {
  const fs = usePuterStore((state) => state.fs);
  const ai = usePuterStore((state) => state.ai);
  const kv = usePuterStore((state) => state.kv);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: "upload", label: "Uploading resume", status: "pending" },
    { id: "convert", label: "Processing preview", status: "pending" },
    { id: "upload-image", label: "Preparing preview", status: "pending" },
    { id: "extract-text", label: "Extracting text", status: "pending" },
    { id: "analyze", label: "AI Analysis", subLabel: "Starting analysis...", status: "pending" },
  ]);

  const analysisPhaseRef = useRef(0);
  const analysisPhases = [
    "Reading resume content...",
    "Analyzing tone and style...",
    "Evaluating content quality...",
    "Checking structure...",
    "Assessing skills alignment...",
    "Calculating ATS score...",
    "Generating recommendations...",
    "Finalizing analysis...",
  ];

  const updateStep = (id: string, status: StepStatus, subLabel?: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, status, ...(subLabel && { subLabel }) } : step
      )
    );
  };

  const resetSteps = () => {
    setSteps((prev) =>
      prev.map((step) => ({ ...step, status: "pending", subLabel: undefined }))
    );
    analysisPhaseRef.current = 0;
  };

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    setError(null);
  };

  const rotateAnalysisPhase = () => {
    analysisPhaseRef.current = (analysisPhaseRef.current + 1) % analysisPhases.length;
    return analysisPhases[analysisPhaseRef.current];
  };

  const handleAnalyse = async ({
    companyName,
    jobTitle,
    jobDescription,
    file: resumeFile,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);
    setError(null);
    resetSteps();

    let uuid = "";

    const handleError = (err: unknown, defaultMessage: string) => {
      console.error("Analysis error:", err);
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("withResolvers")) {
        setError("Unable to process this PDF file. Please try a different file or ensure it's a valid PDF document.");
      } else {
        setError(defaultMessage);
      }
      setIsProcessing(false);
    };

    try {
      updateStep("upload", "processing");
      
      let uploadedFile;
      try {
        uploadedFile = await fs.upload([resumeFile]);
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
        updateStep("upload", "error");
        handleError(uploadError, "Failed to upload resume. Please try again.");
        return;
      }
      
      if (!uploadedFile) {
        updateStep("upload", "error");
        setError("Failed to upload resume. Please try again.");
        setIsProcessing(false);
        return;
      }
      updateStep("upload", "complete");

      updateStep("convert", "processing");
      updateStep("extract-text", "processing");
      
      let imageFile;
      let textResult;
      
      try {
        [imageFile, textResult] = await Promise.all([
          convertPdfToImage(resumeFile, 1.5),
          extractPdfText(resumeFile),
        ]);
      } catch (conversionError) {
        console.error("PDF processing error:", conversionError);
        updateStep("convert", "error");
        updateStep("extract-text", "error");
        handleError(conversionError, "Failed to process resume. Please try a different file.");
        return;
      }

      if (textResult?.text) {
        updateStep("extract-text", "complete", `Extracted ${textResult.text.length} characters`);
      } else {
        updateStep("extract-text", "error", "Could not extract text from PDF");
        if (textResult?.error) {
          console.warn("Text extraction warning:", textResult.error);
        }
      }
      
      if (!imageFile?.file) {
        updateStep("convert", "error");
        const errorMsg = imageFile?.error || "Failed to process resume. Please try a different file.";
        setError(errorMsg);
        setIsProcessing(false);
        return;
      }
      updateStep("convert", "complete");

      updateStep("upload-image", "processing");
      let uploadedImage;
      try {
        uploadedImage = await fs.upload([imageFile.file]);
      } catch (imageUploadError) {
        console.error("Image upload error:", imageUploadError);
        updateStep("upload-image", "error");
        handleError(imageUploadError, "Failed to prepare preview. Please try again.");
        return;
      }
      
      if (!uploadedImage) {
        updateStep("upload-image", "error");
        setError("Failed to prepare preview. Please try again.");
        setIsProcessing(false);
        return;
      }
      updateStep("upload-image", "complete");

      uuid = generateUUID();
      const data = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: null,
        createdAt: new Date().toISOString(),
      };

      try {
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
      } catch (kvError) {
        console.error("KV set error:", kvError);
      }

      updateStep("analyze", "processing", rotateAnalysisPhase());

      const resumeText = textResult.text || "[Could not extract text from resume. Please review manually.]";
      
      const phaseInterval = setInterval(() => {
        updateStep("analyze", "processing", rotateAnalysisPhase());
      }, 3000);

      let feedback;
      try {
        feedback = await ai.analyzeResume(
          resumeText,
          prepareInstructions({
            jobTitle,
            jobDescription,
          }),
        );
      } catch (aiError) {
        clearInterval(phaseInterval);
        console.error("AI Analysis Error:", aiError);
        updateStep("analyze", "error");
        handleError(aiError, "AI analysis failed. Please try again.");
        return;
      }

      clearInterval(phaseInterval);

      if (!feedback) {
        updateStep("analyze", "error");
        setError("Analysis failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      let feedbackContent = feedback.message?.content;
      if (Array.isArray(feedbackContent)) {
        feedbackContent = feedbackContent[0]?.text || "";
      }
      if (typeof feedbackContent !== "string") {
        feedbackContent = JSON.stringify(feedbackContent);
      }

      let parsedFeedback;
      try {
        parsedFeedback = JSON.parse(feedbackContent);
      } catch {
        parsedFeedback = { 
          overallScore: 50,
          error: "Could not parse AI response",
          rawResponse: feedbackContent,
          ATS: { score: 50, tips: [] },
          toneAndStyle: { score: 50, tips: [] },
          content: { score: 50, tips: [] },
          structure: { score: 50, tips: [] },
          skills: { score: 50, tips: [] },
        };
      }

      data.feedback = parsedFeedback;
      try {
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
      } catch (kvError) {
        console.error("KV update error:", kvError);
      }
      updateStep("analyze", "complete", "Analysis complete!");

      setTimeout(() => {
        navigate(`/resume/${uuid}`);
      }, 500);
    } catch (err) {
      handleError(err, "Something went wrong. Please try again.");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form) return;

    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) {
      setError("Please upload a resume first.");
      return;
    }
    handleAnalyse({ companyName, jobTitle, jobDescription, file });
  };

  const currentAnalyzeStep = steps.find((s) => s.id === "analyze");
  const isAnalyzing = currentAnalyzeStep?.status === "processing";

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-600 mb-4">
            Get Smart Feedback
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
            Upload your resume and job description to get AI-powered insights and improve your chances of landing your dream job.
          </p>
        </div>

        {isProcessing ? (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-lg mx-auto">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-14 h-14 sm:w-16 sm:h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-semibold text-center text-slate-800 mb-6 sm:mb-8">
              Analyzing Your Resume
            </h2>

            <div className="space-y-1">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col">
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                      {step.status === "pending" && (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200"></div>
                      )}
                      {step.status === "processing" && (
                        <div className="w-5 h-5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></div>
                      )}
                      {step.status === "complete" && (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      {step.status === "error" && (
                        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm ${
                        step.status === "pending" ? "text-slate-400" :
                        step.status === "processing" ? "text-indigo-600 font-medium" :
                        step.status === "complete" ? "text-green-600" :
                        "text-red-500"
                      }`}>
                        {step.label}
                      </span>
                      {step.subLabel && step.status === "processing" && (
                        <p className="text-xs text-indigo-400 mt-0.5 animate-pulse">
                          {step.subLabel}
                        </p>
                      )}
                      {step.subLabel && step.status === "complete" && (
                        <p className="text-xs text-green-500 mt-0.5">
                          {step.subLabel}
                        </p>
                      )}
                      {step.subLabel && step.status === "error" && (
                        <p className="text-xs text-red-500 mt-0.5">
                          {step.subLabel}
                        </p>
                      )}
                    </div>
                  </div>
                  {step.id !== "analyze" && step.status !== "pending" && (
                    <div className="ml-11 h-px bg-slate-100"></div>
                  )}
                </div>
              ))}
            </div>

            {isAnalyzing && (
              <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  <span className="text-sm text-indigo-600 ml-2">
                    AI is analyzing your resume. This may take a moment...
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-5 sm:space-y-6"
          >
            <div className="space-y-2">
              <label htmlFor="company-name" className="block text-sm font-medium text-slate-700">
                Target Company
              </label>
              <input
                type="text"
                name="company-name"
                placeholder="e.g., Google, Microsoft, Apple"
                id="company-name"
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="job-title" className="block text-sm font-medium text-slate-700">
                Job Title
              </label>
              <input
                type="text"
                name="job-title"
                placeholder="e.g., Frontend Developer"
                id="job-title"
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="job-description" className="block text-sm font-medium text-slate-700">
                Job Description
              </label>
              <textarea
                rows={4}
                name="job-description"
                placeholder="Paste the job description here for more accurate feedback..."
                id="job-description"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Upload Resume
              </label>
              <FileUploader onFileSelect={handleFileSelect} />
            </div>

            {error && (
              <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!file}
              className="w-full py-3 sm:py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 cursor-pointer text-sm sm:text-base"
            >
              {file ? "Analyze Resume" : "Upload a Resume to Continue"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
};

export default Upload;
