'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faImages, faSpinner } from '@fortawesome/free-solid-svg-icons';

interface ImageUploadProps {
  onImagesUploaded: (files: File[]) => void;
  isProcessing: boolean;
}

export default function ImageUpload({ onImagesUploaded, isProcessing }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter for image files only
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/')
    );
    
    if (imageFiles.length > 0) {
      onImagesUploaded(imageFiles);
    }
  }, [onImagesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.svg']
    },
    multiple: true,
    disabled: isProcessing
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-50'
            : isProcessing
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          {isProcessing ? (
            <FontAwesomeIcon icon={faSpinner} className="text-4xl text-gray-400 animate-spin" />
          ) : (
            <FontAwesomeIcon 
              icon={isDragActive ? faImages : faCloudUploadAlt} 
              className={`text-4xl ${isDragActive ? 'text-indigo-500' : 'text-gray-400'}`} 
            />
          )}
          
          <div>
            {isProcessing ? (
              <p className="text-lg text-gray-500">Processing images...</p>
            ) : isDragActive ? (
              <p className="text-lg text-indigo-600 font-medium">Drop images here</p>
            ) : (
              <div>
                <p className="text-lg text-gray-600 font-medium">
                  Drag & drop images here, or click to select
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supports JPEG, PNG, GIF, BMP, WebP, TIFF, and SVG formats
                </p>
              </div>
            )}
          </div>
          
          {!isProcessing && (
            <div className="flex flex-col sm:flex-row gap-2 justify-center items-center text-sm text-gray-500">
              <span>✓ Multiple file upload</span>
              <span className="hidden sm:inline">•</span>
              <span>✓ Client-side processing</span>
              <span className="hidden sm:inline">•</span>
              <span>✓ No file size limits</span>
            </div>
          )}
        </div>
      </div>
      
      {!isProcessing && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Your images are processed locally in your browser. Nothing is uploaded to our servers.
          </p>
        </div>
      )}
    </div>
  );
}