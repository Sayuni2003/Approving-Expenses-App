const BASE_URL = "http://10.64.86.152:5000";

export async function apiGet(path: string) {
  const res = await fetch(`${BASE_URL}${path}`);

  const text = await res.text(); // read raw text first

  if (!res.ok) {
    console.log("RAW RESPONSE:", text);
    throw new Error(`Request failed: ${res.status}`);
  }

  // Now safely parse JSON
  return JSON.parse(text);
}

export async function apiPost(path: string, body: any) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();

  if (!res.ok) {
    console.log("RAW RESPONSE:", text);
    throw new Error(`Request failed: ${res.status}`);
  }

  return JSON.parse(text);
}

export async function apiPatch(path: string, body: any) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    console.log("RAW RESPONSE:", text);
    throw new Error(`Request failed: ${res.status}`);
  }

  return JSON.parse(text);
}

async function parseResponse(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

export async function apiDelete(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, { method: "DELETE" });
  const data = await parseResponse(res);
  if (!res.ok)
    throw new Error(`Request failed: ${res.status} ${JSON.stringify(data)}`);
  return data;
}
