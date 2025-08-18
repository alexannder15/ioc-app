import React, { useState } from 'react';
import AlertDismissibleExample from './AlertDismissibleExample';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from '@/components/ui/input';
import Papa from 'papaparse';

type OnFileSelect = (row: string[] | null) => void;

export default function UploadExcelComponent({
  onFileSelectSuccess,
  readFile,
}: {
  onFileSelectSuccess: OnFileSelect;
  readFile: () => void;
}) {
  const [disabledButton, setDisabledButton] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [alert, setAlert] = useState<boolean>(false);

  const MAX_BYTES = 1_048_576; // 1 MB

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const f = files?.[0];
    if (f) {
      if (f.size > MAX_BYTES) {
        // file too large
        setDisabledButton(true);
        setAlert(true);
      } else {
        setName(f.name);
        setDisabledButton(false);
        setAlert(false);

        Papa.parse<string[]>(f, {
          header: false,
          skipEmptyLines: true,
          complete(results: Papa.ParseResult<string[]>) {
            // return first row (array of IOC strings) or null
            const firstRow = results.data?.[0] ?? null;
            onFileSelectSuccess(firstRow);
          },
          error(err) {
            console.error('Error parsing CSV:', err);
            onFileSelectSuccess(null);
          },
        });
      }
    } else {
      onFileSelectSuccess(null);
      setDisabledButton(true);
      setName('');
    }
  };

  return (
    <>
      <div className='container mt-2 mb-2'>
        <div>
          <p className='text-center mb-4 text-5xl font-medium tracking-tight text-gray-900 dark:text-white'>
            Cargar archivo de Indicadores de Compromiso
          </p>
          <p>
            Consultar IOCs masivamente; el archivo no puede superar 1 MB.
            <a
              href='/lib/iocs-example.csv'
              download
              className='text-blue-500 hover:underline ml-1'
            >
              archivo ejemplo
            </a>
          </p>
          <br />
          <Label>
            Formato aceptado:{' '}
            <small>
              <b>.CSV</b>
            </small>
          </Label>
          <Input
            id='picture'
            type='file'
            onChange={handleFileInput}
            accept='.csv'
          />
          <div className='text-center'>
            <Button
              className='mb-3 mt-3'
              onClick={readFile}
              disabled={disabledButton}
            >
              Consultar
            </Button>
            {alert && (
              <AlertDismissibleExample errorMessage='Recuerde que el archivo no puede superar 1 MB.' />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
