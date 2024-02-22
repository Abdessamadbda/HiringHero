"use client";
import { Dropzone, FileMosaic, FullScreen, PdfPreview } from "@files-ui/react";
import * as React from "react";
import { useSelector } from "react-redux";

const BASE_URL = "http://localhost:3001";

export default function Upload() {
  const [extFiles, setExtFiles] = React.useState([]);
  const [pdf, setPdf] = React.useState(undefined);

  const updateFiles = (incomingFiles) => {
    console.log("incoming files", incomingFiles);
    setExtFiles(incomingFiles);
  };

  const onDelete = (id) => {
    setExtFiles(extFiles.filter((x) => x.id !== id));
  };

  const handleSee = (pdf) => {
    setPdf(pdf);
  };
  const keywords = useSelector((state) => state.step.keywords);
  console.log("keywords:", keywords);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      console.log("extFiles:", extFiles);

      extFiles.forEach((file, index) => {
        if (file.file instanceof File) {
          formData.append(`cvFiles${index + 1}`, file.file); // Append with unique keys
        }
      });

      formData.append("keywords", keywords);
      console.log(formData);

      const response = await fetch(`${BASE_URL}/upload-cvs`, {
        method: "POST",
        body: formData,
      });
      console.log(formData);

      if (!response.ok) {
        throw new Error("Failed to process CVs");
      }

      const data = await response.json();
      console.log("CV processing results:", data);
    } catch (error) {
      console.error("Error processing CVs:", error);
    }
  };

  const handleStart = () => {
    handleSubmit();
  };

  const handleAbort = (id) => {
    setExtFiles(
      extFiles.map((ef) => {
        if (ef.id === id) {
          return { ...ef, uploadStatus: "aborted" };
        } else return { ...ef };
      })
    );
  };
  const handleCancel = (id) => {
    setExtFiles(
      extFiles.map((ef) => {
        if (ef.id === id) {
          return { ...ef, uploadStatus: undefined };
        } else return { ...ef };
      })
    );
  };
  return (
    <>
      <Dropzone
        onChange={updateFiles}
        minHeight="195px"
        value={extFiles}
        accept=".pdf"
        maxFiles={10}
        maxFileSize={30 * 1024 * 1024}
        label="Drag'n drop files here or click to browse"
        uploadConfig={{
          handleSubmit: handleStart, // Trigger handleSubmit on upload start
          url: BASE_URL + "/file",
          cleanOnUpload: true,
        }}
        fakeUpload
        actionButtons={{
          position: "after",
          abortButton: {},
          //deleteButton: {},
        }}
      >
        {extFiles.map((file) => (
          <FileMosaic
            {...file}
            key={file.id}
            onDelete={onDelete}
            onSee={handleSee}
            onAbort={handleAbort}
            onCancel={handleCancel}
            resultOnTooltip
            alwaysActive
            preview
            info
          />
        ))}
      </Dropzone>
      <div className="flex justify-center mt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Process CVs
        </button>
      </div>
      <FullScreen open={pdf !== undefined} onClose={() => setPdf(undefined)}>
        <PdfPreview src={pdf} />
      </FullScreen>
    </>
  );
}
