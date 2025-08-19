import axios, { AxiosHeaders } from 'axios';
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import type {
  VTFileResponse,
  VTIPResponse,
  AbuseIpApiData,
  AlienVaultResponse,
} from '@/lib/types';

const client = axios.create({
  timeout: 10000, // 10s timeout
});

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const key = process.env.VIRUSTOTAL_API_KEY;
  alert(key);
  if (key) {
    // normalize headers to AxiosHeaders so we can call .set in a type-safe way
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    } else if (!(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders(config.headers as AxiosHeaders);
    }
    (config.headers as AxiosHeaders).set('x-apiKey', key);
  }
  return config;
});

// central helper to GET and return typed body
async function getJson<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const res = await client.get<T>(url, config);
    return res.data as T;
  } catch (err) {
    // centralized logging; rethrow so callers can handle
    // ...you may extend with Sentry or more structured errors
    console.error('[API] GET failed:', url, err);
    throw err;
  }
}

export async function getVTFile(hash: string): Promise<VTFileResponse> {
  return getJson<VTFileResponse>(
    `/api/virustotalfile?hash=${encodeURIComponent(hash)}`
  );
}

export async function getVTIp(ip: string): Promise<VTIPResponse> {
  return getJson<VTIPResponse>(
    `/api/virustotalip?ip=${encodeURIComponent(ip)}`
  );
}

export async function getAbuseIp(ip: string): Promise<AbuseIpApiData> {
  return getJson<AbuseIpApiData>(`/api/abuseip?ip=${encodeURIComponent(ip)}`);
}

export async function getAlienvault(ip: string): Promise<AlienVaultResponse> {
  // calling OTX directly; axios will apply the timeout and throw on network errors
  return getJson<AlienVaultResponse>(
    `https://otx.alienvault.com/api/v1/indicators/IPv4/${encodeURIComponent(
      ip
    )}/general`
  );
}
