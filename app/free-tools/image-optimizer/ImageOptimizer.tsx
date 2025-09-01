'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import ImageUpload from './components/ImageUpload';
import ImageEditor from './components/ImageEditor';
import DownloadManager from './components/DownloadManager';

export interface ProcessedImage {
  id: string;
  originalFile: File;
  originalSize: number;
  originalUrl: string;
  processedUrl?: string;
  processedSize?: number;
  compressionLevel: number;
  format: string;
  aspectRatio?: string;
  originalWidth?: number;
  originalHeight?: number;
  resizeWidth?: number;
  resizeHeight?: number;
  maintainAspectRatio: boolean;
  customFileName?: string;
  cropData?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export default function ImageOptimizer() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOptimizingAll, setIsOptimizingAll] = useState(false);

  const handleImagesUploaded = (files: File[]) => {
    const newImages: ProcessedImage[] = files.map((file, index) => {
      // Create a temporary image to get dimensions
      const img = new Image();
      const imageUrl = URL.createObjectURL(file);
      
      return {
        id: `${Date.now()}-${index}`,
        originalFile: file,
        originalSize: file.size,
        originalUrl: imageUrl,
        compressionLevel: 80,
        format: 'webp',
        maintainAspectRatio: true,
      };
    });
    
    // Load images to get their dimensions
    newImages.forEach((image) => {
      const img = new Image();
      img.onload = () => {
        setImages(prev => prev.map(prevImg => 
          prevImg.id === image.id 
            ? { ...prevImg, originalWidth: img.naturalWidth, originalHeight: img.naturalHeight }
            : prevImg
        ));
      };
      img.src = image.originalUrl;
    });
    
    setImages(prev => [...prev, ...newImages]);
    
    // Select the first uploaded image if none is selected
    if (!selectedImageId && newImages.length > 0) {
      setSelectedImageId(newImages[0].id);
    }
  };

  const handleImageUpdate = (updatedImage: ProcessedImage) => {
    setImages(prev => prev.map(img => 
      img.id === updatedImage.id ? updatedImage : img
    ));
  };

  const handleImageRemove = (imageId: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== imageId);
      // If we're removing the selected image, select another one
      if (selectedImageId === imageId) {
        setSelectedImageId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  const applySettingsToAll = (settingsImage: ProcessedImage) => {
    setImages(prev => prev.map(img => ({
      ...img,
      compressionLevel: settingsImage.compressionLevel,
      format: settingsImage.format,
      resizeWidth: settingsImage.resizeWidth,
      resizeHeight: settingsImage.resizeHeight,
      maintainAspectRatio: settingsImage.maintainAspectRatio,
      // Clear processed versions since settings changed
      processedUrl: undefined,
      processedSize: undefined,
      aspectRatio: undefined,
      cropData: undefined,
    })));
  };

  const resetAllSettings = () => {
    setImages(prev => prev.map(img => ({
      ...img,
      compressionLevel: 80,
      format: 'webp',
      resizeWidth: img.originalWidth,
      resizeHeight: img.originalHeight,
      maintainAspectRatio: true,
      processedUrl: undefined,
      processedSize: undefined,
      aspectRatio: undefined,
      cropData: undefined,
    })));
  };

  const optimizeAll = async () => {
    setIsOptimizingAll(true);
    setIsProcessing(true);
    
    try {
      const unprocessedImages = images.filter(img => !img.processedUrl);
      
      for (const image of unprocessedImages) {
        // Process each image using the same logic as individual processing
        await processImageById(image.id);
      }
    } catch (error) {
      console.error('Error optimizing all images:', error);
    } finally {
      setIsOptimizingAll(false);
      setIsProcessing(false);
    }
  };

  const processImageById = async (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (!image) return;

    try {
      // Import the image processing logic here
      const imageCompression = (await import('browser-image-compression')).default;
      
      let processedBlob: Blob;
      
      // Create a temporary image element to load the image
      const img = new Image();
      img.src = image.originalUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Create canvas for processing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not found');

      // Determine final dimensions
      let sourceWidth = img.naturalWidth;
      let sourceHeight = img.naturalHeight;
      let sourceX = 0;
      let sourceY = 0;
      
      // Apply crop if it exists
      if (image.cropData && image.cropData.width > 0 && image.cropData.height > 0) {
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;
        
        sourceX = image.cropData.x * scaleX;
        sourceY = image.cropData.y * scaleY;
        sourceWidth = image.cropData.width * scaleX;
        sourceHeight = image.cropData.height * scaleY;
      }

      // Apply resize dimensions
      let targetWidth = image.resizeWidth || sourceWidth;
      let targetHeight = image.resizeHeight || sourceHeight;
      
      // If cropping, scale the resize to the cropped dimensions
      if (image.cropData && image.cropData.width > 0 && image.cropData.height > 0) {
        if (image.resizeWidth && image.resizeHeight) {
          targetWidth = image.resizeWidth;
          targetHeight = image.resizeHeight;
        }
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        targetWidth,
        targetHeight
      );

      // Convert canvas to blob
      processedBlob = await new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, `image/${image.format}`, image.compressionLevel / 100);
      });

      // Apply compression
      const compressionOptions = {
        maxSizeMB: Infinity,
        maxWidthOrHeight: undefined,
        useWebWorker: true,
        fileType: `image/${image.format}` as any,
        quality: image.compressionLevel / 100,
      };

      const compressedFile = await imageCompression(
        new File([processedBlob], image.originalFile.name, { type: `image/${image.format}` }),
        compressionOptions
      );

      const processedUrl = URL.createObjectURL(compressedFile);
      
      const updatedImage = {
        ...image,
        processedUrl,
        processedSize: compressedFile.size,
      };

      setImages(prev => prev.map(img => 
        img.id === imageId ? updatedImage : img
      ));
    } catch (error) {
      console.error(`Error processing image ${imageId}:`, error);
    }
  };

  const selectedImage = images.find(img => img.id === selectedImageId);

  return (
    <div>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-gray-50 shadow rounded-lg p-6">
            <div className="mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-center mb-2">
                <FontAwesomeIcon icon={faImage} className="text-xl text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Image Optimizer
                </h2>
              </div>
              <p className="text-center text-sm text-gray-500">
                Compress, crop, and convert your images to optimize file sizes while maintaining quality
              </p>
            </div>

            {/* Upload Section */}
            <div className="mb-8">
              <ImageUpload 
                onImagesUploaded={handleImagesUploaded}
                isProcessing={isProcessing}
              />
            </div>



            {/* Image List and Editor */}
            {images.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Image List */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Uploaded Images ({images.length})
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {images.map((image) => (
                      <div
                        key={image.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedImageId === image.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedImageId(image.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={image.originalUrl}
                            alt={image.originalFile.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="mb-2">
                              <label className="block text-xs text-gray-500 mb-1">Filename (without extension):</label>
                              <input
                                type="text"
                                value={image.customFileName || image.originalFile.name.split('.').slice(0, -1).join('.')}
                                onChange={(e) => {
                                  const updatedImage = { ...image, customFileName: e.target.value };
                                  setImages(prev => prev.map(img => 
                                    img.id === image.id ? updatedImage : img
                                  ));
                                }}
                                className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded px-2 py-1"
                                placeholder="Enter custom filename"
                              />
                            </div>
                            <p className="text-xs text-gray-500">
                              {(image.originalSize / 1024).toFixed(1)} KB
                              {image.originalWidth && image.originalHeight && (
                                <span> • {image.originalWidth}×{image.originalHeight}px</span>
                              )}
                            </p>
                            {image.processedSize && (
                              <p className="text-xs text-green-600">
                                Optimized: {(image.processedSize / 1024).toFixed(1)} KB
                                ({(((image.originalSize - image.processedSize) / image.originalSize) * 100).toFixed(1)}% smaller)
                              </p>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageRemove(image.id);
                            }}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image Editor */}
                <div className="lg:col-span-2">
                  {selectedImage && (
                    <ImageEditor
                      image={selectedImage}
                      onImageUpdate={handleImageUpdate}
                      isProcessing={isProcessing}
                      setIsProcessing={setIsProcessing}
                      onApplyToAll={applySettingsToAll}
                      onOptimizeAll={optimizeAll}
                      onResetAll={resetAllSettings}
                      hasMultipleImages={images.length > 1}
                      isOptimizingAll={isOptimizingAll}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Download Section */}
            {images.some(img => img.processedUrl) && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <DownloadManager images={images.filter(img => img.processedUrl)} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}