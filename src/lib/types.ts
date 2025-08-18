export interface IiocItem {
  sha256: string;
  sha1: string;
  md5: string;
  mcafee: string;
  engines: string;
}

export interface VTFileAttributes {
  sha256?: string;
  sha1?: string;
  md5?: string;
  last_analysis_results?: Record<
    string,
    { result?: string; category?: string }
  >;
  last_analysis_stats?: { malicious?: number; undetected?: number };
}
export interface VTFileResponse {
  data?: { id?: string; attributes?: VTFileAttributes };
}

export interface IipItemAbuseIp {
  abuseConfidenceScore: number;
  domain: string | null;
  ipAddress: string;
  isp: string | null;
  lastReportedAt: number | null;
  totalReports: number;
}

export interface VTIPAttributes {
  last_analysis_results?: Record<
    string,
    { category?: string; engine_name?: string }
  >;
  last_analysis_stats?: { malicious?: number };
}
export interface VTIPResponse {
  data?: { id?: string; attributes?: VTIPAttributes };
}

export interface IVTMaliciousEntry {
  engine_name?: string;
  category?: string;
}
export interface IipItemVirusTotal {
  reports: number;
  totalReports: number;
  ipAddress: string;
  malicious: IVTMaliciousEntry[];
}

export interface IPulseEntry {
  author: { username: string };
  name: string;
  description: string;
  tags: string[];
}
export interface IipItemAlienvault {
  ipAddress: string;
  asn: string | number | null;
  countryName: string | null;
  pulseInfoCount: number;
  pulseInfoList: IPulseEntry[];
}

export interface AbuseIpApiData {
  data?: {
    abuseConfidenceScore?: number;
    domain?: string | null;
    ipAddress?: string;
    isp?: string | null;
    lastReportedAt?: string | null;
    totalReports?: number;
  };
}

export interface AlienVaultResponse {
  indicator?: string;
  asn?: string | number;
  country_name?: string | null;
  pulse_info?: unknown[];
}
