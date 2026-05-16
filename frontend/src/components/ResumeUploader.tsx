"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface ResumeUploaderProps {
  onUpload: (file: File) => void;
}

export default function ResumeUploader({ onUpload }: ResumeUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
  });

  return (
    <motion.div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer
        transition-all duration-300 bg-white dark:bg-slate-800
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500"
        }
      `}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-6">
        <motion.div
          className="p-6 bg-blue-100 dark:bg-blue-900/30 rounded-full"
          animate={{
            scale: isDragActive ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {isDragActive ? (
            <FileText className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          ) : (
            <Upload className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          )}
        </motion.div>

        <div>
          <h3 className="text-2xl font-bold mb-2">
            {isDragActive ? "Drop your resume here" : "Upload Your Resume"}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Drag and drop or click to select a PDF or DOCX file
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Supports PDF and DOCX • Max 10MB
          </p>
        </div>

        <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Secure Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>No Data Stored</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Open Source</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
