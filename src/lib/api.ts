import { User, Chirp } from "../types";

// const LOCAL_API_URL = "/api";
// const REMOTE_API_URL = import.meta.env.REMOTE_API_URL

const API_URL = "https://chirpy.fly.dev";

export async function login(email: string, password: string): Promise<User> {
  const response = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();

  localStorage.setItem("user", JSON.stringify(data));

  return data;
}

export async function register(
  email: string,
  password: string,
  username: string
): Promise<User> {
  const response = await fetch(`${API_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, username }),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return response.json();
}

export async function getChirps(
  authorId?: string,
  sort?: "asc" | "desc"
): Promise<Chirp[]> {
  const params = new URLSearchParams();
  if (authorId) params.append("author_id", authorId);
  if (sort) {
    params.append("sort", sort);
  } else {
    params.append("sort", "desc");
  }

  const response = await fetch(`${API_URL}/api/chirps?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch chirps");
  }

  return response.json();
}

export async function createChirp(
  body: string,
  token: string,
  image: File | null
): Promise<Chirp> {
  console.log("token:", token);
  console.log("body:", body);
  console.log("image:", image);
  const chirp = await fetch(`${API_URL}/api/chirps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ body }),
  });

  if (!chirp.ok) {
    throw new Error("Failed to create chirp");
  }
  const returnedChirp: Chirp = await chirp.json();
  console.log("chirp:", returnedChirp);

  if (image) {
    const formData = new FormData();
    formData.append("image", image);
    const chirpWithImage = await fetch(
      `${API_URL}/api/upload?chirpID=${returnedChirp.id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    if (!chirpWithImage.ok) {
      throw new Error("Chirp posted, but image upload failed.");
    }
    return chirpWithImage.json();
  }

  return returnedChirp;
}

export async function deleteChirp(
  chirpId: string,
  token: string
): Promise<void> {
  const response = await fetch(`${API_URL}/api/chirps/${chirpId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete chirp");
  }
}

export async function checkRefreshToken(): Promise<User | null> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_URL}/api/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    console.log("Response from /api/refresh:", data);
    return data.token;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
}
