'use client';

import React from 'react';

interface SyntaxValidatorProps {
  errors: string[];
}

const SyntaxValidator: React.FC<SyntaxValidatorProps> = ({ errors }) => {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-red-600">Syntax Errors</h2>
      <ul className="list-disc pl-5 text-red-600">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
};

export default SyntaxValidator;
