import React from 'react';
import { SelectedFields } from './types';

interface DisplayOptionsSelectorProps {
  selectedFields: SelectedFields;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DisplayOptionsSelector: React.FC<DisplayOptionsSelectorProps> = ({
  selectedFields,
  handleCheckboxChange,
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">
        Select Information to Display
      </h3>
      {/* Change grid to flex and adjust for mobile */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        {/* HTTP Information */}
        <div className="space-y-2 flex-1">
          <h4 className="font-medium text-gray-600">HTTP Information</h4>
          {/* Status Code */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="status_code"
              checked={selectedFields.status_code}
              onChange={handleCheckboxChange}
              className="form-checkbox h-5 w-5 text-blue-600 rounded"
            />
            <span>Status Code</span>
          </label>
          {/* Response Time */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="response_time"
              checked={selectedFields.response_time}
              onChange={handleCheckboxChange}
              className="form-checkbox h-5 w-5 text-blue-600 rounded"
            />
            <span>Response Time</span>
          </label>
          {/* Content Type */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="content_type"
              checked={selectedFields.content_type}
              onChange={handleCheckboxChange}
              className="form-checkbox h-5 w-5 text-blue-600 rounded"
            />
            <span>Content Type</span>
          </label>
        </div>
        {/* Redirect Information */}
        <div className="space-y-2 flex-1">
          <h4 className="font-medium text-gray-600">Redirect Information</h4>
          {/* Redirect Chain */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="redirect_chain"
              checked={selectedFields.redirect_chain}
              onChange={handleCheckboxChange}
              className="form-checkbox h-5 w-5 text-blue-600 rounded"
            />
            <span>Redirect Chain</span>
          </label>
        </div>
        {/* SEO Metadata */}
        <div className="space-y-2 flex-1">
          <h4 className="font-medium text-gray-600">SEO Metadata</h4>
          {/* Meta Title */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="meta_title"
              checked={selectedFields.meta_title}
              onChange={handleCheckboxChange}
              className="form-checkbox h-5 w-5 text-blue-600 rounded"
            />
            <span>Meta Title</span>
          </label>
          {/* Meta Description */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="meta_description"
              checked={selectedFields.meta_description}
              onChange={handleCheckboxChange}
              className="form-checkbox h-5 w-5 text-blue-600 rounded"
            />
            <span>Meta Description</span>
          </label>
          {/* H1 Tags */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="h1_tags"
              checked={selectedFields.h1_tags}
              onChange={handleCheckboxChange}
              className="form-checkbox h-5 w-5 text-blue-600 rounded"
            />
            <span>H1 Tags</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default DisplayOptionsSelector;