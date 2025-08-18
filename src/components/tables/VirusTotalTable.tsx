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
import { IipItemVirusTotal } from '@/lib/types';

export default function VirusTotalTable({
  items,
}: {
  items: IipItemVirusTotal[];
}) {
  return (
    <>
      <h2 className='text-left mt-4'>
        <img alt='' src='/lib/vt_logo.svg' style={{ height: '30px' }} />
        Virus Total
      </h2>
      <Table>
        <TableCaption>Una lista de tus Virus Total recientes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>#</TableHead>
            <TableHead>IpAddress</TableHead>
            <TableHead>
              Security Vendors Flagged this IP Address as Malicious
            </TableHead>
            <TableHead className='text-right'>Engine Name</TableHead>
            <TableHead className='text-right'>Category</TableHead>
            <TableHead className='text-right'>TotalReports</TableHead>
          </TableRow>
        </TableHeader>

        {items.map((el, i) => (
          <TableBody key={i}>
            <TableRow>
              <TableCell className='font-medium'>{i + 1}</TableCell>
              <TableCell>{el.ipAddress}</TableCell>
              <TableCell>
                {el.reports}/{el.totalReports}
              </TableCell>
              <TableCell className='text-right'>
                <Table>
                  <tbody>
                    {el.malicious.map((e, l) => (
                      <tr key={l}>
                        <td>{e.engine_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableCell>
              <TableCell className='text-right'>
                <Table>
                  <tbody>
                    {el.malicious.map((e, l) => (
                      <tr key={l}>
                        <td>{e.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableCell>
              <TableCell className='text-right'>{el.totalReports}</TableCell>
            </TableRow>
          </TableBody>
        ))}
      </Table>
    </>
  );
}
