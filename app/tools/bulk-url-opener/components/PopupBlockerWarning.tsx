'use client';

import React from 'react';

// PopupBlockerWarning.tsx
// Shows the warning message when pop-ups are blocked

const PopupBlockerWarning: React.FC = () => {
  return (
    <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
      <p className="font-bold">Pop-ups Blocked</p>
      <p>
        It seems that your browser is blocking some pop-ups. To ensure all URLs open correctly, please allow
        pop-ups for this site in your browser settings.
      </p>
      <ul className="mt-2 list-disc list-inside">
        <li>
          <strong>Chrome</strong>: Click the pop-up blocked icon in the address bar and select{' '}
          <em>&quot;Always allow pop-ups and redirects from this site&quot;</em>.
        </li>
        <li>
          <strong>Firefox</strong>: Click the options button in the address bar and choose{' '}
          <em>&quot;Allow pop-ups for this site&quot;</em>.
        </li>
        <li>
          <strong>Edge</strong>: Click the blocked pop-ups icon and select{' '}
          <em>&quot;Always allow pop-ups and redirects from this site&quot;</em>.
        </li>
        <li>
          <strong>Safari</strong>: Go to <em>Preferences &gt; Websites &gt; Pop-up Windows</em> and allow pop-ups
          for this site.
        </li>
      </ul>
    </div>
  );
};

export default PopupBlockerWarning;
