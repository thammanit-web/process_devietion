'use client';

import { useState } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [incidentReportId, setIncidentReportId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !incidentReportId) return alert('Please select a file and enter a report ID.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('incidentReportId', incidentReportId);

    setIsUploading(true);

    const { uploadReferenceImage } = require('@/app/upload_example/upload_action');

    const result = await uploadReferenceImage(formData);

    if (result.success) {
      alert('File uploaded successfully!');
      setUploadedImageUrl(result.image.image_url); 
    } else {
      alert('Upload failed: ' + result.error);
    }

    setIsUploading(false);
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <input
          type="number"
          placeholder="Incident Report ID"
          value={incidentReportId}
          onChange={(e) => setIncidentReportId(e.target.value)}
        />
        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {uploadedImageUrl && (
        <div>
         <img src={uploadedImageUrl} alt="" />
        </div>
      )}
    </div>
  );
}

