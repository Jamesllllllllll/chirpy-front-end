import { useState, useEffect } from "react";
import { User, Chirp } from "./types";
import { AuthForm } from "./components/AuthForm";
import { ChirpForm } from "./components/ChirpForm";
import { ChirpList } from "./components/ChirpList";
import { getChirps } from "./lib/api";
import { LogOut } from "lucide-react";
import { checkRefreshToken } from "./lib/api";

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [chirps, setChirps] = useState<Chirp[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://chirpy.fly.dev";

  const fetchChirps = async () => {
    try {
      const response = await getChirps();
      setChirps(response);
    } catch (error) {
      console.error("Failed to fetch chirps:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      setLoading(true);
      try {
        const accessToken = await checkRefreshToken();

        if (!accessToken) {
          console.log("No refresh token found");
          setUser(null);
          localStorage.removeItem("user");
          return;
        }

        const userResponse = await fetch(`${API_URL}/api/getuser`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!userResponse.ok) {
          console.error("Failed to fetch user data:", userResponse);
          setUser(null);
          localStorage.removeItem("user");
          return;
        }

        const userData = await userResponse.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {
        console.error("Error initializing user:", error);
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
    fetchChirps();
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("refresh_token");
  };

  const handleAuth = (user: User) => {
    setUser(user);
    localStorage.setItem("refresh_token", user.refresh_token);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[url('/maptexture2.webp')] bg-cover bg-center">
        <div className="min-h-screen bg-gray-950/80">
          <header className="bg-gray-900/50 border-b border-gray-800">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between gap-4 items-center">
              <div className="flex gap-4 items-center">
                <img src="/bird.png" />
                <h1 className="text-4xl text-stone-200 cinzel-decorative-regular">
                  Chirpy
                </h1>
              </div>
              <button
                onClick={() =>
                  (
                    document.getElementById("auth-modal") as HTMLDialogElement
                  )?.showModal()
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Login / Register
              </button>
            </div>
          </header>
          <main className="max-w-4xl mx-auto px-4 py-8">
            <ChirpList
              chirps={chirps}
              onChirpDeleted={fetchChirps}
              isModerator={false}
            />
            <AuthForm onSuccess={handleAuth} />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/maptexture2.webp')] bg-cover bg-center">
      <div className="min-h-screen bg-gray-950/80">
        <header className="bg-gray-900/50 border-b border-gray-800">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between gap-4 items-center">
            <div className="flex gap-4 items-center">
              <img src="/bird.png" />
              <h1 className="text-4xl text-stone-200 cinzel-decorative-regular">
                Chirpy
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">{user.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <ChirpForm token={user.token!} onChirpCreated={fetchChirps} />

          {loading ? (
            <div className="text-center py-8 text-gray-400">
              Loading chirps...
            </div>
          ) : (
            <ChirpList
              chirps={chirps}
              currentUserId={user.id}
              isModerator={user.is_chirpy_red}
              token={user.token}
              onChirpDeleted={fetchChirps}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
