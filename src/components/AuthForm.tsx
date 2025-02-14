import React, { useState } from "react";
import { User } from "../types";
import { login, register } from "../lib/api";
import { LogIn, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

interface AuthFormProps {
  onSuccess: (user: User) => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let user;
      if (isLogin) {
        user = await login(email, password);
      } else {
        await register(email, password, username);
        user = await login(email, password);
      }
      onSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog
      id="auth-modal"
      className="backdrop:bg-gray-950/50 backdrop:backdrop-blur-sm rounded-lg shadow-xl p-0 bg-gray-900 text-gray-200"
      onClick={(e) => {
        const dialog = e.currentTarget;
        const rect = dialog.getBoundingClientRect();

        if (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        ) {
          dialog.close();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-[400px] p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-200">
            {isLogin ? "Login" : "Create Account"}
          </h2>
          <button
            onClick={() =>
              (
                document.getElementById("auth-modal") as HTMLDialogElement
              )?.close()
            }
            className="text-gray-500 hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email {!isLogin && <span className="text-xs">(use a fake one)</span>}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                required={!isLogin}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {loading ? (
              "Please wait..."
            ) : isLogin ? (
              <div className="flex items-center justify-center">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up
              </div>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:text-blue-300"
          >
            {isLogin
              ? "Need an account? Register"
              : "Already have an account? Login"}
          </button>
        </div>
      </motion.div>
    </dialog>
  );
}
