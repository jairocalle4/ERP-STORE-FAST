"use client";

import { useEffect, useState } from 'react';

export default function TestConnectionPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:5140/api/health')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => setData(data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div className="p-10 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Walking Skeleton: API Connection Test</h1>
      
      <div className="border p-6 rounded-lg shadow-lg w-full max-w-md bg-white text-black">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Status</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {data ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p><strong>API Response:</strong></p>
            <pre className="mt-2 text-sm">{JSON.stringify(data, null, 2)}</pre>
          </div>
        ) : (
          !error && <p className="text-gray-500 animate-pulse">Connecting to API...</p>
        )}
      </div>

      <div className="mt-8 text-sm text-gray-400">
        <p>API URL: http://localhost:5140/api/health</p>
      </div>
    </div>
  );
}
