'use client';

import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import imageCompression from 'browser-image-compression';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCrop, 
  faCompress, 
  faDownload, 
  faSpinner,
  faUndo,
  faAdjust,
  faExpandArrowsAlt,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { ProcessedImage } from '../ImageOptimizer';

interface ImageEditorProps {
  image: ProcessedImage;
  onImageUpdate: (updatedImage: ProcessedImage) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  onApplyToAll: (settingsImage: ProcessedImage) => void;
  onOptimizeAll: () => void;
  onResetAll: () => void;
  hasMultipleImages: boolean;
  isOptimizingAll: boolean;
}

const ASPECT_RATIOS = [
  { label: 'Free', value: undefined },
  { label: '1:1 (Square)', value: 1 },
  { label: '4:3', value: 4/3 },
  { label: '3:4', value: 3/4 },
  { label: '16:9', value: 16/9 },
  { label: '9:16', value: 9/16 },
  { label: '3:2', value: 3/2 },
  { label: '2:3', value: 2/3 },
];

const FORMATS = [
  { label: 'WebP', value: 'webp', description: 'Best compression' },
  { label: 'AVIF', value: 'avif', description: 'Newest, smallest' },
  { label: 'JPEG', value: 'jpeg', description: 'Universal support' },
  { label: 'PNG', value: 'png', description: 'Lossless, transparency' },
];

