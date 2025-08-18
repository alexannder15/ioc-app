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
import { IiocItem } from '@/lib/types';
import AlertDismissibleExample from '@/components/AlertDismissibleExample';
import Skeleton from './Skeleton';

export default function IocTable({
  iocs,
  loading,
  error,
}: {
  iocs: IiocItem[];
  loading: boolean;
  error?: string | null;
}) {
  if (loading) {
    return <Skeleton rows={6} />;
  }

  return (
    <>
      {error && <AlertDismissibleExample errorMessage={error} />}

      <div
        className='container-fluid overflow-x-auto'
        style={{ fontSize: '14px' }}
      >
        <Table>
          <TableCaption>Una lista de tus IOCs recientes.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>#</TableHead>
              <TableHead>SHA256</TableHead>
              <TableHead>SHA-1</TableHead>
              <TableHead className='text-right'>MD5</TableHead>
              <TableHead className='text-right'>McAfee</TableHead>
              <TableHead className='text-right'>Motores</TableHead>
            </TableRow>
          </TableHeader>

          {iocs.map((el, i) => (
            <TableBody key={i}>
              <TableRow>
                <TableCell className='font-medium'>{i + 1}</TableCell>
                <TableCell>{el.sha256}</TableCell>
                <TableCell>{el.sha1}</TableCell>
                <TableCell className='text-right'>{el.md5}</TableCell>
                <TableCell className='text-right'>{el.mcafee}</TableCell>
                <TableCell className='text-right'>{el.engines}</TableCell>
              </TableRow>
            </TableBody>
          ))}
        </Table>
      </div>
    </>
  );
}
