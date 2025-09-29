import React from 'react';
import AbuseIpTable from './AbuseIpTable';
import VirusTotalTable from './VirusTotalTable';
import AlienVaultTable from './AlienVaultTable';
import Skeleton from './Skeleton';
import { AbuseIP, AlienVaultIP, VirusTotalIP } from '@/lib/types';
import AlertDismissibleExample from '@/components/AlertDismissibleExample';

export default function IpTable({
  ipsAbuseIp,
  ipsVirusTotal,
  ipsAlienvault,
  loading,
  error,
}: {
  ipsAbuseIp: AbuseIP[];
  ipsVirusTotal: VirusTotalIP[];
  ipsAlienvault: AlienVaultIP[];
  loading: boolean;
  error?: string | null;
}) {
  if (loading) {
    return (
      <div className='space-y-6'>
        <Skeleton rows={4} />
        <Skeleton rows={3} />
        <Skeleton rows={3} />
      </div>
    );
  }

  return (
    <>
      {error && <AlertDismissibleExample errorMessage={error} />}

      <div>
        <AbuseIpTable items={ipsAbuseIp} />
        <VirusTotalTable items={ipsVirusTotal} />
        <AlienVaultTable items={ipsAlienvault} />
      </div>
    </>
  );
}
