'use client';

import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import UploadExcelComponent from '@/components/UploadExcelComponent';
import ExportExcelComponent from '@/components/ExportExcelComponent';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { IiocItem, VTFileResponse, VTFileAttributes } from '@/lib/types';
import { getVTFile } from '@/lib/api';
import IocTable from '@/components/tables/IocTable';

export default function IocPage() {
  const [iocs, setIocs] = useState<IiocItem[]>([]);
  const [ioc, setIoc] = useState<string>('');
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [textareaDisabled, setTextareaDisabled] = useState<boolean>(false);

  const [iocsCsv, setIocsCsv] = useState<string[]>([]);
  const [showFormIoc, setShowFormIoc] = useState<boolean>(true);
  const [showFormCsvIoc, setShowFormCsvIoc] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // hydrate from localStorage on mount
    try {
      const storedIocs = JSON.parse(
        localStorage.getItem('iocs') ?? '[]'
      ) as IiocItem[];
      setIocs(storedIocs);
    } catch (err) {
      console.log('hydrate error', err);
    }
  }, []);

  const refresh = async () => {
    try {
      localStorage.setItem('iocs', JSON.stringify(iocs));
    } catch (error) {
      console.log(error);
    }
  };

  const save = async (hash: string) => {
    const isValidHash = isSHA256(hash) || isSHA1(hash) || isMD5(hash);
    if (!isValidHash) return;
    setButtonDisabled(true);
    setTextareaDisabled(true);
    setLoading(true);
    setError(null);

    try {
      const data = (await getVTFile(hash)) as VTFileResponse;
      const path = (data.data?.attributes ??
        ({} as VTFileAttributes)) as VTFileAttributes;
      const pathResults = path.last_analysis_results ?? {};
      const pathStats = path.last_analysis_stats ?? {};

      const mcafee =
        pathResults['McAfeeD']?.result ??
        pathResults['McAfee']?.result ??
        pathResults['McAfeeD']?.category ??
        pathResults['McAfee']?.category ??
        '';

      const item: IiocItem = {
        sha256: String(path.sha256 ?? ''),
        sha1: String(path.sha1 ?? ''),
        md5: String(path.md5 ?? ''),
        mcafee: String(mcafee),
        engines: `${Number(pathStats.malicious ?? 0)} / ${Number(
          (pathStats.malicious ?? 0) + (pathStats.undetected ?? 0)
        )}`,
      };

      await submit(item);
    } catch (err) {
      console.log('error', err);
      setError((prev) =>
        prev ? `${prev}; VT error` : 'Error fetching VirusTotal Hash'
      );
      toast.error('Error fetching data from VirusTotal for the hash');
    } finally {
      setIoc('');
      setButtonDisabled(false);
      setTextareaDisabled(false);
      setLoading(false);
    }
  };

  const submit = async (item: IiocItem) => {
    try {
      const stored = JSON.parse(
        localStorage.getItem('iocs') ?? '[]'
      ) as IiocItem[];
      const isExist = stored.some(
        (i) =>
          i.md5 === item.md5 || i.sha1 === item.sha1 || i.sha256 === item.sha256
      );

      if (isExist) {
        toast.info(`🤔 Ya existe el Ioc! ${ioc}`);
        return;
      }

      setIocs((prev) => [item, ...prev]);
      refresh();
    } catch (err) {
      console.log(err);
      toast.error('Error saving IOC');
    }
  };

  const readFile = () => {
    iocsCsv.forEach((row) => {
      save(row);
    });
  };

  const handleWindow = (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = (e.currentTarget as HTMLButtonElement).name;
    if (name === 'showFormIoc') {
      setShowFormIoc(false);
      setShowFormCsvIoc(true);
    } else if (name === 'showFormCsvIoc') {
      setShowFormCsvIoc(false);
      setShowFormIoc(true);
    }
  };

  const isSHA256 = (hash: string): boolean => /^[A-Fa-f0-9]{64}$/.test(hash);
  const isSHA1 = (hash: string): boolean => /^[a-fA-F0-9]{40}$/.test(hash);
  const isMD5 = (hash: string): boolean => /^[a-f0-9]{32}$/.test(hash);

  return (
    <div className='container mx-auto'>
      <ToastContainer />

      {/* navbar intern one IOC or IOCs CVS */}
      <div className='mt-5 mb-3 d-flex container'>
        <div>
          {showFormIoc ? (
            <Button
              variant={'outline'}
              name='showFormIoc'
              onClick={handleWindow}
            >
              Ir a CSV archivo masivo
            </Button>
          ) : (
            <Button
              variant={'outline'}
              name='showFormCsvIoc'
              onClick={handleWindow}
            >
              Ir a IOC uno a uno
            </Button>
          )}
        </div>
      </div>

      {/* Form one IOC*/}
      {showFormIoc && (
        <div className='container mt-2 mb-2'>
          <div>
            <p className='text-center mb-4 text-5xl font-medium tracking-tight text-gray-900 dark:text-white'>
              Ingresar Indicador de Compromiso
            </p>
            <p>Consultar HASH uno a uno en Virus Total</p>
            <div className='grid w-full gap-3 mt-4'>
              <Label>
                Formatos aceptados:{' '}
                <small>
                  <b>SHA256, MD5 & SHA-1</b>
                </small>
              </Label>
              <Textarea
                onChange={(e) => setIoc(e.target.value)}
                disabled={textareaDisabled}
                placeholder='Escribe tu IOC aquí.'
                id='message'
                className='mt-2 mb-2'
              />
            </div>
          </div>
          <div className='text-center mt-4'>
            <Button
              className='mb-3'
              onClick={() => save(ioc)}
              disabled={buttonDisabled || ioc === ''}
            >
              Consultar
            </Button>
          </div>
        </div>
      )}

      {/* Form two or more IOCs */}
      {showFormCsvIoc && (
        <UploadExcelComponent
          onFileSelectSuccess={(file) => setIocsCsv(file ?? [])}
          readFile={readFile}
        />
      )}

      <div className='mb-3 mr-3 d-flex justify-end'>
        <div
          className='ml-3'
          style={
            iocs.length === 0 ? { pointerEvents: 'none', opacity: '0.4' } : {}
          }
        >
          <ExportExcelComponent iocs={iocs} />
        </div>
      </div>
      <IocTable iocs={iocs} loading={loading} error={error} />
    </div>
  );
}
