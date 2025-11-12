export const API_BASE = import.meta.env.VITE_BACKEND_URL || window.location.origin.replace('3000', '8000');

export async function apiGet(path, params) {
  const url = new URL((API_BASE + path).replace(/\/$/, ''));
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch((API_BASE + path).replace(/\/$/, ''), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
