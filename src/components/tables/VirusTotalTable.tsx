import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { VirusTotalIP } from '@/lib/types';
import Image from 'next/image';

export default function VirusTotalTable({
  items = [],
}: {
  items?: VirusTotalIP[];
}) {
  // debug: helps confirm items are arriving and their shape (browser console)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // eslint-disable-next-line no-console
    console.log('VirusTotalTable items', items);
    // eslint-disable-next-line no-console
    console.debug(
      'VirusTotalTable items count',
      items?.length ?? 0,
      items?.[0]
    );
  }, [items]);

  // track which rows have details expanded
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const [rawOpenMap, setRawOpenMap] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleRaw = (id: string) =>
    setRawOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));

  // helper to format unix timestamps
  const fmtDate = (ts?: number) =>
    ts ? new Date(ts * 1000).toLocaleString() : '-';

  const renderPrimitiveList = (pairs: [string, any][]) => (
    <ul className='grid grid-cols-2 gap-x-4 gap-y-1 text-xs'>
      {pairs.map(([k, v]) => (
        <li key={k} className='flex gap-2'>
          <strong className='capitalize w-32 text-gray-700'>{k}:</strong>
          <span className='text-gray-900'>{String(v ?? '-')}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div className='flex items-center justify-between mt-6'>
        <h2 className='text-left flex items-center gap-2'>
          <Image alt='' src='/lib/vt_logo.svg' height={40} width={40} />
          Virus Total
        </h2>
      </div>

      <Table>
        <TableCaption>
          Una lista de tus Virus Total recientes. Haz click en "Details" para
          ver todo el JSON de la fila.
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className='w-[60px]'>#</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Analysis Stats</TableHead>
            <TableHead className='text-right'>Reports / Reputation</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>

        {/* single TableBody for all rows */}
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className='text-center py-6'>
                No VirusTotal data available.
              </TableCell>
            </TableRow>
          ) : (
            items.map((el, i) => {
              const key = String(el?.id ?? i);
              const stats = el?.attributes?.last_analysis_stats ?? {};
              const lastResults = el?.attributes?.last_analysis_results ?? {};
              // derive vendor list from last_analysis_results (keys usually engine names)
              const vendors = Object.entries(lastResults).map(
                ([vendorKey, res]) => ({
                  vendorKey,
                  engine_name: res?.engine_name ?? vendorKey,
                  category: res?.category ?? 'unknown',
                  result: res?.result ?? undefined,
                })
              );
              const totalVotes = el?.attributes?.total_votes;
              const reputation = el?.attributes?.reputation ?? '-';
              // general primitives to show at glance
              const generalPairs: [string, any][] = [
                ['asn', el?.attributes?.asn ?? '-'],
                ['as_owner', el?.attributes?.as_owner ?? '-'],
                ['network', el?.attributes?.network ?? '-'],
                ['country', el?.attributes?.country ?? '-'],
                ['continent', el?.attributes?.continent ?? '-'],
                [
                  'last_analysis_date',
                  fmtDate(el?.attributes?.last_analysis_date),
                ],
                [
                  'last_modification_date',
                  fmtDate(el?.attributes?.last_modification_date),
                ],
              ];

              return (
                <React.Fragment key={key}>
                  <TableRow>
                    <TableCell className='font-medium'>{i + 1}</TableCell>

                    <TableCell>{el?.id ?? '-'}</TableCell>

                    <TableCell>
                      <div className='flex flex-wrap gap-2'>
                        {Object.keys(stats).length === 0 ? (
                          <span className='text-sm text-muted-foreground'>
                            No stats
                          </span>
                        ) : (
                          Object.entries(stats).map(([k, v]) => (
                            <div
                              key={k}
                              className='text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800'
                            >
                              <strong className='capitalize mr-1'>{k}:</strong>
                              {v}
                            </div>
                          ))
                        )}
                      </div>
                    </TableCell>

                    <TableCell className='text-right'>
                      {totalVotes ? (
                        <div className='text-xs'>
                          <div>malicious: {totalVotes.malicious ?? 0}</div>
                          <div>harmless: {totalVotes.harmless ?? 0}</div>
                        </div>
                      ) : (
                        <div className='text-xs'>
                          reputation: {String(reputation)}
                        </div>
                      )}
                    </TableCell>

                    <TableCell className='text-right'>
                      <button
                        onClick={() => toggle(key)}
                        className='text-sm underline'
                        aria-expanded={!!openMap[key]}
                      >
                        {openMap[key] ? 'Hide Details' : 'Details'}
                      </button>
                    </TableCell>
                  </TableRow>

                  {openMap[key] && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                          {/* General */}
                          <div className='p-2 bg-white rounded shadow-sm'>
                            <h4 className='text-sm font-semibold mb-2'>
                              General
                            </h4>
                            {renderPrimitiveList(generalPairs)}
                            {el?.attributes?.tags &&
                              el.attributes.tags.length > 0 && (
                                <div className='mt-2 text-xs'>
                                  <strong>tags:</strong>{' '}
                                  <span>{el.attributes.tags.join(', ')}</span>
                                </div>
                              )}
                          </div>

                          {/* Analysis Stats */}
                          <div className='p-2 bg-white rounded shadow-sm'>
                            <h4 className='text-sm font-semibold mb-2'>
                              Analysis Stats
                            </h4>
                            {Object.keys(stats).length === 0 ? (
                              <div className='text-xs text-muted-foreground'>
                                No stats
                              </div>
                            ) : (
                              <ul className='text-xs'>
                                {Object.entries(stats).map(([k, v]) => (
                                  <li key={k} className='flex justify-between'>
                                    <span className='capitalize'>{k}</span>
                                    <span>{v}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          {/* Vendors */}
                          <div className='p-2 bg-white rounded shadow-sm'>
                            <h4 className='text-sm font-semibold mb-2'>
                              Vendors
                            </h4>
                            {vendors.length === 0 ? (
                              <div className='text-xs text-muted-foreground'>
                                None
                              </div>
                            ) : (
                              <div className='space-y-1 text-xs'>
                                {vendors.map((v, idx) => (
                                  <div
                                    key={idx}
                                    className='flex justify-between'
                                  >
                                    <div>
                                      <strong>{v.engine_name}</strong>
                                      <div className='text-xs text-gray-600'>
                                        {v.vendorKey}
                                      </div>
                                    </div>
                                    <div className='text-right'>
                                      <div className='text-xs'>
                                        <span className='px-2 py-0.5 rounded bg-red-100 text-red-800'>
                                          {v.category}
                                        </span>
                                      </div>
                                      {v.result && (
                                        <div className='text-xs text-gray-700'>
                                          {v.result}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* RDAP / Votes / raw JSON toggle */}
                        <div className='mt-3 grid grid-cols-1 md:grid-cols-3 gap-4'>
                          <div className='p-2 bg-white rounded shadow-sm text-xs'>
                            <h5 className='font-semibold mb-1'>RDAP</h5>
                            {el?.attributes?.rdap ? (
                              <ul>
                                <li>
                                  <strong>handle:</strong>{' '}
                                  {el.attributes.rdap.handle ?? '-'}
                                </li>
                                <li>
                                  <strong>name:</strong>{' '}
                                  {el.attributes.rdap.name ?? '-'}
                                </li>
                                <li>
                                  <strong>start:</strong>{' '}
                                  {el.attributes.rdap.start_address ?? '-'}
                                </li>
                                <li>
                                  <strong>end:</strong>{' '}
                                  {el.attributes.rdap.end_address ?? '-'}
                                </li>
                                <li>
                                  <strong>country:</strong>{' '}
                                  {el.attributes.rdap.country ?? '-'}
                                </li>
                              </ul>
                            ) : (
                              <div className='text-muted-foreground'>
                                No RDAP
                              </div>
                            )}
                          </div>

                          <div className='p-2 bg-white rounded shadow-sm text-xs'>
                            <h5 className='font-semibold mb-1'>
                              Votes / Reputation
                            </h5>
                            {totalVotes ? (
                              <ul>
                                <li>malicious: {totalVotes.malicious ?? 0}</li>
                                <li>harmless: {totalVotes.harmless ?? 0}</li>
                              </ul>
                            ) : (
                              <div>reputation: {String(reputation)}</div>
                            )}
                          </div>

                          <div className='p-2 bg-white rounded shadow-sm text-xs'>
                            <div className='flex justify-between items-center'>
                              <h5 className='font-semibold'>Raw JSON</h5>
                              <button
                                onClick={() => toggleRaw(key)}
                                className='text-xs underline'
                                aria-expanded={!!rawOpenMap[key]}
                              >
                                {rawOpenMap[key] ? 'Hide' : 'Show'}
                              </button>
                            </div>
                            {rawOpenMap[key] && (
                              <pre className='mt-2 max-h-60 overflow-auto bg-gray-50 p-2 rounded text-xs'>
                                {JSON.stringify(el, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </>
  );
}
