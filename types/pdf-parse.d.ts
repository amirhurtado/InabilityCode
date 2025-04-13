declare module "pdf-parse" {
    interface PDFExtractResult {
      numpages: number;
      numrender: number;
      info: {
        Title?: string;
        Author?: string;
        Subject?: string;
        Keywords?: string;
        Creator?: string;
        Producer?: string;
        CreationDate?: string;
        ModDate?: string;
      };
      metadata?: any;
      version: string;
      text: string;
    }
  
    function pdfParse(buffer: Buffer): Promise<PDFExtractResult>;
  
    export = pdfParse;
  }
  