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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/// abuseip ip

export interface AbuseIPData {
  data?: AbuseIP;
}

export interface AbuseIP {
  ipAddress?: string;
  isPublic?: boolean;
  ipVersion?: number;
  isWhitelisted?: boolean;
  abuseConfidenceScore?: number;
  countryCode?: string;
  usageType?: string;
  isp?: string;
  domain?: string;
  hostnames?: string[];
  isTor?: boolean;
  totalReports?: number;
  numDistinctUsers?: number;
  lastReportedAt?: Date;
}

/// virustotal ip

export interface VirusTotalIPData {
  data?: VirusTotalIP;
}

export interface VirusTotalIP {
  id?: string;
  type?: string;
  links?: Links;
  attributes?: Attributes;
}

export interface Attributes {
  last_analysis_date?: number;
  whois?: string;
  whois_date?: number;
  continent?: string;
  last_analysis_stats?: LastAnalysisStats;
  asn?: number;
  last_modification_date?: number;
  country?: string;
  network?: string;
  tags?: any[]; // eslint-disable-line
  total_votes?: TotalVotes;
  last_analysis_results?: { [key: string]: LastAnalysisResult };
  rdap?: Rdap;
  regional_internet_registry?: string;
  reputation?: number;
  as_owner?: string;
}

export interface LastAnalysisResult {
  method?: Method;
  engine_name?: string;
  category?: Category;
  result?: Result;
}

export enum Category {
  Harmless = 'harmless',
  Malicious = 'malicious',
  Undetected = 'undetected',
}

export enum Method {
  Blacklist = 'blacklist',
}

export enum Result {
  Clean = 'clean',
  Malware = 'malware',
  Unrated = 'unrated',
}

export interface LastAnalysisStats {
  malicious?: number;
  suspicious?: number;
  undetected?: number;
  harmless?: number;
  timeout?: number;
}

export interface Rdap {
  object_class_name?: string;
  handle?: string;
  start_address?: string;
  end_address?: string;
  ip_version?: string;
  name?: string;
  type?: string;
  country?: string;
  parent_handle?: string;
  status?: string[];
  links?: Link[];
  notices?: Notice[];
  events?: Event[];
  rdap_conformance?: string[];
  entities?: RdapEntity[];
  port43?: string;
  cidr0_cidrs?: Cidr0CIDR[];
  remarks?: Notice[];
  arin_originas0_originautnums?: any[]; // eslint-disable-line
}

export interface Cidr0CIDR {
  v4prefix?: string;
  length?: number;
  v6prefix?: string;
}

export interface RdapEntity {
  object_class_name?: string;
  handle?: string;
  vcard_array?: FluffyVcardArray[];
  roles?: string[];
  links?: Link[];
  public_ids?: any[]; // eslint-disable-line
  entities?: EntityEntity[];
  remarks?: any[]; // eslint-disable-line
  events?: any[]; // eslint-disable-line
  as_event_actor?: any[]; // eslint-disable-line
  status?: any[]; // eslint-disable-line
  port43?: string;
  networks?: any[]; // eslint-disable-line
  autnums?: any[]; // eslint-disable-line
  url?: string;
  lang?: string;
  rdap_conformance?: any[]; // eslint-disable-line
}

export interface EntityEntity {
  object_class_name?: string;
  handle?: string;
  vcard_array?: PurpleVcardArray[];
  roles?: string[];
  links?: Link[];
  public_ids?: any[]; // eslint-disable-line
  entities?: any[]; // eslint-disable-line
  remarks?: any[]; // eslint-disable-line
  events?: any[]; // eslint-disable-line
  as_event_actor?: any[]; // eslint-disable-line
  status?: any[]; // eslint-disable-line
  port43?: string;
  networks?: any[]; // eslint-disable-line
  autnums?: any[]; // eslint-disable-line
  url?: string;
  lang?: string;
  rdap_conformance?: any[]; // eslint-disable-line
}

export interface Link {
  href?: string;
  rel?: string;
  value?: string;
  type?: Title;
  title?: Title;
  media?: string;
  href_lang?: any[]; // eslint-disable-line
}

export enum Title {
  ApplicationPDF = 'application/pdf',
  ApplicationRdapJSON = 'application/rdap+json',
  Empty = '',
  TextHTML = 'text/html',
}

export interface PurpleVcardArray {
  name?: string;
  type?: Type;
  values?: string[];
  parameters?: any; // eslint-disable-line
}

export enum Type {
  Text = 'text',
}

export interface FluffyVcardArray {
  name?: string;
  type?: Type;
  values?: string[];
  parameters?: FluffyParameters;
}

export interface FluffyParameters {
  label?: string[];
  type?: string[];
}

export interface Event {
  event_action?: string;
  event_date?: Date;
  event_actor?: string;
  links?: any[]; // eslint-disable-line
}

export interface Notice {
  title?: string;
  description?: string[];
  links?: Link[];
  type?: string;
}

export interface TotalVotes {
  harmless?: number;
  malicious?: number;
}

export interface Links {
  self?: string;
}

/// alienvault ip

export interface AlienVaultIP {
  whois?: string;
  reputation?: number;
  indicator?: string;
  type?: string;
  type_title?: string;
  base_indicator?: any; // eslint-disable-line
  pulse_info?: PulseInfo;
  false_positive?: any[]; // eslint-disable-line
  validation?: any[]; // eslint-disable-line
  asn?: string;
  city_data?: boolean;
  city?: null;
  region?: null;
  continent_code?: string;
  country_code3?: string;
  country_code2?: string;
  subdivision?: null;
  latitude?: number;
  postal_code?: null;
  longitude?: number;
  accuracy_radius?: number;
  country_code?: string;
  country_name?: string;
  dma_code?: number;
  charset?: number;
  area_code?: number;
  flag_url?: string;
  flag_title?: string;
  sections?: string[];
}

export interface PulseInfo {
  count?: number;
  pulses?: any[]; // eslint-disable-line
  references?: any[]; // eslint-disable-line
  related?: Related;
}

export interface Related {
  alienvault?: Alienvault;
  other?: Alienvault;
}

export interface Alienvault {
  adversary?: any[]; // eslint-disable-line
  malware_families?: any[]; // eslint-disable-line
  industries?: any[]; // eslint-disable-line
}
