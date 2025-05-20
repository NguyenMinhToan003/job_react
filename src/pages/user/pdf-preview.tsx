import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils"; // Nếu dùng ShadCN utils

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function PDFViewer() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(600);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setPageNumber(1);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };



  return (
    <Card className="w-full max-w-7xl mx-auto p-4 space-y-4 shadow-md border">
      {/* File input */}
      <div className="flex items-center justify-between">
        <Input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="max-w-sm"
        />
        <span className="text-sm text-muted-foreground">
          {file ? file.name : 'Chọn file PDF để xem'}
        </span>
      </div>

      {/* Viewer */}
      {file ? (
        <div className="flex gap-4" >
          {/* Main PDF page */}
          <div className="flex-1 border rounded-md bg-white p-2 overflow-auto max-h-[80vh]">
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
              <Page
                pageNumber={pageNumber}
                width={containerWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </div>

          {/* Sidebar thumbnails */}
          <ScrollArea className="w-[180px] max-h-[80vh] border rounded-md p-2">
            <Document file={file}>
              {Array.from(new Array(numPages), (_, index) => (
                <div
                  key={`thumb_${index + 1}`}
                  className={cn(
                    "cursor-pointer mb-2 rounded-sm overflow-hidden border transition",
                    pageNumber === index + 1
                      ? "border-blue-500 ring-2 ring-blue-500"
                      : "hover:border-gray-400"
                  )}
                  onClick={() => setPageNumber(index + 1)}
                >
                  <Page
                    pageNumber={index + 1}
                    width={150}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </div>
              ))}
            </Document>
          </ScrollArea>
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          Chưa có file nào được chọn.
        </p>
      )}
    </Card>
  );
}
