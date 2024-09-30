// // app/tool/page.tsx



// // app/tool/page.tsx
// 'use client';

// import { useState } from 'react';
// import axios from 'axios';
// // Remove the metadata import and export
// // import type { Metadata } from 'next';
// // import { metadata } from './metadata';

// export default function Tool() {
//   const [urlInput, setUrlInput] = useState('');
//   const [statusCode, setStatusCode] = useState<number | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     setStatusCode(null);
//     setError(null);

//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/check-url/`,
//         { url: urlInput }
//       );
//       setStatusCode(response.data.status_code);
//     } catch (err: unknown) {
//       console.error('Error:', err);
//       if (axios.isAxiosError(err)) {
//         if (err.response) {
//           // Server responded with a status code outside the 2xx range
//           setError(`Error ${err.response.status}: ${err.response.data.error || err.response.statusText}`);
//         } else if (err.request) {
//           // No response received
//           setError('No response received from the server.');
//         } else {
//           // Other errors
//           setError(err.message);
//         }
//       } else {
//         setError('An unexpected error occurred.');
//       }
//     }
//   }; 
  

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-4xl font-bold mb-8">Check URL Status Code</h1>
//       <form onSubmit={handleSubmit} className="flex flex-col items-center">
//         <input
//           type="text"
//           value={urlInput}
//           onChange={(e) => setUrlInput(e.target.value)}
//           placeholder="Enter URL"
//           className="border border-gray-300 rounded-md p-2 w-80 mb-4"
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 text-white rounded-md px-4 py-2"
//         >
//           Check Status
//         </button>
//       </form>

//       {statusCode && (
//         <div className="mt-8">
//           <h2 className="text-2xl font-semibold">
//             Status Code: {statusCode}
//           </h2>
//         </div>
//       )}

//       {error && (
//         <div className="mt-8 text-red-500">
//           <h2 className="text-2xl font-semibold">Error:</h2>
//           <p>{error}</p>
//         </div>
//       )}
//     </div>
//   );
// }
