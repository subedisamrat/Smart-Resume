import { useCallback, memo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "~/lib/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = memo(({ onFileSelect }: FileUploaderProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setErrorMessage(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors) {
          for (const error of rejection.errors) {
            if (error.code === "file-invalid-type") {
              setErrorMessage("Only PDF files are accepted. Please upload a PDF file.");
            } else if (error.code === "file-too-large") {
              setErrorMessage(`File is too large. Maximum size is ${formatSize(10 * 1024 * 1024)}.`);
            } else if (error.code === "file-too-small") {
              setErrorMessage("File is too small.");
            } else {
              setErrorMessage(error.message || "Invalid file. Please try again.");
            }
          }
        } else {
          setErrorMessage("Invalid file type. Only PDF files are accepted.");
        }
        return;
      }

      const file = acceptedFiles[0] || null;
      onFileSelect?.(file);
    },
    [onFileSelect],
  );

  const maxFileSize = 10 * 1024 * 1024;
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { "application/pdf": [".pdf"] },
      maxSize: maxFileSize,
      minSize: 1000,
    });

  const file = acceptedFiles[0] || null;

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? "border-indigo-500 bg-indigo-50" 
            : file 
              ? "border-green-300 bg-green-50" 
              : errorMessage
                ? "border-red-300 bg-red-50"
                : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
          }
        `}
      >
        <input {...getInputProps()} />

        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-800 truncate max-w-[200px]">{file.name}</p>
                <p className="text-sm text-slate-500">{formatSize(file.size)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect?.(null);
                setErrorMessage(null);
              }}
              className="p-2 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors ${
              isDragActive ? "bg-indigo-100" : "bg-slate-100"
            }`}>
              <svg className={`w-8 h-8 ${isDragActive ? "text-indigo-500" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-slate-700 font-medium">
                {isDragActive ? "Drop your resume here" : "Click to upload or drag and drop"}
              </p>
              <p className="text-sm text-slate-500 mt-1">PDF file only, max {formatSize(maxFileSize)}</p>
            </div>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}
    </div>
  );
});

FileUploader.displayName = "FileUploader";

export default FileUploader;
