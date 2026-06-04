// API client with auth token attach + silent refresh on 401.
import { storage } from "@/src/utils/storage";

const BASE = process.env.EXPO_PUBLIC_BACKEND_URL!;
const API = `${BASE}/api`;

let accessToken: string | null = null;
let refreshing: Promise<string | null> | null = null;

export const setAccessToken = (t: string | null) => {
  accessToken = t;
};
export const getAccessToken = () => accessToken;

export const REFRESH_KEY = "cf_refresh_token";

async function doRefresh(): Promise<string | null> {
  const r = await storage.secureGet<string>(REFRESH_KEY, "");
  if (!r) return null;
  try {
    const resp = await fetch(`${API}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: r }),
    });
    if (!resp.ok) {
      await storage.secureRemove(REFRESH_KEY);
      accessToken = null;
      return null;
    }
    const data = await resp.json();
    accessToken = data.access_token;
    await storage.secureSet(REFRESH_KEY, data.refresh_token);
    return accessToken;
  } catch {
    return null;
  }
}

export async function api<T = any>(
  path: string,
  opts: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = true, headers, ...rest } = opts;
  const h: Record<string, string> = { "Content-Type": "application/json", ...(headers as any) };
  if (auth && accessToken) h["Authorization"] = `Bearer ${accessToken}`;

  let resp = await fetch(`${API}${path}`, { ...rest, headers: h });
  if (resp.status === 401 && auth) {
    if (!refreshing) refreshing = doRefresh();
    const newTok = await refreshing;
    refreshing = null;
    if (newTok) {
      h["Authorization"] = `Bearer ${newTok}`;
      resp = await fetch(`${API}${path}`, { ...rest, headers: h });
    }
  }
  if (!resp.ok) {
    let detail = `HTTP ${resp.status}`;
    try {
      const j = await resp.json();
      detail = j.detail || JSON.stringify(j);
    } catch {}
    throw new Error(detail);
  }
  const text = await resp.text();
  if (!text) return undefined as unknown as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

export async function apiUpload<T = any>(path: string, formData: FormData): Promise<T> {
  const h: Record<string, string> = {};
  if (accessToken) h["Authorization"] = `Bearer ${accessToken}`;
  const resp = await fetch(`${API}${path}`, { method: "POST", headers: h, body: formData as any });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

export const apiBaseUrl = () => API;
