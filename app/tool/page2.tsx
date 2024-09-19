// app/tool/page.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Tool() {
  const [urls, setUrls] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFields, setSelectedFields] = useState({
    final_status_code: true,
    final_url: true,
    response_time: false,
    redirect_chain: false,
    content_type: false,
    is_indexable: false,
    canonical_url: false,
    meta_title: true,
    meta_description: true,
    h1_tags: false,
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setResults([]);
    setError(null);
    setLoading(true);

    const formData = new FormData();

    if (file) {
      formData.append('csv_file', file);
    } else if (urls) {
      const urlArray = urls
        .split('\n')
        .map((url) => url.trim())
        .filter(Boolean);

      // Validate URLs (optional)
      // If you want to ensure the URLs are valid before sending, you can add validation here.

      urlArray.forEach((url) => {
        formData.append('urls', url);
      });
    } else {
      setError('Please provide either a CSV file or a list of URLs.');
      setLoading(false);
      return;
    }

    // Optional: Add user-agent if needed
    // formData.append('user_agent', 'Your User Agent String');

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/check_batch_status/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setResults(response.data.results);
    } catch (err: unknown) {
      console.error('Error:', err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(
            `Error ${err.response.status}: ${
              err.response.data.error || err.response.statusText
            }`
          );
        } else if (err.request) {
          setError('No response received from the server.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSelectedFields((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUrls(''); // Clear the URLs textarea if a file is selected
    } else {
      setFile(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Batch URL Status Checker</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center"
        encType="multipart/form-data"
      >
        <textarea
          value={urls}
          onChange={(e) => {
            setUrls(e.target.value);
            setFile(null); // Clear the file input if URLs are entered
          }}
          placeholder="Enter URLs (one per line)"
          className="border border-gray-300 rounded-md p-2 w-80 mb-4 h-32"
        />
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Or upload CSV file:</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="file:mr-2 file:py-2 file:px-4 file:bg-blue-50 file:text-blue-700 file:rounded-md"
          />
        </div>
        {/* Checkbox options */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Select data to display:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(selectedFields).map((field) => (
              <label key={field} className="inline-flex items-center">
                <input
                  type="checkbox"
                  name={field}
                  checked={selectedFields[field as keyof typeof selectedFields]}
                  onChange={handleCheckboxChange}
                  className="form-checkbox"
                />
                <span className="ml-2 capitalize">{field.replace(/_/g, ' ')}</span>
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md px-4 py-2"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Check Status'}
        </button>
      </form>

      {error && (
        <div className="mt-8 text-red-500">
          <h2 className="text-2xl font-semibold">Error:</h2>
          <p>{error}</p>
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                {selectedFields.final_status_code && (
                  <th className="py-2 px-4 border-b">Status Code</th>
                )}
                {selectedFields.final_url && (
                  <th className="py-2 px-4 border-b">Final URL</th>
                )}
                {selectedFields.response_time && (
                  <th className="py-2 px-4 border-b">Response Time</th>
                )}
                {selectedFields.redirect_chain && (
                  <th className="py-2 px-4 border-b">Redirect Chain</th>
                )}
                {selectedFields.content_type && (
                  <th className="py-2 px-4 border-b">Content Type</th>
                )}
                {selectedFields.is_indexable && (
                  <th className="py-2 px-4 border-b">Indexable</th>
                )}
                {selectedFields.canonical_url && (
                  <th className="py-2 px-4 border-b">Canonical URL</th>
                )}
                {selectedFields.meta_title && (
                  <th className="py-2 px-4 border-b">Meta Title</th>
                )}
                {selectedFields.meta_description && (
                  <th className="py-2 px-4 border-b">Meta Description</th>
                )}
                {selectedFields.h1_tags && (
                  <th className="py-2 px-4 border-b">H1 Tags</th>
                )}
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index} className="text-center">
                  {selectedFields.final_status_code && (
                    <td className="py-2 px-4 border-b">
                      {result.final_status_code || result.error || 'N/A'}
                    </td>
                  )}
                  {selectedFields.final_url && (
                    <td className="py-2 px-4 border-b">{result.final_url || 'N/A'}</td>
                  )}
                  {selectedFields.response_time && (
                    <td className="py-2 px-4 border-b">
                      {result.response_time
                        ? `${result.response_time.toFixed(2)} seconds`
                        : 'N/A'}
                    </td>
                  )}
                  {selectedFields.redirect_chain && (
                    <td className="py-2 px-4 border-b">
                      {result.redirect_chain && result.redirect_chain.length > 0 ? (
                        result.redirect_chain.map(
                          (redirect: any, idx: number) => (
                            <div key={idx}>
                              {redirect.status_code}: {redirect.from} ➔ {redirect.to}
                            </div>
                          )
                        )
                      ) : (
                        'No redirects'
                      )}
                    </td>
                  )}
                  {selectedFields.content_type && (
                    <td className="py-2 px-4 border-b">
                      {result.content_type || 'N/A'}
                    </td>
                  )}
                  {selectedFields.is_indexable && (
                    <td className="py-2 px-4 border-b">
                      {result.is_indexable !== undefined
                        ? result.is_indexable
                          ? 'Yes'
                          : 'No'
                        : 'N/A'}
                      {result.no_index_reason && (
                        <div className="text-sm text-gray-500">
                          {result.no_index_reason}
                        </div>
                      )}
                    </td>
                  )}
                  {selectedFields.canonical_url && (
                    <td className="py-2 px-4 border-b">
                      {result.canonical_url || 'N/A'}
                    </td>
                  )}
                  {selectedFields.meta_title && (
                    <td className="py-2 px-4 border-b">
                      <div>{result.meta_title?.content || 'N/A'}</div>
                      <div className="text-sm text-gray-500">
                        Length: {result.meta_title?.length || 0}
                      </div>
                    </td>
                  )}
                  {selectedFields.meta_description && (
                    <td className="py-2 px-4 border-b">
                      <div>{result.meta_description?.content || 'N/A'}</div>
                      <div className="text-sm text-gray-500">
                        Length: {result.meta_description?.length || 0}
                      </div>
                    </td>
                  )}
                  {selectedFields.h1_tags && (
                    <td className="py-2 px-4 border-b">
                      {result.h1_tags && result.h1_tags.length > 0 ? (
                        result.h1_tags.map((h1: any, idx: number) => (
                          <div key={idx}>{h1.content}</div>
                        ))
                      ) : (
                        'No H1 tags'
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
