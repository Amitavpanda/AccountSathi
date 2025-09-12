declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: { scale?: number; logging?: boolean; dpi?: number; letterRendering?: boolean };
    jsPDF?: { unit?: string; format?: string | [number, number]; orientation?: string };
    pagebreak?: { mode?: string | string[] };
  }

  interface Html2Pdf {
    set(options: Html2PdfOptions): Html2Pdf;
    from(element: HTMLElement): Html2Pdf;
    toPdf(): Html2Pdf;
    toImg(): Html2Pdf;
    toCanvas(): Html2Pdf;
    toBlob(): Html2Pdf;
    output(type: string): Promise<any>;
    outputPdf(type: string): Promise<any>;
    save(filename?: string): Promise<void>;
  }

  function html2pdf(): Html2Pdf;
  function html2pdf(element: HTMLElement, options?: Html2PdfOptions): Html2Pdf;

  export = html2pdf;
}
