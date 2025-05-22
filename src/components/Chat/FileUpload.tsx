
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File as FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  selectedFiles: File[];
  onFileRemove: (index: number) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  selectedFiles,
  onFileRemove 
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter to only allow certain file types
    const validFiles = acceptedFiles.filter(file => 
      file.type.match(/(text|image|application\/pdf|application\/json|application\/xml)/i)
    );
    
    // Check if any files were rejected
    if (validFiles.length !== acceptedFiles.length) {
      toast.error("Some files were not accepted. We support text, images, PDFs, and JSON/XML files.");
    }
    
    // Limit total size to 10MB
    const totalSize = [...selectedFiles, ...validFiles].reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 10 * 1024 * 1024) {
      toast.error("Total file size exceeds 10MB limit");
      return;
    }
    
    if (validFiles.length > 0) {
      onFileSelect(validFiles);
    }
  }, [onFileSelect, selectedFiles]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 5,
  });

  return (
    <div className="space-y-3 w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-indigo-400 bg-indigo-900/20' 
            : 'border-slate-700 hover:border-slate-600 bg-slate-800/30'}`
        }
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-6 w-6 text-slate-400" />
          <p className="text-sm text-slate-400">
            {isDragActive ? 'Drop files here' : 'Drag files here or click to upload'}
          </p>
          <p className="text-xs text-slate-500">
            Supports images, text, PDFs (max 5 files, 10MB total)
          </p>
        </div>
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-300">Selected Files:</h4>
          <div className="grid gap-2">
            {selectedFiles.map((file, index) => (
              <div 
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-slate-800/50 p-2 rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <FileIcon className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm text-slate-300 truncate max-w-[200px]">
                    {file.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button
                  variant="ghost" 
                  size="icon"
                  className="h-6 w-6 text-slate-500 hover:text-slate-300"
                  onClick={() => onFileRemove(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
