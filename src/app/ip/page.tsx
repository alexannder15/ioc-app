'use client';

import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getVirusTotalIp, getAbuseIp, getAlienvault } from '@/lib/api';
import IpTable from '@/components/tables/IpTable';
import {
  AbuseIP,
  AbuseIPData,
  AlienVaultIP,
  VirusTotalIP,
  VirusTotalIPData,
} from '@/lib/types';

export default function IpPage() {
  const [ipsAbuseIp, setIpsAbuseIp] = useState<AbuseIP[]>([]);
  const [ipsVirusTotal, setIpsVirusTotal] = useState<VirusTotalIP[]>([]);
  const [ipsAlienvault, setIpsAlienvault] = useState<AlienVaultIP[]>([]);
  const [ip, setIp] = useState<string>('');
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [textareaDisabled, setTextareaDisabled] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // hydrate from localStorage on mount
    try {
      const storedAbuse = JSON.parse(
        localStorage.getItem('AbuseIPs') ?? '[]'
      ) as AbuseIP[];
      const storedVT = JSON.parse(
        localStorage.getItem('VirusTotalIPs') ?? '[]'
      ) as VirusTotalIP[];
      const storedAV = JSON.parse(
        localStorage.getItem('AlienvaultIPs') ?? '[]'
      ) as AlienVaultIP[];

      console.log('storedAbuse', storedAbuse);
      console.log('storedAbuse', storedVT);
      console.log('storedAbuse', storedAV);

      setIpsAbuseIp(storedAbuse);
      setIpsVirusTotal(storedVT);
      setIpsAlienvault(storedAV);
    } catch (err) {
      console.log('hydrate error', err);
    }
  }, []);

  const refresh = async () => {
    try {
      localStorage.setItem('AbuseIPs', JSON.stringify(ipsAbuseIp));
      localStorage.setItem('VirusTotalIPs', JSON.stringify(ipsVirusTotal));
      localStorage.setItem('AlienvaultIPs', JSON.stringify(ipsAlienvault));
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
      const abuse = (await getAbuseIp(ipToCheck)) as AbuseIPData;
      await submitAbuseIp(abuse.data ?? {});
    } catch (err) {
      console.log('abuse error', err);
      setError('Error fetching AbuseIPDB');
      toast.error('Error fetching AbuseIPDB');
    }

    // VirusTotal IP via internal API
    try {
      const virusTotal = (await getVirusTotalIp(ipToCheck)) as VirusTotalIPData;

      console.log('vt', virusTotal);

      await submitVirusTotalIp(virusTotal.data ?? {});
    } catch (err) {
      console.log('vt ip error', err);
      setError((prev) =>
        prev ? `${prev}; VT error` : 'Error fetching VirusTotal IP'
      );
      toast.error('Error fetching VirusTotal IP');
    }

    // AlienVault OTX
    try {
      const alienVault = (await getAlienvault(ipToCheck)) as AlienVaultIP;
      await submitAlienVaultIp(alienVault);
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

  const submitAbuseIp = async (item: AbuseIP) => {
    const stored = JSON.parse(
      localStorage.getItem('AbuseIPs') ?? '[]'
    ) as AbuseIP[];
    const isExist = stored.some((i) => i.ipAddress === item.ipAddress);

    if (isExist) {
      toast.info(`🤔 Ya existe la IP! ${item.ipAddress} en AbuseIp`);
      return;
    }

    setIpsAbuseIp((prev) => [item, ...prev]);
    refresh();
  };

  const submitVirusTotalIp = async (item: VirusTotalIP) => {
    console.log('submit vt', item);
    const stored = JSON.parse(
      localStorage.getItem('VirusTotalIPs') ?? '[]'
    ) as VirusTotalIP[];

    console.log('stored', stored);
    const isExist = stored.some((i) => i.id === item.id);

    if (isExist) {
      toast.info(`🤔 Ya existe la IP! ${item.id} en VirusTotal`);
      return;
    }

    setIpsVirusTotal((prev) => [item, ...prev]);
    refresh();
  };

  const submitAlienVaultIp = async (item: AlienVaultIP) => {
    const stored = JSON.parse(
      localStorage.getItem('AlienvaultIPs') ?? '[]'
    ) as AlienVaultIP[];
    const isExist = stored.some((i) => i.indicator === item.indicator);

    if (isExist) {
      toast.info(`🤔 Ya existe la IP! ${item.indicator} en AlienVault`);
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
