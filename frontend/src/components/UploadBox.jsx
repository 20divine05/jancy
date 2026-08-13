import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, CheckCircle2, AlertCircle } from 'lucide-react';

const UploadBox = ({ selectedFile, setSelectedFile, isUploading, uploadProgress, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        id="dropzone-file-input"
      />

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
            isDragging
              ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01] glow-border-cyan'
              : 'border-slate-700/80 bg-slate-900/50 hover:border-indigo-500/70 hover:bg-slate-900/80'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div className={`p-4 rounded-2xl transition-all duration-300 ${
              isDragging ? 'bg-cyan-500/20 text-cyan-400 scale-110' : 'bg-indigo-500/10 text-indigo-400'
            }`}>
              <UploadCloud className="w-10 h-10 stroke-[1.8]" />
            </div>

            <div>
              <p className="text-base font-semibold text-white">
                Drag & drop your file here, or <span className="text-indigo-400 underline underline-offset-4 decoration-indigo-500/50">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports any file format (Documents, Images, Archives, Videos up to 100MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/80 p-5 shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                <File className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{selectedFile.name}</h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{formatBytes(selectedFile.size)}</p>
              </div>
            </div>

            {!isUploading && (
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-mono">
                <span>Uploading to Vault...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300 shadow-sm shadow-cyan-400/50"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-3 flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadBox;
