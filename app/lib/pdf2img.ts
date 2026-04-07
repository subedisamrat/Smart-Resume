export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

export interface PdfTextResult {
  text: string;
  error?: string;
}

let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;
let workerInitFailed = false;

async function loadPdfJs(): Promise<any> {
  if (workerInitFailed) {
    throw new Error("PDF worker initialization failed");
  }
  
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const lib = await import("pdfjs-dist/build/pdf.mjs");
      
      try {
        lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      } catch (workerError) {
        console.warn("Worker initialization warning:", workerError);
      }
      
      pdfjsLib = lib;
      return lib;
    } catch (error) {
      console.error("Failed to load PDF.js library:", error);
      workerInitFailed = true;
      throw error;
    }
  })();

  return loadPromise;
}

async function extractTextFallback(file: File): Promise<PdfTextResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const text = content
          .replace(/[^\x20-\x7E\n]/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        resolve({ text: text.length > 50 ? text : "" });
      } catch {
        resolve({ text: "" });
      }
    };
    reader.onerror = () => resolve({ text: "" });
    reader.readAsText(file);
  });
}

export async function convertPdfToImage(
  file: File,
  scale: number = 1.5,
): Promise<PdfConversionResult> {
  try {
    const lib = await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = lib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale });
    const canvas = window.document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    if (context) {
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
    }

    const renderTask = page.render({
      canvasContext: context,
      viewport: viewport,
    });

    await renderTask.promise;

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File([blob], `${originalName}.jpg`, {
              type: "image/jpeg",
            });

            resolve({
              imageUrl: URL.createObjectURL(blob),
              file: imageFile,
            });
          } else {
            resolve({
              imageUrl: "",
              file: null,
              error: "Failed to create image blob",
            });
          }
        },
        "image/jpeg",
        0.9,
      );
    });
  } catch (err) {
    console.error("PDF conversion error:", err);
    return {
      imageUrl: "",
      file: null,
      error: `Unable to process PDF. Please ensure it's a valid PDF document.`,
    };
  }
}

export async function extractPdfText(file: File): Promise<PdfTextResult> {
  try {
    const lib = await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = lib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = "";

    for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str || "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      fullText += pageText + "\n\n";
    }

    if (!fullText.trim()) {
      return extractTextFallback(file);
    }

    return { text: fullText.trim() };
  } catch (err) {
    console.error("PDF text extraction error:", err);
    return extractTextFallback(file);
  }
}
