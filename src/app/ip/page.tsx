'use client';

import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getVTIp, getAbuseIp, getAlienvault } from '@/lib/api';
import {
  IipItemAbuseIp,
  IipItemVirusTotal,
  IipItemAlienvault,
  IVTMaliciousEntry,
  AbuseIpApiData,
  VTIPResponse,
  AlienVaultResponse,
  IPulseEntry,
} from '@/lib/types';
import IpTable from '@/components/tables/IpTable';

export default function IpPage() {
  const [ipsAbuseIp, setIpsAbuseIp] = useState<IipItemAbuseIp[]>([]);
  const [ipsVirusTotal, setIpsVirusTotal] = useState<IipItemVirusTotal[]>([]);
  const [ipsAlienvault, setIpsAlienvault] = useState<IipItemAlienvault[]>([]);
  const [ip, setIp] = useState<string>('');
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [textareaDisabled, setTextareaDisabled] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // hydrate from localStorage on mount
    try {
      const storedAbuse = JSON.parse(
        localStorage.getItem('ipsAbuseIp') ?? '[]'
      ) as IipItemAbuseIp[];
      const storedVT = JSON.parse(
        localStorage.getItem('ipsVirusTotal') ?? '[]'
      ) as IipItemVirusTotal[];
      const storedAV = JSON.parse(
        localStorage.getItem('ipsAlienvault') ?? '[]'
      ) as IipItemAlienvault[];
      setIpsAbuseIp(storedAbuse);
      setIpsVirusTotal(storedVT);
      setIpsAlienvault(storedAV);
    } catch (err) {
      console.log('hydrate error', err);
    }
  }, []);

  const refresh = async () => {
    try {
      localStorage.setItem('ipsAbuseIp', JSON.stringify(ipsAbuseIp));
      localStorage.setItem('ipsVirusTotal', JSON.stringify(ipsVirusTotal));
      localStorage.setItem('ipsAlienvault', JSON.stringify(ipsAlienvault));
    } catch (error) {
      console.log(error);
    }
  };

  const save = async (ipToCheck: string) => {
    if (!isIPV4(ipToCheck)) return;
    setButtonDisabled(true);
    setTextareaDisabled(true);
    setLoading(true);
    setError(null);

    // AbuseIPDB via internal API
    try {
      const abuse = (await getAbuseIp(ipToCheck)) as AbuseIpApiData;
      const d = abuse.data ?? {};
      const item: IipItemAbuseIp = {
        ipAddress: String(d.ipAddress ?? ipToCheck),
        isPublic: d.isPublic ?? false,
        ipVersion: d.ipVersion ?? 0,
        isWhitelisted: d.isWhitelisted ?? null,
        abuseConfidenceScore: Number(d.abuseConfidenceScore ?? 0),
        countryCode: d.countryCode ?? '',
        usageType: d.usageType ?? '',
        isp: d.isp ?? null,
        domain: d.domain ?? null,
        hostnames: d.hostnames ?? [],
        isTor: d.isTor ?? false,
        totalReports: Number(d.totalReports ?? 0),
        lastReportedAt: d.lastReportedAt
          ? Date.parse(String(d.lastReportedAt))
          : null,
        numDistinctUsers: d.numDistinctUsers ?? 0,
      };
      await submitAbuseIp(item);
    } catch (err) {
      console.log('abuse error', err);
      setError('Error fetching AbuseIPDB');
      toast.error('Error fetching AbuseIPDB');
    }

    // VirusTotal IP via internal API
    try {
      const vt = (await getVTIp(ipToCheck)) as VTIPResponse;
      const attrs = vt.data?.attributes ?? {};
      const lastResults = attrs.last_analysis_results ?? {};
      const values = Object.values(lastResults) as Array<
        Record<string, unknown>
      >;
      const stats = attrs.last_analysis_stats ?? { malicious: 0 };
      const malicious = values.filter(
        (x) => (x as Record<string, unknown>).category === 'malicious'
      ) as IVTMaliciousEntry[];

      const item: IipItemVirusTotal = {
        reports: Number(stats.malicious ?? 0),
        totalReports: values.length,
        ipAddress: String(vt.data?.id ?? ipToCheck),
        malicious,
      };
      await submitVirusTotalIp(item);
    } catch (err) {
      console.log('vt ip error', err);
      setError((prev) =>
        prev ? `${prev}; VT error` : 'Error fetching VirusTotal IP'
      );
      toast.error('Error fetching VirusTotal IP');
    }

    // AlienVault OTX
    try {
      const av = (await getAlienvault(ipToCheck)) as AlienVaultResponse;
      const pulseInfo = av.pulse_info as unknown[] | undefined;
      const pulseCount =
        Array.isArray(pulseInfo) && pulseInfo.length > 0
          ? (pulseInfo[0] as number)
          : 0;
      const pulseList =
        Array.isArray(pulseInfo) && pulseInfo.length > 1
          ? (pulseInfo[1] as IPulseEntry[])
          : [];

      const item: IipItemAlienvault = {
        ipAddress: String(av.indicator ?? ipToCheck),
        asn: av.asn ?? null,
        countryName: av.country_name ?? null,
        pulseInfoCount: Number(pulseCount),
        pulseInfoList: pulseList,
      };
      await submitAlienVaultIp(item);
    } catch (err) {
      console.log('alienvault error', err);
      setError((prev) =>
        prev ? `${prev}; AlienVault error` : 'Error fetching AlienVault'
      );
      toast.error('Error fetching AlienVault');
    } finally {
      setIp('');
      setButtonDisabled(false);
      setTextareaDisabled(false);
      setLoading(false);
    }
  };

  const submitAbuseIp = async (item: IipItemAbuseIp) => {
    const stored = JSON.parse(
      localStorage.getItem('ipsAbuseIp') ?? '[]'
    ) as IipItemAbuseIp[];
    const isExist = stored.some((i) => i.ipAddress === item.ipAddress);

    if (isExist) {
      toast.info(`🤔 Ya existe la IP! ${item.ipAddress} en AbuseIp`);
      return;
    }

    setIpsAbuseIp((prev) => [item, ...prev]);
    refresh();
  };

  const submitVirusTotalIp = async (item: IipItemVirusTotal) => {
    const stored = JSON.parse(
      localStorage.getItem('ipsVirusTotal') ?? '[]'
    ) as IipItemVirusTotal[];
    const isExist = stored.some((i) => i.ipAddress === item.ipAddress);

    if (isExist) {
      toast.info(`🤔 Ya existe la IP! ${item.ipAddress} en VirusTotal`);
      return;
    }

    setIpsVirusTotal((prev) => [item, ...prev]);
    refresh();
  };

  const submitAlienVaultIp = async (item: IipItemAlienvault) => {
    const stored = JSON.parse(
      localStorage.getItem('ipsAlienvault') ?? '[]'
    ) as IipItemAlienvault[];
    const isExist = stored.some((i) => i.ipAddress === item.ipAddress);

    if (isExist) {
      toast.info(`🤔 Ya existe la IP! ${item.ipAddress} en AlienVault`);
      return;
    }

    setIpsAlienvault((prev) => [item, ...prev]);
    refresh();
  };

  const isIPV4 = (value: string): boolean => {
    const regex = new RegExp(
      '^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$'
    );
    return regex.test(value);
  };

  return (
    <div className='container mx-auto'>
      <ToastContainer />

      {/* Form one IOC */}
      <div className='container mt-2 mb-2'>
        <div>
          <p className='text-center mb-4 text-5xl font-medium tracking-tight text-gray-900 dark:text-white'>
            Ingresar IP
          </p>
          <p>Consultar IPs una a una en AbuseIPDB</p>
          <div className='grid w-full gap-3 mt-4'>
            <Label>
              Formatos aceptados:{' '}
              <small>
                <b>IPv4</b>
              </small>
            </Label>
            <Textarea
              onChange={(e) => setIp(e.target.value)}
              disabled={textareaDisabled}
              placeholder='Escribe tu IP aquí.'
              id='message'
              className='mt-2 mb-2'
            />
          </div>
        </div>
        <div className='text-center mt-4'>
          <Button
            className='mb-3'
            onClick={() => save(ip)}
            disabled={buttonDisabled || ip === ''}
          >
            Consultar
          </Button>
        </div>
      </div>

      {/* Presentational tables */}
      <IpTable
        ipsAbuseIp={ipsAbuseIp}
        ipsVirusTotal={ipsVirusTotal}
        ipsAlienvault={ipsAlienvault}
        loading={loading}
        error={error}
      />
    </div>
  );
}
