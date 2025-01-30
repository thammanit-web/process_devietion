'use client';
import { useState } from 'react';
import axios from 'axios'; 

const TroubleshootSolutionForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [solutionId, setSolutionId] = useState<number | string>('');
  const [resultTroubleshoot, setResultTroubleshoot] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !solutionId || !resultTroubleshoot || !finishDate) {
      setErrorMessage('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('solution_id', String(solutionId));
    formData.append('result_troubleshoot', resultTroubleshoot);
    formData.append('finish_date', finishDate);

    try {
      const response = await axios.post('/api/troubleshoot_solution', formData);

      if (response.status === 200) {
        setSuccessMessage('File uploaded successfully!');
        setErrorMessage(null);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error uploading file. Please try again.');
      setSuccessMessage(null);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Upload Troubleshoot Solution</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="text-red-500 text-sm">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-500 text-sm">{successMessage}</div>
        )}

        <div>
          <label className="block text-sm font-semibold mb-2">Solution ID</label>
          <input
            type="number"
            value={solutionId}
            onChange={(e) => setSolutionId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Result Troubleshoot</label>
          <textarea
            value={resultTroubleshoot}
            onChange={(e) => setResultTroubleshoot(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Finish Date</label>
          <input
            type="date"
            value={finishDate}
            onChange={(e) => setFinishDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Upload File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default TroubleshootSolutionForm;
