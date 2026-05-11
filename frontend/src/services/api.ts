export const API_URL = process.env.EXPO_PUBLIC_API_URL!;

export async function apiFetch(path: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    throw new Error("Erro na API");
  }

  return response.json();
}