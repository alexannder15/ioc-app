import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { AbuseIP } from '@/lib/types';
import Image from 'next/image';

export default function AbuseIpTable({ items = [] }: { items?: AbuseIP[] }) {
  // aggregates for usageType pie
  const usageAgg = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((it) => {
      const k = it?.usageType ?? 'unknown';
      map.set(k, (map.get(k) ?? 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [items]);

  const [rawOpen, setRawOpen] = useState<Record<number, boolean>>({});

  return (
    <>
      <div className='flex items-center justify-between mt-6'>
        <h2 className='text-left flex items-center gap-2'>
          <Image alt='' src='/lib/abuseipdb-logo.svg' height={40} width={40} />
          AbuseIPDB
        </h2>
      </div>

      <Table>
        <TableCaption>Una lista de tus AbuseIPDB recientes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>#</TableHead>
            <TableHead>IPAddress</TableHead>
            <TableHead>IsPublic</TableHead>
            <TableHead>Is WhiteList</TableHead>
            <TableHead>AbuseConfidenceScore</TableHead>
            <TableHead>CountryCode</TableHead>
            <TableHead>UsageType</TableHead>
            <TableHead>Isp</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Hostnames</TableHead>
            <TableHead>IsTor</TableHead>
            <TableHead>TotalReports</TableHead>
            <TableHead>LastReportedAt</TableHead>
          </TableRow>
        </TableHeader>

        {items.map((el, i) => (
          <React.Fragment key={i}>
            <TableBody>
              <TableRow>
                <TableCell className='font-medium'>{i + 1}</TableCell>
                <TableCell>{el?.ipAddress ?? '-'}</TableCell>
                <TableCell>{el?.isPublic ? 'True' : 'False'}</TableCell>
                <TableCell>{String(el?.isWhitelisted ?? false)}</TableCell>
                <TableCell className='max-w-[160px]'>
                  <div className='flex items-center gap-2'>
                    <div className='text-sm'>
                      {el?.abuseConfidenceScore ?? '-'}%
                    </div>
                  </div>
                  <Progress value={el?.abuseConfidenceScore ?? 0} />
                </TableCell>
                <TableCell>{el?.countryCode ?? '-'}</TableCell>
                <TableCell>
                  <span className='text-xs px-2 py-0.5 rounded bg-gray-100'>
                    {el?.usageType ?? '-'}
                  </span>
                </TableCell>
                <TableCell>{el?.isp ?? '-'}</TableCell>
                <TableCell>{el?.domain ?? '-'}</TableCell>
                <TableCell>
                  {Array.isArray(el?.hostnames)
                    ? el.hostnames.join(', ')
                    : el?.hostnames ?? '-'}
                </TableCell>
                <TableCell>{el?.isTor ? 'True' : 'False'}</TableCell>
                <TableCell>{el?.totalReports ?? '-'}</TableCell>
                <TableCell>
                  {el?.lastReportedAt
                    ? new Date(el.lastReportedAt).toLocaleString()
                    : '-'}
                </TableCell>
              </TableRow>
            </TableBody>

            {/* raw JSON details row */}
            <TableBody>
              <TableRow>
                <TableCell colSpan={13} className='text-right py-2'>
                  <button
                    onClick={() => setRawOpen((s) => ({ ...s, [i]: !s[i] }))}
                    className='text-xs underline'
                  >
                    {rawOpen[i] ? 'Hide raw JSON' : 'Show raw JSON'}
                  </button>
                </TableCell>
              </TableRow>
              {rawOpen[i] && (
                <TableRow>
                  <TableCell colSpan={13}>
                    <pre className='max-h-60 overflow-auto bg-gray-50 p-3 rounded text-xs'>
                      {JSON.stringify(el, null, 2)}
                    </pre>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </React.Fragment>
        ))}
      </Table>
    </>
  );
}
