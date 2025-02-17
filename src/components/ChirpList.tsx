import { Chirp } from "../types";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Gavel, Trash2 } from "lucide-react";
import { deleteChirp } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface ChirpListProps {
  chirps: Chirp[];
  currentUserId?: string;
  isModerator: boolean | undefined;
  token?: string;
  onChirpDeleted: () => void;
}

export function ChirpList({
  chirps,
  currentUserId,
  isModerator,
  token,
  onChirpDeleted,
}: ChirpListProps) {
  const handleDelete = async (chirpId: string) => {
    if (!token) return;

    try {
      await deleteChirp(chirpId, token);
      onChirpDeleted();
    } catch (error) {
      console.error("Failed to delete chirp:", error);
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {chirps.map((chirp) => {
          return (
            <motion.div
              key={chirp.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              layout
              className="p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="overflow-hidden">
                  <span className="flex items-center text-sm text-gray-400 mr-2">
                    {chirp.user_id ===
                      "37341b4b-7a2a-44ac-815d-3601debae372" && (
                      <img
                        className="mr-1"
                        width="16"
                        height="16"
                        src="/grandmagus.png"
                      />
                    )}
                    {chirp.user_id ===
                      "39fd0aff-6fb1-4a2f-82ca-afa6d3d1e6d9" && (
                      <Gavel className="w-4 h-4 mr-1 inline" />
                    )}
                    @{chirp.username}
                  </span>
                  <span className="text-xs text-gray-500 mb-0.5">
                    {(() => {
                      const parsedDate = parseISO(chirp.created_at);
                      return formatDistanceToNow(parsedDate, {
                        addSuffix: true,
                        includeSeconds: true,
                      });
                    })()}
                  </span>
                  <p className="font-medium text-gray-200 mt-1 break-words">{chirp.body}</p>
                  {chirp.imageURL && 
                  <img src={chirp.imageURL} className="max-w-full max-h-96 rounded-lg border-gray-800 border mt-2" />}
                </div>
                {(currentUserId === chirp.user_id || isModerator) && token && (
                  <button
                    onClick={() => handleDelete(chirp.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
