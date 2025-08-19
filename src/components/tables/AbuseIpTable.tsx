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
            <TableHead>IpAddress</TableHead>
            <TableHead>AbuseConfidenceScore</TableHead>
            <TableHead className='text-right'>Domain</TableHead>
            <TableHead className='text-right'>Isp</TableHead>
            <TableHead className='text-right'>LastReportedAt</TableHead>
            <TableHead className='text-right'>TotalReports</TableHead>
          </TableRow>
        </TableHeader>

        {items.map((el, i) => (
          <TableBody key={i}>
            <TableRow>
              <TableCell className='font-medium'>{i + 1}</TableCell>
              <TableCell>{el.ipAddress}</TableCell>
              <TableCell>
                {el.abuseConfidenceScore}%
                <Progress value={el.abuseConfidenceScore} />
              </TableCell>
              <TableCell className='text-right'>{el.domain}</TableCell>
              <TableCell className='text-right'>{el.isp}</TableCell>
              <TableCell className='text-right'>
                {el.lastReportedAt !== null
                  ? new Intl.DateTimeFormat('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: '2-digit',
                    }).format(el.lastReportedAt)
                  : el.lastReportedAt}
              </TableCell>
              <TableCell className='text-right'>{el.totalReports}</TableCell>
            </TableRow>
          </TableBody>
        ))}
      </Table>
    </>
  );
}
