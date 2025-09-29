import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlienVaultIP } from '@/lib/types';
import Image from 'next/image';

export default function AlienVaultTable({
  items = [],
}: {
  items?: AlienVaultIP[];
}) {
  const [rawOpen, setRawOpen] = useState<Record<number, boolean>>({});

  return (
    <>
      <div className='flex items-center justify-between mt-6'>
        <h2 className='text-left flex items-center gap-2'>
          <Image alt='' src='/lib/OTX-logo-white.svg' height={40} width={40} />
          Alien Vault OTX
        </h2>
      </div>

      <Table>
        <TableCaption>Una lista de tus Alien Vault OTX recientes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>#</TableHead>
            <TableHead>IpAddress</TableHead>
            <TableHead>Country Name</TableHead>
            <TableHead>Asn</TableHead>
            <TableHead>Pulse Info</TableHead>
          </TableRow>
        </TableHeader>

        {items.map((el, i) => {
          const pcount =
            (el as any)?.pulseInfoCount ?? // eslint-disable-line
            (el as any)?.pulse_info?.count ?? // eslint-disable-line
            (el as any)?.pulse_info?.pulses?.length ?? // eslint-disable-line
            0;
          const pulsesList =
            (el as any)?.pulseInfoList ?? (el as any)?.pulse_info?.pulses ?? []; // eslint-disable-line

          return (
            <React.Fragment key={i}>
              <TableBody>
                <TableRow>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    {
                      (el as any)?.ipAddress ?? (el as any)?.indicator ?? '-' // eslint-disable-line
                    }
                  </TableCell>
                  <TableCell>
                    {el?.country_name ??
                      el?.country_name ??
                      el?.country_code ??
                      '-'}
                  </TableCell>
                  <TableCell>{el?.asn ?? '-'}</TableCell>
                  <TableCell>
                    <h6>
                      Showing{' '}
                      <span className='text-primary'>
                        {pulsesList.length > 3 ? 3 : pulsesList.length}
                      </span>{' '}
                      of <span className='text-danger'>{pcount}</span> pulses
                    </h6>

                    {pulsesList && pulsesList.length > 0 && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Author</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Tags</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pulsesList.slice(0, 3).map(
                            (
                              e: any, // eslint-disable-line
                              l: number
                            ) => (
                              <TableRow key={l}>
                                <TableCell>
                                  {e?.author?.username ?? e?.author}
                                </TableCell>
                                <TableCell>{e?.name ?? '-'}</TableCell>
                                <TableCell className='max-w-[320px] truncate'>
                                  {' '}
                                  {e?.description ?? '-'}
                                </TableCell>
                                <TableCell>
                                  {Array.isArray(e?.tags)
                                    ? e.tags.join(', ')
                                    : String(e?.tags ?? '-')}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>

              {/* raw JSON row */}
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} className='text-right py-2'>
                    <button
                      className='text-xs underline'
                      onClick={() => setRawOpen((s) => ({ ...s, [i]: !s[i] }))}
                    >
                      {rawOpen[i] ? 'Hide raw JSON' : 'Show raw JSON'}
                    </button>
                  </TableCell>
                </TableRow>
                {rawOpen[i] && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <pre className='max-h-60 overflow-auto bg-gray-50 p-3 rounded text-xs'>
                        {JSON.stringify(el, null, 2)}
                      </pre>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </React.Fragment>
          );
        })}
      </Table>
    </>
  );
}
