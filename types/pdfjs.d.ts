declare module 'pdfjs-dist/build/pdf.mjs' {
  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
  }

  export interface PDFPageProxy {
    getViewport(params: { scale: number }): { width: number; height: number };
    render(params: { canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number } }): { promise: Promise<void> };
  }

  export interface PDFDocumentLoadingTask {
    promise: Promise<PDFDocumentProxy>;
  }

  export interface GlobalWorkerOptions {
    workerSrc: string;
  }

  export const getDocument: (params: { data: ArrayBuffer }) => PDFDocumentLoadingTask;
  export const GlobalWorkerOptions: GlobalWorkerOptions;
}
