'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import UploadExcelComponent from '@/components/UploadExcelComponent';
import ExportExcelComponent from '@/components/ExportExcelComponent';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

interface IiocItem {
  sha256: any;
  sha1: any;
  md5: any;
  mcafee: any;
  engines: any;
}

export default function IocPage() {
  const baseUrtl = 'https://localhost:7015';
  const [iocs, setIocs] = useState<IiocItem[]>([]);
  const [ioc, setIoc] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [textareaDisabled, setTextareaDisabled] = useState(false);
  const [show, setShow] = useState(false);

  // csv
  const [iocsCsv, setIocsCsv] = useState([]);
  // show component for only one IOC
  const [showFormIoc, setShowFormIoc] = useState(true);
  // show component for only CSV IOC
  const [showFormCsvIoc, setShowFormCsvIoc] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    let iocItems: IiocItem[] = [];
    try {
      let data = await axios.get(`${baseUrtl}/api/ioc`);
      iocItems = data.data;
      setIocs(iocItems);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  const clearData = () => {
    handleClose();
    localStorage.clear();
    refresh();
  };

  const save = async (hash: string) => {
    //275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f
    const isValidHash = validateHash(hash);
    if (!isValidHash) return;
    setButtonDisabled(true);
    setTextareaDisabled(true);
    try {
      //const proxyurl = 'https://cors-anywhere.herokuapp.com/';
      const fetchIoc = await axios(
        `https://www.virustotal.com/api/v3/files/${hash}`,
        {
          headers: {
            'x-apiKey': `${process.env.NEXT_PUBLIC_VIRUSTOTAL_API_KEY}`,
          },
        }
      );

      const path = fetchIoc.data.data.attributes;
      const pathResults = fetchIoc.data.data.attributes.last_analysis_results;
      const pathStats = fetchIoc.data.data.attributes.last_analysis_stats;

      // Success 🎉
      const item: IiocItem = {
        sha256: path.sha256 ?? '',
        sha1: path.sha1 ?? '',
        md5: path.md5 ?? '',
        mcafee: pathResults.McAfee.result ?? pathResults.McAfee.category ?? '',
        engines: `${pathStats.malicious} / ${
          pathStats.malicious + pathStats.undetected
        }`,
      };

      await submit(item);
    } catch (error: any) {
      // Error 😨
      console.log('error', error);
      if (error?.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        console.log('error.response.data', error.response.data);
        console.log('error.response.status', error.response.status);
        console.log('error.response.headers', error.response.headers);
      } else if (error?.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        console.log('error.request', error.request);
      } else {
        // Something happened in setting up the request and triggered an Error
        console.log('error.message', error.message);
      }
      console.log('error', error);

      // si no existe en virus total, solo agregar a lo último
      let isSha256 = isSHA256(hash);
      let isSha1 = isSHA1(hash);
      let isMd5 = isMD5(hash);

      const item: IiocItem = {
        sha256: isSha256 ? hash : '',
        sha1: isSha1 ? hash : '',
        md5: isMd5 ? hash : '',
        mcafee: '',
        engines: '0 / 0',
      };

      await submit(item);
    }
    setIoc('');
    setButtonDisabled(false);
    setTextareaDisabled(false);
  };

  // validar hash con regex
  const validateHash = (hash: string): boolean => {
    let isSha256 = isSHA256(hash);
    let isSha1 = isSHA1(hash);
    let isMd5 = isMD5(hash);
    if (isSha256 || isSha1 || isMd5) return true;
    else return false;
  };

  const submit = async (item: IiocItem) => {
    let iocItems: IiocItem[] = [];
    let iocs = await axios.get(`${baseUrtl}/api/ioc`);
    iocItems = iocs.data;
    let isExist = iocItems.some(
      (i) =>
        i.sha256 === item.sha256 && i.sha1 === item.sha1 && i.md5 === item.md5
    );

    if (isExist) {
      toast.info(`🤔 Ya existe el Ioc! ${ioc} `, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    await axios
      .post(`${baseUrtl}/api/ioc`, item)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    refresh();
  };

  // read file
  const readFile = () => {
    iocsCsv.forEach((ioc) => {
      save(ioc);
    });
  };

  const handleWindow = (e: any) => {
    if (e.target.name === 'showFormIoc') {
      setShowFormIoc(false);
      setShowFormCsvIoc(true);
    }
    if (e.target.name === 'showFormCsvIoc') {
      setShowFormCsvIoc(false);
      setShowFormIoc(true);
    }
  };

  const isSHA256 = (hash: string): boolean => {
    const regexSHA256 = new RegExp('^[A-Fa-f0-9]{64}$');
    let isSHA256 = regexSHA256.test(hash);
    return isSHA256;
  };

  const isSHA1 = (hash: string): boolean => {
    const regexSHA1 = new RegExp('^[a-fA-F0-9]{40}$');
    let isSHA1 = regexSHA1.test(hash);
    return isSHA1;
  };

  const isMD5 = (hash: string): boolean => {
    const regexMD5 = new RegExp('^[a-f0-9]{32}$');
    let isMD5 = regexMD5.test(hash);
    return isMD5;
  };

  return (
    <div className='container mx-auto'>
      <ToastContainer />

      {/* Modal */}

      {/* <Dialog open={show} onOpenChange={setShow}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar datos</DialogTitle>
            <DialogDescription>
              Está seguro que desea eliminar los datos?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='secondary' onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant='outline' onClick={clearData}>
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* <Dialog show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>Está seguro que desea eliminar los datos?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant='primary' onClick={clearData}>
            Continuar
          </Button>
        </Modal.Footer>
      </Dialog> */}

      {/* navbar intern one IOC or IOCs CVS */}
      <div className='mt-5 mb-3 d-flex container'>
        <div>
          {showFormIoc && (
            <Button
              variant={'outline'}
              name='showFormIoc'
              onClick={handleWindow}
            >
              Ir a CSV archivo masivo
            </Button>
          )}
          {showFormCsvIoc && (
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
            <p>Consultar IOCs uno a uno en Virus Total</p> <br />
            <div className='grid w-full gap-3'>
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
              {/* <Form.Control
              style={{ fontSize: '30px' }}
              as='textarea'
              rows={2}
              value={ioc}
              size={'sm'}
              onChange={(e) => setIoc(e.target.value)}
              disabled={textareaDisabled}
            /> */}
            </div>
          </div>
          <div className='text-center'>
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

      {/* Form two or more IOCs*/}
      {showFormCsvIoc && (
        <UploadExcelComponent
          onFileSelectSuccess={(file: any) => setIocsCsv(file)}
          readFile={readFile}
        />
      )}

      {/* Data table */}
      <div className='mb-3 mr-3 d-flex justify-end'>
        <div>
          {/* <Button
            variant="danger"
            onClick={handleShow}
            disabled={iocs.length === 0}
          >
            Limpiar
          </Button> */}
        </div>
        <div
          className='ml-3'
          style={
            iocs.length === 0 ? { pointerEvents: 'none', opacity: '0.4' } : {}
          }
        >
          <ExportExcelComponent iocs={iocs} />
        </div>
      </div>
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
    </div>
  );
}
