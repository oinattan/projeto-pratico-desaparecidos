'use client';

import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  onError?: (message: string) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  maxSizePerFile?: number;
  className?: string;
}

export default function FileUpload({
  onFilesChange,
  onError,
  acceptedTypes = ['image/*', 'video/*', 'application/pdf'],
  maxFiles = 5,
  maxSizePerFile = 50,
  className = ''
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
  if (!fileList) return;

  const newFiles = Array.from(fileList);
  const validFiles: File[] = [];
  const errors: string[] = [];

  newFiles.forEach((file) => {

  if (files.length + validFiles.length >= maxFiles) {
    errors.push(`Máximo de ${maxFiles} arquivos permitidos`);
    return;
  }

  if (file.size > maxSizePerFile * 1024 * 1024) {
    errors.push(`${file.name}: arquivo muito grande (máx. ${maxSizePerFile}MB)`);
    return;
  }

  const isValidType = acceptedTypes.some((type) => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.replace('/*', '/'));
    }
    return file.type === type;
  });

  if (!isValidType) {
    errors.push(`${file.name}: tipo não suportado`);
    return;
  }

  validFiles.push(file);
  });

  if (errors.length > 0) {
  if (onError) {
    onError(errors.join('\n'));
  }

  }

  if (validFiles.length > 0) {
  const updatedFiles = [...files, ...validFiles];
  setFiles(updatedFiles);
  onFilesChange(updatedFiles);
  }
  };

  const removeFile = (index: number) => {
  const updatedFiles = files.filter((_, i) => i !== index);
  setFiles(updatedFiles);
  onFilesChange(updatedFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);
  handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);
  };

  const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
  if (file.type.startsWith('image/')) return '🖼️';
  if (file.type.startsWith('video/')) return '🎥';
  if (file.type === 'application/pdf') return '📄';
  return '📎';
  };

  return (
  <div className={`w-full ${className}`}>
  {}
  <div
    className={`
      border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
      ${dragActive ?
    'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
    'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}
    `
    }
    onClick={() => fileInputRef.current?.click()}
    onDrop={handleDrop}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}>
    
    <input
      ref={fileInputRef}
      type="file"
      multiple
      accept={acceptedTypes.join(',')}
      onChange={(e) => handleFiles(e.target.files)}
      className="hidden" />
    
    
    <div className="space-y-2">
      <div className="text-4xl">📎</div>
      <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
        Clique ou arraste arquivos aqui
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Imagens, vídeos ou PDFs • Máx. {maxSizePerFile}MB cada • Até {maxFiles} arquivos
      </div>
    </div>
  </div>

  {}
  {files.length > 0 &&
  <div className="mt-4 space-y-2">
      <h4 className="font-medium text-gray-700 dark:text-gray-300">
        Arquivos selecionados ({files.length}/{maxFiles})
      </h4>
      
      {files.map((file, index) =>
    <div
      key={index}
      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg gap-3">
      
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <span className="text-xl flex-shrink-0">{getFileIcon(file)}</span>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm text-gray-700 dark:text-gray-300 break-words word-wrap overflow-wrap-anywhere">
                {file.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(file.size)}
              </div>
            </div>
          </div>
          
          <button
        type="button"
        onClick={() => removeFile(index)}
        className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
        title="Remover arquivo">
        
            ❌
          </button>
        </div>
    )}
    </div>
  }
  </div>);

}