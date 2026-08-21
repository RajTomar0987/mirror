"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useRef } from "react";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface FileUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSizeMB = 5,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateAndAddFiles = (newFiles: FileList | File[]) => {
    setErrorMsg(null);
    const addedArray = Array.from(newFiles);
    const validAdditions: File[] = [];

    for (const file of addedArray) {
      if (files.length + validAdditions.length >= maxFiles) {
        setErrorMsg(`You can attach a maximum of ${maxFiles} files per quote.`);
        break;
      }
      if (file.size > maxSizeBytes) {
        setErrorMsg(`File "${file.name}" exceeds the ${maxSizeMB}MB size limit.`);
        continue;
      }
      if (!allowedTypes.includes(file.type)) {
        setErrorMsg(`File "${file.name}" is not a supported format (JPEG, PNG, WebP, PDF).`);
        continue;
      }
      validAdditions.push(file);
    }

    if (validAdditions.length > 0) {
      onFilesChange([...files, ...validAdditions]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesChange(updated);
    setErrorMsg(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? "border-[#111111] bg-[#f7f7f5]"
            : "border-[#e5e5e5] bg-white hover:border-[#111111]"
        }`}
        role="button"
        tabIndex={0}
        aria-label="Upload project images or architectural plans"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          onChange={(e) => {
            if (e.target.files) validateAndAddFiles(e.target.files);
          }}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full border border-[#e5e5e5] flex items-center justify-center text-[#555555]">
            <Upload size={20} />
          </div>
          <div>
            <p className="text-sm font-sans font-medium text-[#111111]">
              Drag & drop photos or plans here, or <span className="underline font-bold">browse files</span>
            </p>
            <p className="text-xs text-[#555555] font-mono mt-1">
              Supports JPEG, PNG, WebP, PDF — Max {maxSizeMB}MB each (Up to {maxFiles} files)
            </p>
          </div>
        </div>
      </div>

      {/* Accessible Error Announcement */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-xs rounded-sm font-sans" role="alert">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Attachment Previews List */}
      <AnimatePresence>
        {files.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-[#555555] font-mono block">
              Attached Files ({files.length}/{maxFiles})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {files.map((file, idx) => {
                const isImage = file.type.startsWith("image/");
                return (
                  <motion.div
                    key={`${file.name}-${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-between p-3 border border-[#e5e5e5] bg-white shadow-subtle"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {isImage ? (
                        <div className="w-10 h-10 border border-[#e5e5e5] overflow-hidden flex-shrink-0 bg-[#f7f7f5]">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 border border-[#e5e5e5] flex items-center justify-center text-[#555555] flex-shrink-0 bg-[#f7f7f5]">
                          <FileText size={18} />
                        </div>
                      )}
                      <div className="truncate text-xs">
                        <p className="font-sans font-medium text-[#111111] truncate">
                          {file.name}
                        </p>
                        <p className="font-mono text-[10px] text-[#555555]">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="p-1 text-[#555555] hover:text-red-600 transition-colors"
                      aria-label={`Remove file ${file.name}`}
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
