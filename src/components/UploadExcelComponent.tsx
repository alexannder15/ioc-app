import React, { useState } from 'react';
import AlertDismissibleExample from './AlertDismissibleExample';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from '@/components/ui/input';
import Papa from 'papaparse';

export default function UploadExcelComponent({
  onFileSelectSuccess,
  readFile,
}: {
  onFileSelectSuccess: any;
  readFile: any;
}) {
  const [disabledButton, setDisabledButton] = useState(true);
  const [name, setName] = useState('');
  const [alert, setAlert] = useState(false);

  const handleFileInput = (e: any) => {
    var files = e.target.files,
      f = files[0];
    if (f) {
      if (f.size > 1024) {
        // 1 mb in Bites
        setDisabledButton(true);
        setAlert(true);
      } else {
        setName(f.name);
        setDisabledButton(false);

        Papa.parse(f, {
          header: false, // set to true if your CSV has headers
          skipEmptyLines: true,
          complete: function (results: Papa.ParseResult<any>) {
            // results.data is an array of arrays (or objects if header: true)
            onFileSelectSuccess(results.data[0]);
          },
          error: function (error) {
            console.error('Error parsing CSV:', error);
            onFileSelectSuccess(null);
          },
        });

        // var reader = new FileReader();
        // reader.onload = function (e: any) {
        //   var data = e.target.result;
        //   let readedData = XLSX.read(data, { type: 'binary' });
        //   const wsname = readedData.SheetNames[0];
        //   console.log('wsname', wsname);
        //   const ws = readedData.Sheets[wsname];
        //   console.log('ws', ws);

        //   /* Convert array to json*/
        //   const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
        //   console.log('dataParse', dataParse[0]);
        //   onFileSelectSuccess(dataParse[0]);
        // };
        // reader.readAsBinaryString(f);
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
            Consultar IOCs masivamente; el archivo no puede superar 1024 bytes.
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
              <AlertDismissibleExample errorMessage='Recuerde que el archivo no puede superar 1024 bytes.' />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
