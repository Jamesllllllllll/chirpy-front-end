import { User, Chirp } from "../types";

const API_URL = "/api";

export async function login(email: string, password: string): Promise<User> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
}

export async function register(email: string, password: string, username: string): Promise<User> {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, username }),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
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

  const response = await fetch(`${API_URL}/chirps?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch chirps");
  }

  return response.json();
}

export async function createChirp(body: string, token: string): Promise<Chirp> {
  const response = await fetch(`${API_URL}/chirps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ body }),
  });

  if (!response.ok) {
    throw new Error("Failed to create chirp");
  }

  return response.json();
}

export async function deleteChirp(
  chirpId: string,
  token: string
): Promise<void> {
  const response = await fetch(`${API_URL}/chirps/${chirpId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete chirp");
  }
}
