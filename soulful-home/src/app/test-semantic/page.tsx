'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SearchResult {
  image_path: string;
  description: string;
  relevance_score: number;
  matching_aspects: string[];
}

interface ApiResponse {
  inspirations: SearchResult[];
}

export default function TestSemantic() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/test-semantic');
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }
        const data: ApiResponse = await response.json();
        setResults(data.inspirations || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">No results found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Semantic Search Results</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-64">
              <Image
                src={result.image_path}
                alt={result.description}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-gray-700 mb-2">{result.description}</p>
              <p className="text-sm text-gray-500 mb-2">
                Relevance Score: {result.relevance_score.toFixed(2)}
              </p>
              <div className="flex flex-wrap gap-2">
                {result.matching_aspects.map((aspect, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    {aspect}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 