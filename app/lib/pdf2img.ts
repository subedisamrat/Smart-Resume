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

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const lib = await import("pdfjs-dist/build/pdf.mjs");
      try {
        lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      } catch (workerError) {
        console.warn("Worker setup warning:", workerError);
      }
      pdfjsLib = lib;
      return lib;
    } catch (error) {
      console.error("Failed to load PDF.js:", error);
      throw error;
    }
  })();

  return loadPromise;
}

async function readFileArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as ArrayBuffer);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

export async function convertPdfToImage(
  file: File,
  scale: number = 1.5,
): Promise<PdfConversionResult> {
  try {
    const lib = await loadPdfJs();

    let arrayBuffer: ArrayBuffer;
    try {
      arrayBuffer = await readFileArrayBuffer(file);
    } catch (readError) {
      return {
        imageUrl: "",
        file: null,
        error: "Failed to read the file. Please try selecting it again.",
      };
    }

    const loadingTask = lib.getDocument({ data: new Uint8Array(arrayBuffer) });
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
              error: "Failed to create preview image from PDF.",
            });
          }
        },
        "image/jpeg",
        0.9,
      );
    });
  } catch (err) {
    console.error("PDF conversion error:", err);
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("Invalid PDF")) {
      return {
        imageUrl: "",
        file: null,
        error: "The file appears to be corrupted or is not a valid PDF.",
      };
    }
    if (message.includes("password")) {
      return {
        imageUrl: "",
        file: null,
        error: "This PDF is password-protected. Please use an unprotected PDF.",
      };
    }
    return {
      imageUrl: "",
      file: null,
      error: "Unable to process this PDF. Please try a different file.",
    };
  }
}

export async function extractPdfText(file: File): Promise<PdfTextResult> {
  try {
    const lib = await loadPdfJs();

    let arrayBuffer: ArrayBuffer;
    try {
      arrayBuffer = await readFileArrayBuffer(file);
    } catch (readError) {
      return {
        text: "",
        error: "Failed to read the file for text extraction.",
      };
    }

    const loadingTask = lib.getDocument({ data: new Uint8Array(arrayBuffer) });
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

    return { text: fullText.trim() };
  } catch (err) {
    console.error("PDF text extraction error:", err);
    return {
      text: "",
      error: "Failed to extract text from this PDF.",
    };
  }
}
