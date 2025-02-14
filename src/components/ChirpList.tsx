import { Chirp } from "../types";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Trash2 } from "lucide-react";
import { deleteChirp } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface ChirpListProps {
  chirps: Chirp[];
  currentUserId?: string;
  token?: string;
  onChirpDeleted: () => void;
}

export function ChirpList({
  chirps,
  currentUserId,
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
    <motion.div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {chirps.map((chirp) => {
          console.log(chirp.created_at);
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
                <div>
                  <span className="text-sm text-gray-400 mr-2">
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
                  <p className="font-medium text-gray-200 mt-1">{chirp.body}</p>
                </div>
                {currentUserId === chirp.user_id && token && (
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
    </motion.div>
  );
}
