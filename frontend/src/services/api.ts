import { auth } from "@/FirebaseConfig";

const BASE_URL = "http://10.64.86.152:5000";

async function buildHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function parse(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

export async function apiGet(path: string) {
  const headers = await buildHeaders();
  const res = await fetch(`${BASE_URL}${path}`, { headers });
  const data = await parse(res);
  if (!res.ok)
    throw new Error(data?.message || `Request failed: ${res.status}`);
  return data;
}

export async function apiPost(path: string, body: any) {
  const headers = await buildHeaders();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = await parse(res);
  if (!res.ok)
    throw new Error(data?.message || `Request failed: ${res.status}`);
  return data;
}

export async function apiPatch(path: string, body: any) {
  const headers = await buildHeaders();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
  const data = await parse(res);
  if (!res.ok)
    throw new Error(data?.message || `Request failed: ${res.status}`);
  return data;
}

export async function apiDelete(path: string) {
  const headers = await buildHeaders();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    headers,
  });
  const data = await parse(res);
  if (!res.ok)
    throw new Error(data?.message || `Request failed: ${res.status}`);
  return data;
}
