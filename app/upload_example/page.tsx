'use client';
import { useState, useEffect } from 'react';
import FileUploadPreview from '../components/File';

export default function FileManagement() {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState<File | null>(null);
  const [incidentReportId, setIncidentReportId] = useState('');
  const [fileId, setFileId] = useState('');
  const [fetchedFileUrl, setFetchedFileUrl] = useState<string | null>(null); 

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/upload_reference');
      const data = await res.json();
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const fetchFileById = async () => {
    if (!fileId) return;
    try {
      const res = await fetch(`/api/upload_reference/${fileId}`);
      const data = await res.json();
      console.log(data);
      setFetchedFileUrl(data.file_url); 
    } catch (error) {
      console.error('Error fetching file:', error);
    }
  };

  const uploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !incidentReportId) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('incidentReportId', incidentReportId);

    try {
      const res = await fetch('/api/upload_reference', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) fetchFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const deleteFile = async (id: number) => {
    try {
      const res = await fetch(`/api/upload_reference/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
     <FileUploadPreview />
      <h1 className="text-2xl font-bold mb-4">File Management</h1>
      <form onSubmit={uploadFile} className="mb-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Incident Report ID"
          value={incidentReportId}
          onChange={(e) => setIncidentReportId(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Upload</button>
      </form>

      <input
        type="text"
        placeholder="File ID"
        value={fileId}
        onChange={(e) => setFileId(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <button onClick={fetchFileById} className="bg-green-500 text-white px-4 py-2 mb-4">Get File</button>

      {fetchedFileUrl && (
        <div className="mb-4">
          <p>Fetched File URL: </p>
          <a href={fetchedFileUrl} target='_blank' className="text-blue-500 underline">{fetchedFileUrl.split('/').pop()?.split('-').slice(1).join('-') || ''}</a>
        </div>
      )}

      <ul>
        {files.map((file: any) => (
          <li key={file.id} className="border-b p-2 flex justify-between">
            <a href={file.file_url} target='_blank' className='text-blue-500 underline'>{file.file_url.split('/').pop()?.split('-').slice(1).join('-') || ''}</a>
            <button
              onClick={() => deleteFile(file.id)}
              className="bg-red-500 text-white px-4 py-1"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
