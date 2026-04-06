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
    const lib = await import("pdfjs-dist/build/pdf.mjs");
    lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    pdfjsLib = lib;
    return lib;
  })();

  return loadPromise;
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
      error: `Failed to convert PDF: ${err}`,
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

    return { text: fullText.trim() };
  } catch (err) {
    console.error("PDF text extraction error:", err);
    return {
      text: "",
      error: `Failed to extract text: ${err}`,
    };
  }
}
