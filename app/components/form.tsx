"use client";

import { useState } from "react";

export const Form = () => {

  const handleFileUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const fileInput = document.querySelector<HTMLInputElement>('input[name="file"]');
    if (!fileInput || !fileInput.files?.length) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    Array.from(fileInput.files).forEach((file) => {
      formData.append("file", file);
    });

    try {
      const response = await fetch("/api/upload_reference", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        alert("Upload successful: " + result.name);
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during upload.");
    } finally {

    }
  };

  return (
    <div>
      <form>
        <input type="file" name="file" />
        <button onClick={handleFileUpload}>Upload</button>
      </form>
    </div>
  );
};
