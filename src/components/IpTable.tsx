import AbuseIpTable from './AbuseIpTable';
import VirusTotalTable from './VirusTotalTable';
import AlienVaultTable from './AlienVaultTable';
import Skeleton from './Skeleton';
import {
  IipItemAbuseIp,
  IipItemVirusTotal,
  IipItemAlienvault,
} from '@/lib/types';
import AlertDismissibleExample from './AlertDismissibleExample';

export default function IpTable({
  ipsAbuseIp,
  ipsVirusTotal,
  ipsAlienvault,
  loading,
  error,
}: {
  ipsAbuseIp: IipItemAbuseIp[];
  ipsVirusTotal: IipItemVirusTotal[];
  ipsAlienvault: IipItemAlienvault[];
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