export default function ImageEditor({ 
  image, 
  onImageUpdate, 
  isProcessing, 
  setIsProcessing,
  onApplyToAll,
  onOptimizeAll,
  onResetAll,
  hasMultipleImages,
  isOptimizingAll
}: ImageEditorProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<number | undefined>();
  const [compressionLevel, setCompressionLevel] = useState(image.compressionLevel);
  const [format, setFormat] = useState(image.format);
  const [optimizeMenuOpen, setOptimizeMenuOpen] = useState(false);
  const [resetMenuOpen, setResetMenuOpen] = useState(false);
  const [optimizeScope, setOptimizeScope] = useState<'this' | 'all'>('this');
  const [showOriginal, setShowOriginal] = useState(true);
  const [resizeWidth, setResizeWidth] = useState<number | undefined>(image.resizeWidth || image.originalWidth);
  const [resizeHeight, setResizeHeight] = useState<number | undefined>(image.resizeHeight || image.originalHeight);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(image.maintainAspectRatio);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const optimizeMenuRef = useRef<HTMLDivElement>(null);
  const resetMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (optimizeMenuOpen && optimizeMenuRef.current && !optimizeMenuRef.current.contains(target)) {
        setOptimizeMenuOpen(false);
      }
      if (resetMenuOpen && resetMenuRef.current && !resetMenuRef.current.contains(target)) {
        setResetMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [optimizeMenuOpen, resetMenuOpen]);

  const handleAspectRatioChange = (aspectRatio: number | undefined) => {
    setSelectedAspectRatio(aspectRatio);
    if (aspectRatio && imgRef.current) {
      const { naturalWidth, naturalHeight } = imgRef.current;
      const newCrop: Crop = {
        unit: '%',
        width: 50,
        height: 50,
        x: 25,
        y: 25,
      };
      setCrop(newCrop);
    }
  };

  const handleResizeWidthChange = (width: number) => {
    setResizeWidth(width);
    if (maintainAspectRatio && image.originalWidth && image.originalHeight) {
      const aspectRatio = image.originalWidth / image.originalHeight;
      setResizeHeight(Math.round(width / aspectRatio));
    }
  };

  const handleResizeHeightChange = (height: number) => {
    setResizeHeight(height);
    if (maintainAspectRatio && image.originalWidth && image.originalHeight) {
      const aspectRatio = image.originalWidth / image.originalHeight;
      setResizeWidth(Math.round(height * aspectRatio));
    }
  };

  const handleMaintainAspectRatioChange = (maintain: boolean) => {
    setMaintainAspectRatio(maintain);
    if (maintain && resizeWidth && image.originalWidth && image.originalHeight) {
      const aspectRatio = image.originalWidth / image.originalHeight;
      setResizeHeight(Math.round(resizeWidth / aspectRatio));
    }
  };

  const handleCompressionChange = (level: number) => {
    setCompressionLevel(level);
  };

  const handleFormatChange = (newFormat: string) => {
    setFormat(newFormat);
  };

  const handleOptimizePrimary = () => {
    if (optimizeScope === 'this') {
      void processImage();
    } else {
      onOptimizeAll();
    }
  };

  const handleResetPrimary = () => {
    resetChanges();
  };

  const getProcessedImg = useCallback(
    (image: HTMLImageElement, crop?: PixelCrop): Promise<Blob> => {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas not found');
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not found');

      // Determine final dimensions
      let sourceWidth = image.naturalWidth;
      let sourceHeight = image.naturalHeight;
      let sourceX = 0;
      let sourceY = 0;
      
      if (crop && crop.width > 0 && crop.height > 0) {
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        
        sourceX = crop.x * scaleX;
        sourceY = crop.y * scaleY;
        sourceWidth = crop.width * scaleX;
        sourceHeight = crop.height * scaleY;
      }

      // Apply resize dimensions
      let targetWidth = resizeWidth || sourceWidth;
      let targetHeight = resizeHeight || sourceHeight;
      
      // If cropping, scale the resize to the cropped dimensions
      if (crop && crop.width > 0 && crop.height > 0) {
        if (resizeWidth && resizeHeight) {
          targetWidth = resizeWidth;
          targetHeight = resizeHeight;
        }
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        targetWidth,
        targetHeight
      );

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, `image/${format}`, compressionLevel / 100);
      });
    },
    [format, compressionLevel, resizeWidth, resizeHeight]
  );

  const processImage = async () => {
    if (!imgRef.current) return;
    
    setIsProcessing(true);
    
    try {
      // Apply crop and/or resize
      let processedBlob: Blob;
      
      if (completedCrop && completedCrop.width > 0 && completedCrop.height > 0) {
        // Crop and resize
        processedBlob = await getProcessedImg(imgRef.current, completedCrop);
      } else if (resizeWidth && resizeHeight && (resizeWidth !== image.originalWidth || resizeHeight !== image.originalHeight)) {
        // Just resize
        processedBlob = await getProcessedImg(imgRef.current);
      } else {
        // No crop or resize, just convert original file to blob
        processedBlob = new Blob([await image.originalFile.arrayBuffer()], { 
          type: image.originalFile.type 
        });
      }

      // Apply compression
      const compressionOptions = {
        maxSizeMB: Infinity,
        maxWidthOrHeight: undefined,
        useWebWorker: true,
        fileType: `image/${format}` as any,
        quality: compressionLevel / 100,
      };

      const compressedFile = await imageCompression(
        new File([processedBlob], image.originalFile.name, { type: `image/${format}` }),
        compressionOptions
      );

      const processedUrl = URL.createObjectURL(compressedFile);
      
      const updatedImage: ProcessedImage = {
        ...image,
        processedUrl,
        processedSize: compressedFile.size,
        compressionLevel,
        format,
        resizeWidth,
        resizeHeight,
        maintainAspectRatio,
        aspectRatio: selectedAspectRatio ? ASPECT_RATIOS.find(ar => ar.value === selectedAspectRatio)?.label : undefined,
        cropData: completedCrop ? {
          x: completedCrop.x,
          y: completedCrop.y,
          width: completedCrop.width,
          height: completedCrop.height,
        } : undefined,
      };

      onImageUpdate(updatedImage);
      setShowOriginal(false);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetChanges = () => {
    setCrop(undefined);
    setCompletedCrop(undefined);
    setSelectedAspectRatio(undefined);
    setCompressionLevel(80);
    setFormat('webp');
    setResizeWidth(image.originalWidth);
    setResizeHeight(image.originalHeight);
    setMaintainAspectRatio(true);
    setShowOriginal(true);
    
    // Clear processed version
    const resetImage: ProcessedImage = {
      ...image,
      processedUrl: undefined,
      processedSize: undefined,
      compressionLevel: 80,
      format: 'webp',
      resizeWidth: image.originalWidth,
      resizeHeight: image.originalHeight,
      maintainAspectRatio: true,
      aspectRatio: undefined,
      cropData: undefined,
    };
    onImageUpdate(resetImage);
  };

  const handleApplyToAll = () => {
    const currentSettings: ProcessedImage = {
      ...image,
      compressionLevel,
      format,
      resizeWidth,
      resizeHeight,
      maintainAspectRatio,
    };
    onApplyToAll(currentSettings);
  };

  const displayUrl = (!showOriginal && image.processedUrl) ? image.processedUrl : image.originalUrl;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Edit: {image.customFileName || image.originalFile.name.split('.').slice(0, -1).join('.')}
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            disabled={!image.processedUrl}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              !image.processedUrl 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : showOriginal
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            }`}
          >
            {showOriginal ? 'Show Original' : 'Show Processed'}
          </button>
        </div>
      </div>

      {/* Image Preview with Crop */}
      <div className="space-y-2">
        <div className="text-center">
          <p className="text-sm text-gray-600">Draw on the image to crop it (optional)</p>
        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={selectedAspectRatio}
            className="max-w-full"
          >
            <img
              ref={imgRef}
              src={displayUrl}
              alt={image.originalFile.name}
              className="max-w-full h-auto"
              style={{ maxHeight: '400px' }}
            />
          </ReactCrop>
        </div>
      </div>

      {/* Canvas for processing (hidden) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Crop Settings */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faCrop} className="text-indigo-600" />
            <h4 className="text-md font-medium text-gray-900">Crop Settings</h4>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aspect Ratio
            </label>
            <select
              value={selectedAspectRatio || ''}
              onChange={(e) => handleAspectRatioChange(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {ASPECT_RATIOS.map((ratio) => (
                <option key={ratio.label} value={ratio.value || ''}>
                  {ratio.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resize Settings */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faExpandArrowsAlt} className="text-indigo-600" />
            <h4 className="text-md font-medium text-gray-900">Resize Settings</h4>
          </div>
          
          {image.originalWidth && image.originalHeight && (
            <div className="text-sm text-gray-600">
              Original: {image.originalWidth} × {image.originalHeight}px
            </div>
          )}
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width (px)
              </label>
            <input
              type="number"
              value={resizeWidth ?? ''}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  setResizeWidth(undefined);
                  if (maintainAspectRatio) setResizeHeight(undefined);
                  return;
                }
                const num = Number(val);
                if (!Number.isFinite(num) || num <= 0) return;
                handleResizeWidthChange(Math.round(num));
              }}
              min="1"
              max="10000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (px)
              </label>
            <input
              type="number"
              value={resizeHeight ?? ''}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  setResizeHeight(undefined);
                  if (maintainAspectRatio) setResizeWidth(undefined);
                  return;
                }
                const num = Number(val);
                if (!Number.isFinite(num) || num <= 0) return;
                handleResizeHeightChange(Math.round(num));
              }}
              min="1"
              max="10000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintainAspectRatio"
                checked={maintainAspectRatio}
                onChange={(e) => handleMaintainAspectRatioChange(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="maintainAspectRatio" className="ml-2 text-sm text-gray-700">
                Maintain aspect ratio
              </label>
            </div>
          </div>
        </div>

        {/* Compression Settings */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faCompress} className="text-indigo-600" />
            <h4 className="text-md font-medium text-gray-900">Output Settings</h4>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            <select
              value={format}
              onChange={(e) => handleFormatChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {FORMATS.map((fmt) => (
                <option key={fmt.value} value={fmt.value}>
                  {fmt.label} - {fmt.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quality: {compressionLevel}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={compressionLevel}
              onChange={(e) => handleCompressionChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>
        </div>
      </div>

      {/* Size Comparison */}
      {image.processedSize && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Size Comparison</p>
                <p className="text-xs text-green-600">
                  Original: {(image.originalSize / 1024).toFixed(1)} KB → 
                  Optimized: {(image.processedSize / 1024).toFixed(1)} KB
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-700">
                  {(((image.originalSize - image.processedSize) / image.originalSize) * 100).toFixed(1)}% smaller
                </p>
                <p className="text-xs text-green-600">
                  Saved {((image.originalSize - image.processedSize) / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            {((resizeWidth && resizeWidth !== image.originalWidth) || (resizeHeight && resizeHeight !== image.originalHeight)) && (
              <div className="pt-2 border-t border-green-300">
                <p className="text-xs text-green-600">
                  Dimensions: {image.originalWidth} × {image.originalHeight}px → {resizeWidth} × {resizeHeight}px
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Process Split Buttons */}
      <div className="flex justify-center flex-wrap gap-3">
        {/* Optimize split button */}
        <div className="relative inline-flex" ref={optimizeMenuRef}>
          <button
            onClick={handleOptimizePrimary}
            disabled={isProcessing || isOptimizingAll}
            className={`px-6 py-3 rounded-l-lg font-medium transition-all ${
              isProcessing || isOptimizingAll
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg'
            }`}
          >
            {isProcessing ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCompress} className="mr-2" />
                {optimizeScope === 'this' ? 'Optimize This Image' : 'Optimize All Images'}
              </>
            )}
          </button>
          <button
            aria-label="More optimize options"
            onClick={() => setOptimizeMenuOpen((v) => !v)}
            disabled={isProcessing || isOptimizingAll}
            className={`px-3 py-3 rounded-r-lg border-l ${
              isProcessing || isOptimizingAll
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300'
                : 'bg-indigo-700 text-white hover:bg-indigo-800 border-indigo-600'
            }`}
          >
            <FontAwesomeIcon icon={faChevronDown} />
          </button>
          {optimizeMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg z-20">
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  setOptimizeScope('this');
                  setOptimizeMenuOpen(false);
                  void processImage();
                }}
              >
                Optimize This Image
              </button>
              {hasMultipleImages && (
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setOptimizeScope('all');
                    setOptimizeMenuOpen(false);
                    onOptimizeAll();
                  }}
                >
                  Optimize All Images
                </button>
              )}
            </div>
          )}
        </div>

        {/* Reset split button */}
        <div className="relative inline-flex" ref={resetMenuRef}>
          <button
            onClick={handleResetPrimary}
            className="px-5 py-3 rounded-l-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
          >
            <FontAwesomeIcon icon={faUndo} className="mr-2" />
            Reset
          </button>
          <button
            aria-label="More reset options"
            onClick={() => setResetMenuOpen((v) => !v)}
            className="px-3 py-3 rounded-r-lg border-l bg-gray-300 text-gray-700 hover:bg-gray-400 transition-all"
          >
            <FontAwesomeIcon icon={faChevronDown} />
          </button>
          {resetMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg z-20">
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  setResetMenuOpen(false);
                  resetChanges();
                }}
              >
                Reset This Image
              </button>
              {hasMultipleImages && (
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setResetMenuOpen(false);
                    onResetAll();
                  }}
                >
                  Reset All Images
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}