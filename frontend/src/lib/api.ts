const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

if (!BASE_URL) {
  throw new Error("VITE_API_BASE_URL is missing. Define it in frontend/.env");
}

type Options = RequestInit & { json?: unknown };

function getToken() {
  return (
    localStorage.getItem("token") || sessionStorage.getItem("token") || null
  );
}

export async function api(path: string, options: Options = {}) {
  const { json, headers, ...rest } = options;
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    ...(json
      ? { body: JSON.stringify(json), method: options.method ?? "POST" }
      : {}),
    ...rest,
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    const msg =
      data?.error?.message ||
      data?.message ||
      res.statusText ||
      "Request failed";
    throw new Error(msg);
  }

  return data;
}
