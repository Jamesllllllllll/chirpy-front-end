import React, { useState } from 'react';
import { createChirp } from '../lib/api';
import { Send, Loader2 } from 'lucide-react';

interface ChirpFormProps {
  token: string;
  onChirpCreated: () => void;
}

export function ChirpForm({ token, onChirpCreated }: ChirpFormProps) {
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setLoading(true);
    setError('');

    try {
      await createChirp(body, token);
      setBody('');
      onChirpCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create chirp');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-4">
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's happening?"
          className="flex-1 p-2 rounded-md bg-gray-900 border border-gray-800 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          disabled={!body.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <span>Chirp</span>
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}