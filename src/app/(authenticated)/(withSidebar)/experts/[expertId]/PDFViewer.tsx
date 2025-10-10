"use client";

interface PDFViewerProps {
  fileUrl: string;
  type: 'resume' | 'id';
}

const PDFViewer = ({ fileUrl, type }: PDFViewerProps) => {
  return (
    <div className="w-full">
      <iframe
        src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
        width="50%"
        height="300px"
        className="w-full border-0"
        title={`${type} Preview`}
      >
        <p>Your browser does not support PDF preview.</p>
        <a
          href={fileUrl}
          className="text-blue-600 underline hover:text-blue-800"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download the PDF instead.
        </a>
      </iframe>
      <div className="text-center mt-3 text-sm text-gray-600">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          View full document in new tab
        </a>
      </div>
    </div>
  );
};

export default PDFViewer;