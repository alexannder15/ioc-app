import React from 'react';
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
import { IipItemAbuseIp } from '@/lib/types';
import Image from 'next/image';

export default function AbuseIpTable({ items }: { items: IipItemAbuseIp[] }) {
  return (
    <>
      <h2 className='text-left mt-4'>
        <Image alt='' src='/lib/abuseipdb-logo.svg' height={40} width={40} />
        AbuseIPDB
      </h2>

      <Table>
        <TableCaption>Una lista de tus AbuseIPDB recientes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>#</TableHead>
            <TableHead>IPAddress</TableHead>
            <TableHead>IsPublic</TableHead>
            {/* <TableHead>IPVersion</TableHead> */}
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
            {/* <TableHead>NumDistinctUsers</TableHead> */}
          </TableRow>
        </TableHeader>

        {items.map((el, i) => (
          <TableBody key={i}>
            <TableRow>
              <TableCell className='font-medium'>{i + 1}</TableCell>
              <TableCell>{el.ipAddress}</TableCell>
              <TableCell>{el.isPublic == true ? 'True' : 'False'}</TableCell>
              {/* <TableCell>{el.ipVersion}</TableCell> */}
              <TableCell>{el.isWhitelisted}</TableCell>
              <TableCell>
                {el.abuseConfidenceScore}%
                <Progress value={el.abuseConfidenceScore} />
              </TableCell>
              <TableCell>{el.countryCode}</TableCell>
              <TableCell>{el.usageType}</TableCell>
              <TableCell>{el.isp}</TableCell>
              <TableCell>{el.domain}</TableCell>
              <TableCell>{el.hostnames}</TableCell>
              <TableCell>{el.isTor == true ? 'True' : 'False'}</TableCell>
              <TableCell>{el.totalReports}</TableCell>
              <TableCell>
                {el.lastReportedAt !== null
                  ? new Intl.DateTimeFormat('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: '2-digit',
                    }).format(el.lastReportedAt)
                  : el.lastReportedAt}
              </TableCell>
              {/* <TableCell>{el.numDistinctUsers}</TableCell> */}
            </TableRow>
          </TableBody>
        ))}
      </Table>
    </>
  );
}
