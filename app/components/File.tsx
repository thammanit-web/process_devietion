import { useState, useEffect } from "react";

const acceptedFileTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "video/mp4",
];

const MultipleFileUploadWithPreview: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    if (files.length > 0) {
      const validFiles = files.filter((file) =>
        acceptedFileTypes.includes(file.type)
      );

      if (validFiles.length !== files.length) {
        setError("Some files have invalid types and were excluded.");
        setFiles(validFiles);
      } else {
        setError(null);
      }

      // Generate preview URLs for valid files
      const previewUrls = validFiles.map((file) => URL.createObjectURL(file));
      setPreviews(previewUrls);

      return () => {
        previewUrls.forEach((url) => URL.revokeObjectURL(url));
      };
    } else {
      setPreviews([]);
    }
  }, [files]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFiles = Array.from(e.target.files || []);
    
    if (selectedFiles.length > 0) {
      const newFiles = [...files, ...selectedFiles];
      const uniqueFiles = newFiles.filter(
        (file, index, self) =>
          index === self.findIndex((f) => f.name === file.name)
      );

      setFiles(uniqueFiles);
    }
  };

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  return (
    <div className="max-w-lg mx-auto p-6 border border-gray-300 rounded-lg shadow-md bg-white">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload files (JPEG, PNG, PDF, XLSX, MP4)
      </label>
      <input
        type="file"
        accept={acceptedFileTypes.join(", ")}
        multiple
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg file:bg-blue-50 file:text-blue-700 file:border-none file:px-4 file:py-2 file:rounded-lg hover:file:bg-blue-100 cursor-pointer"
      />

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <div className="mt-4 space-y-4">
        {files.map((file, index) => (
          <div
            key={index}
            className="border p-3 rounded-lg shadow-sm relative bg-gray-50 cursor-pointer hover:bg-gray-100"
            onClick={() => setSelectedFile(previews[index])}
          >
            <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>

            {file.type.startsWith("image/") && previews[index] && (
              <img
                src={previews[index]}
                alt="Preview"
                className="mt-2 rounded-md shadow-md max-w-full h-auto"
              />
            )}

            {file.type === "application/pdf" && previews[index] && (
              <p className="mt-2 text-sm text-gray-600">Click to preview PDF</p>
            )}

            {file.type === "video/mp4" && previews[index] && (
              <p className="mt-2 text-sm text-gray-600">Click to preview Video</p>
            )}

            {file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && (
              <p className="mt-2 text-gray-500 text-sm">
                Excel file selected: <strong>{file.name}</strong>
              </p>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(index);
              }}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full hover:bg-red-600"
            >
              X
            </button>
          </div>
        ))}
      </div>

      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative">
            <button
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-3 py-1 text-sm hover:bg-red-600"
              onClick={() => setSelectedFile(null)}
            >
              Close
            </button>

            {selectedFile.endsWith(".png") || selectedFile.endsWith(".jpeg") ? (
              <img src={selectedFile} alt="Preview" className="rounded-md w-full h-auto" />
            ) : selectedFile.endsWith(".mp4") ? (
              <video controls className="w-full rounded-md">
                <source src={selectedFile} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : selectedFile.endsWith(".pdf") ? (
              <embed src={selectedFile} type="application/pdf" className="w-full h-[600px]" />
            ) : (
              <p className="text-center text-gray-700">
                No preview available for this file type.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleFileUploadWithPreview;
