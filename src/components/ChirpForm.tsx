import React, { useState, useEffect, useRef } from "react";
import { createChirp } from "../lib/api";
import { Send, Loader2, ImagePlus, X, Smile } from "lucide-react";

interface ChirpFormProps {
  token: string;
  onChirpCreated: () => void;
}

export function ChirpForm({ token, onChirpCreated }: ChirpFormProps) {
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null as File | null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setLoading(true);
    setError("");

    try {
      await createChirp(body, token, image);
      setBody("");
      handleRemoveImage();
      onChirpCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create chirp");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    console.log("image:", image);
  }, [image]);

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

        <label
          htmlFor="image"
          className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 cursor-pointer transition-colors flex items-center gap-2"
        >
          <ImagePlus className="w-4 h-4" />
          <input
            id="image"
            name="image"
            type="file"
            accept=".png,.jpg,.jpeg"
            className="hidden"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
        </label>
        <button
          type="submit"
          disabled={!body.trim()}
          className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
      {image && (
        <>
          <div
            className="bg-blue-100 mt-4 border-l-4 border-blue-500 text-blue-700 p-4"
            role="alert"
          >
            <p className="font-bold">Keep it positive!</p>
            <p>
              Uploaded images should be "PG-13" or less. Don't make me turn
              image uploads off <Smile className="inline w-4 h-4" />
            </p>
          </div>
          <div className="relative mt-4 w-fit">
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={URL.createObjectURL(image)}
              className="relative max-w-full max-h-96 rounded-lg border-gray-800 border mt-2"
            />
          </div>
        </>
      )}
    </form>
  );
}
