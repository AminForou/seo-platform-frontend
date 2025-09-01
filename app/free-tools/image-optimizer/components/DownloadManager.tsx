'use client';

import React, { useState } from 'react';
import JSZip from 'jszip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDownload, 
  faFileArchive, 
  faSpinner,
  faCheckCircle 
} from '@fortawesome/free-solid-svg-icons';
import { ProcessedImage } from '../ImageOptimizer';

interface DownloadManagerProps {
  images: ProcessedImage[];
}

export default function DownloadManager({ images }: DownloadManagerProps) {
  const [isCreatingZip, setIsCreatingZip] = useState(false);

  const downloadSingleImage = async (image: ProcessedImage) => {
    if (!image.processedUrl) return;

    try {
      const response = await fetch(image.processedUrl);
      const blob = await response.blob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Create filename with format extension
      const fileName = image.customFileName || image.originalFile.name.split('.').slice(0, -1).join('.');
      link.download = `${fileName}-optimized.${image.format}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const downloadAllAsZip = async () => {
    if (images.length === 0) return;
    
    setIsCreatingZip(true);
    
    try {
      const zip = new JSZip();
      
      // Add each processed image to the zip
      await Promise.all(
        images.map(async (image, index) => {
          if (!image.processedUrl) return;
          
          const response = await fetch(image.processedUrl);
          const blob = await response.blob();
          
          // Create filename with format extension
          const fileName = image.customFileName || image.originalFile.name.split('.').slice(0, -1).join('.');
          const filename = `${fileName}-optimized.${image.format}`;
          
          zip.file(filename, blob);
        })
      );
      
      // Generate zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // Download zip file
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `optimized_images_${new Date().toISOString().split('T')[0]}.zip`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating zip file:', error);
    } finally {
      setIsCreatingZip(false);
    }
  };

  const totalOriginalSize = images.reduce((sum, img) => sum + img.originalSize, 0);
  const totalProcessedSize = images.reduce((sum, img) => sum + (img.processedSize || 0), 0);
  const totalSavings = totalOriginalSize - totalProcessedSize;
  const savingsPercentage = totalOriginalSize > 0 ? (totalSavings / totalOriginalSize) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Download Optimized Images
        </h3>
        {images.length > 1 && (
          <button
            onClick={downloadAllAsZip}
            disabled={isCreatingZip}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isCreatingZip
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg'
            }`}
          >
            {isCreatingZip ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                Creating ZIP...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faFileArchive} className="mr-2" />
                Download All as ZIP
              </>
            )}
          </button>
        )}
      </div>

      {/* Summary Stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-blue-600 font-medium">Images Processed</p>
            <p className="text-2xl font-bold text-blue-800">{images.length}</p>
          </div>
          <div>
            <p className="text-sm text-blue-600 font-medium">Original Size</p>
            <p className="text-2xl font-bold text-blue-800">
              {(totalOriginalSize / 1024).toFixed(1)} KB
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-600 font-medium">Optimized Size</p>
            <p className="text-2xl font-bold text-blue-800">
              {(totalProcessedSize / 1024).toFixed(1)} KB
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-600 font-medium">Total Savings</p>
            <p className="text-2xl font-bold text-green-700">
              {savingsPercentage.toFixed(1)}%
            </p>
            <p className="text-xs text-blue-600">
              ({(totalSavings / 1024).toFixed(1)} KB saved)
            </p>
          </div>
        </div>
      </div>

      {/* Individual Downloads */}
      <div className="space-y-3">
        <h4 className="text-md font-medium text-gray-900">Individual Downloads</h4>
        <div className="space-y-2">
          {images.map((image) => (
            <div
              key={image.id}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={image.processedUrl || image.originalUrl}
                  alt={image.originalFile.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {(image.customFileName || image.originalFile.name.split('.').slice(0, -1).join(''))}-optimized.{image.format}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>
                      {(image.originalSize / 1024).toFixed(1)} KB → {(image.processedSize! / 1024).toFixed(1)} KB
                    </span>
                    <span className="text-green-600 font-medium">
                      {(((image.originalSize - image.processedSize!) / image.originalSize) * 100).toFixed(1)}% smaller
                    </span>
                    {image.aspectRatio && (
                      <span className="text-indigo-600">
                        {image.aspectRatio}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                <button
                  onClick={() => downloadSingleImage(image)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-1" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Information */}
      <div className="text-center text-sm text-gray-500">
        <p>
          All processing is done locally in your browser. Your images are never uploaded to our servers.
        </p>
      </div>
    </div>
  );
}