'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  const baseUrtl = 'https://localhost:7015';
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
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await axios.get<IiocItem[]>(`${baseUrtl}/api/ioc`);
      setIocs(data.data ?? []);
    } catch (err) {
      console.log(err);
      setError('Error loading IOCs');
      toast.error('Error loading IOCs');
    } finally {
      setLoading(false);
    }
  };

  const save = async (hash: string) => {
    const isValidHash = isSHA256(hash) || isSHA1(hash) || isMD5(hash);
    if (!isValidHash) return;
    setButtonDisabled(true);
    setTextareaDisabled(true);

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
      toast.error('Error fetching data from VirusTotal for the hash');
      const isSha256 = isSHA256(hash);
      const isSha1 = isSHA1(hash);
      const isMd5 = isMD5(hash);

      const item: IiocItem = {
        sha256: isSha256 ? hash : '',
        sha1: isSha1 ? hash : '',
        md5: isMd5 ? hash : '',
        mcafee: '',
        engines: '0 / 0',
      };

      await submit(item);
    } finally {
      setIoc('');
      setButtonDisabled(false);
      setTextareaDisabled(false);
    }
  };

  const submit = async (item: IiocItem) => {
    try {
      const res = await axios.get<IiocItem[]>(`${baseUrtl}/api/ioc`);
      const iocItems = res.data ?? [];
      const isExist = iocItems.some(
        (i) =>
          i.sha256 === item.sha256 && i.sha1 === item.sha1 && i.md5 === item.md5
      );

      if (isExist) {
        toast.info(`🤔 Ya existe el Ioc! ${ioc}`);
        return;
      }

      await axios.post(`${baseUrtl}/api/ioc`, item);
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
            <p>Consultar IOCs uno a uno en Virus Total</p>
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
