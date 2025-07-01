'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
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
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

interface IipItemAbuseIp {
  abuseConfidenceScore: any;
  domain: any;
  ipAddress: any;
  isp: any;
  lastReportedAt: any;
  totalReports: any;
}
interface IipItemVirusTotal {
  reports: any;
  totalReports: any;
  ipAddress: any;
  malicious: any[];
  // isp: any;
  // lastReportedAt: any;
}
interface IipItemAlienvault {
  ipAddress: any;
  asn: any;
  countryName: any;
  pulseInfoCount: any;
  pulseInfoList: any[];
}
interface IPulseInfo {
  count: number;
  tags: any[];
  name: any;
  description: any;
  author: any;
}

export default function IpPage() {
  const [ipsAbuseIp, setIpsAbuseIp] = useState<IipItemAbuseIp[]>([]);
  const [ipsVirusTotal, setIpsVirusTotal] = useState<IipItemVirusTotal[]>([]);
  const [ipsAlienvault, setIpsAlienvault] = useState<IipItemAlienvault[]>([]);
  const [ip, setIp] = useState('');

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [textareaDisabled, setTextareaDisabled] = useState(false);
  const [show, setShow] = useState(false);

  // const proxyurl = 'https://cors-anywhere.herokuapp.com/';
  // const keyIbmXForce = '1d5e46f3-c66e-40e5-b88a-f69d7233f513'

  // csv
  // const [iocsCsv, setIocsCsv] = useState([]);
  // show component for only one IOC
  // const [showFormIp, setShowFormIp] = useState(true);
  // show component for only CSV IOC
  // const [showFormCsvIp, setShowFormCsvIp] = useState(false);
  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    // let ipItems: IipItem[] = [];
    try {
      // setIps(ipItems);
      localStorage.setItem('ipsAbuseIp', JSON.stringify(ipsAbuseIp));
      localStorage.setItem('ipsVirusTotal', JSON.stringify(ipsVirusTotal));
      localStorage.setItem('ipsAlienvault', JSON.stringify(ipsAlienvault));
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  const clearData = () => {
    handleClose();
    localStorage.clear();
    // refresh();
  };

  const save = async (ip: string) => {
    const isValidIp = validateIp(ip);
    if (!isValidIp) return;
    setButtonDisabled(true);
    setTextareaDisabled(true);

    try {
      const res = await fetch(`/api/abuseip?ip=${ip}`);
      const data = await res.json();

      // const fetchIpAbuseIp = await axios(
      //   `${proxyurl}https://api.abuseipdb.com/api/v2/check`,
      //   {
      //     // headers: { 'Key': `${process.env.REACT_APP_API_KEY_ABUSEIP}` },
      //     headers: { Key: `${process.env.NEXT_PUBLIC_ABUSEIPDB_API_KEY}` },
      //     params: {
      //       ipAddress: `${ip}`,
      //       // 'ipAddress': `36.91.140.95`,
      //     },
      //   }
      // );

      // Success 🎉
      const item: IipItemAbuseIp = {
        abuseConfidenceScore: data.data.abuseConfidenceScore,
        domain: data.data.domain,
        ipAddress: data.data.ipAddress,
        isp: data.data.isp,
        lastReportedAt: data.data.lastReportedAt,
        totalReports: data.data.totalReports,
      };

      item.lastReportedAt =
        item.lastReportedAt !== null
          ? Date.parse(data.data.lastReportedAt)
          : item.lastReportedAt;

      await submitAbuseIp(item);

      // await submit(item);
    } catch (error) {
      // Error 😨
      console.log('error', error);
    }

    try {
      let fetchIPVirusTotal = await axios(
        `https://www.virustotal.com/api/v3/ip_addresses/${ip}`,
        {
          headers: {
            'x-apiKey': `${process.env.NEXT_PUBLIC_VIRUSTOTAL_API_KEY}`,
          },
        }
      );

      let data = fetchIPVirusTotal.data.data;
      let data2 = Object.values(data.attributes.last_analysis_results);
      let lastAnalysisStats = data.attributes.last_analysis_stats;
      let malicious = data2.filter((x: any) => x.category === 'malicious');

      const item: IipItemVirusTotal = {
        reports: lastAnalysisStats.malicious,
        totalReports: data2.length,
        ipAddress: data.id,
        malicious,
      };

      await submitVirusTotalIp(item);
    } catch (error) {
      // Error 😨
      console.log('error', error);
    }

    try {
      let section = 'general';
      let fetchIPalienvault = await axios(
        `https://otx.alienvault.com/api/v1/indicators/IPv4/${ip}/${section}`
        // {
        //   headers: { 'OTX-Key': `c139efd0a176ed62add569d1fe377b61285a47a1c9541e973f6468a4079c6a51` },
        // }
      );

      let data = fetchIPalienvault.data;
      let data2 = Object.values(data.pulse_info);

      const item: IipItemAlienvault = {
        ipAddress: data.indicator,
        asn: data.asn,
        countryName: data.country_name,
        pulseInfoCount: data2[0],
        pulseInfoList: data2[1] as any[],
      };

      await submitAlienVaultIp(item);
    } catch (error) {
      // Error 😨
      console.log('error', error);
    }

    setIp('');
    setButtonDisabled(false);
    setTextareaDisabled(false);
  };

  //validar hash con regex
  const validateIp = (ip: string): boolean => {
    let isIpv4 = isIPV4(ip);
    if (isIpv4) return true;
    else return false;
  };

  const submitAbuseIp = async (item: IipItemAbuseIp) => {
    let ipItems: IipItemAbuseIp[] = [];
    let ips: any = JSON.parse(localStorage.getItem('ipsAbuseIp') || '{}'); // await axios.get('http://localhost:3000/api/v1/iocs');
    ipItems = ips;
    let isExist = ipItems.some((i) => i.ipAddress === item.ipAddress);

    if (isExist) {
      toast.info(`🤔 Ya existe la IP! ${ip} en AbuseIp`, {
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

    ipsAbuseIp.unshift(item);

    setIpsAbuseIp(ipsAbuseIp);

    // await axios;
    // .post('http://localhost:3000/api/v1/iocs', item)
    // .then((res) => console.log(res))
    // .catch((err) => console.log(err));

    refresh();
  };

  const submitVirusTotalIp = async (item: IipItemVirusTotal) => {
    let ipItems: IipItemVirusTotal[] = [];
    let ips: any = JSON.parse(localStorage.getItem('ipsVirusTotal') || '{}'); // await axios.get('http://localhost:3000/api/v1/iocs');
    ipItems = ips;
    let isExist = ipItems.some((i) => i.ipAddress === item.ipAddress);

    if (isExist) {
      toast.info(`🤔 Ya existe la IP! ${ip} en VirusTotal`, {
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

    ipsVirusTotal.unshift(item);

    setIpsVirusTotal(ipsVirusTotal);

    // await axios;
    // .post('http://localhost:3000/api/v1/iocs', item)
    // .then((res) => console.log(res))
    // .catch((err) => console.log(err));

    refresh();
  };

  const submitAlienVaultIp = async (item: IipItemAlienvault) => {
    let ipItems: IipItemAlienvault[] = [];
    let ips: any = JSON.parse(localStorage.getItem('ipsAlienvault') || '{}');
    ipItems = ips;
    let isExist = ipItems.some((i) => i.ipAddress === item.ipAddress);

    if (isExist) {
      toast.info(`🤔 Ya existe la IP! ${ip} en AlienVault`, {
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

    ipsAlienvault.unshift(item);

    setIpsAlienvault(ipsAlienvault);

    await axios;
    // .post('http://localhost:3000/api/v1/iocs', item)
    // .then((res) => console.log(res))
    // .catch((err) => console.log(err));

    refresh();
  };

  // read file
  // const readFile = () => {
  //   iocsCsv.forEach((ioc) => {
  //     save(ioc);
  //   });
  // };

  // const handleWindow = (e: any) => {
  //   if (e.target.name === 'showFormIoc') {
  //     setShowFormIoc(false);
  //     setShowFormCsvIoc(true);
  //   }
  //   if (e.target.name === 'showFormCsvIoc') {
  //     setShowFormCsvIoc(false);
  //     setShowFormIoc(true);
  //   }
  // };

  const isIPV4 = (ip: string): boolean => {
    const regexSHA256 = new RegExp(
      '^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$'
    );
    let isIpv4 = regexSHA256.test(ip);
    return isIpv4;
  };

  // const isSHA1 = (hash: string): boolean => {
  //   const regexSHA1 = new RegExp('^[a-fA-F0-9]{40}$');
  //   let isSHA1 = regexSHA1.test(hash);
  //   return isSHA1;
  // };

  // const isMD5 = (hash: string): boolean => {
  //   const regexMD5 = new RegExp('^[a-f0-9]{32}$');
  //   let isMD5 = regexMD5.test(hash);
  //   return isMD5;
  // };
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

      {/* <Dialog open={show} onOpenChange={handleClose}>
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
      </Modal> */}

      {/* navbar intern one IOC or IOCs CVS */}
      {/* <div className='mt-5 mb-3 d-flex container'>
        <div>
          {showFormIoc && (
            <Button name='showFormIoc' variant='link' onClick={handleWindow}>
              Ir a CSV archivo masivo
            </Button>
          )}
          {showFormCsvIoc && (
            <Button name='showFormCsvIoc' variant='link' onClick={handleWindow}>
              Ir a IOC uno a uno
            </Button>
          )}
        </div>
      </div> */}

      {/* Form one IOC*/}
      {/* {showFormIoc && ( */}
      <div className='container mt-2 mb-2'>
        <div>
          <p className='text-center mb-4 text-5xl font-medium tracking-tight text-gray-900 dark:text-white'>
            Ingresar IP
          </p>
          <p>Consultar IPs una a una en AbuseIPDB</p> <br />
          <div className='grid w-full gap-3'>
            <Label>
              Formatos aceptados:{' '}
              <small>
                <b>IPv4</b>
              </small>
            </Label>
            <Textarea
              onChange={(e) => setIp(e.target.value)}
              disabled={textareaDisabled}
              placeholder='Escribe tu IP aquí.'
              id='message'
              className='mt-2 mb-2'
            />
            {/* <Form.Control
            style={{ fontSize: '30px' }}
            as='textarea'
            rows={2}
            value={ip}
            size={'sm'}
            onChange={(e) => setIp(e.target.value)}
            disabled={textareaDisabled}
            /> */}
          </div>
        </div>
        <div className='text-center'>
          <Button
            className='mb-3'
            onClick={() => save(ip)}
            disabled={buttonDisabled || ip === ''}
          >
            Consultar
          </Button>
        </div>
      </div>
      {/* )} */}

      {/* Form two or more IOCs*/}
      {/* {showFormCsvIoc && (
        <UploadExcelComponent
          onFileSelectSuccess={(file: any) => setIocsCsv(file)}
          readFile={readFile}
        />
      )} */}

      {/* Data table */}
      <div className='mb-3 mr-3 d-flex justify-content-end'>
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
            ipsAbuseIp.length === 0
              ? { pointerEvents: 'none', opacity: '0.4' }
              : {}
          }
        >
          {/* <ExportExcelComponent ips={ips} /> */}
        </div>
      </div>
      <div
        className='container-fluid table-responsive'
        style={{ fontSize: '14px' }}
      >
        {/* ------------------- AbuseIp-------------- */}

        <h2 className='text-left mt-4'>
          <img
            alt=''
            src='/lib/abuseipdb-logo.svg'
            style={{ height: '40px' }}
          />
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

          {ipsAbuseIp.map((el, i) => (
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

        {/* <Table striped bordered hover size='sm'>
          <thead>
            <tr>
              <th>#</th>
              <th>IpAddress</th>
              <th>AbuseConfidenceScore</th>
              <th>Domain</th>
              <th>Isp</th>
              <th>LastReportedAt</th>
              <th>TotalReports</th>
            </tr>
          </thead>
          <tbody>
            {ipsAbuseIp.map((el, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{el.ipAddress}</td>
                <td>
                  <ProgressBar
                    animated
                    variant='warning'
                    label={`${el.abuseConfidenceScore}%`}
                    now={el.abuseConfidenceScore}
                  />
                </td>
                <td>{el.domain}</td>
                <td>{el.isp}</td>
                <td>
                  {el.lastReportedAt !== null
                    ? new Intl.DateTimeFormat('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit',
                      }).format(el.lastReportedAt)
                    : el.lastReportedAt}
                </td>
                <td>{el.totalReports}</td>
              </tr>
            ))}
          </tbody>
        </Table> */}

        {/* ------------------- Virus Total-------------- */}
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
                Security Vendors Flagged this <br /> IP Address as Malicious
              </TableHead>
              <TableHead className='text-right'>Engine Name</TableHead>
              <TableHead className='text-right'>Category</TableHead>
              <TableHead className='text-right'>LastReportedAt</TableHead>
              <TableHead className='text-right'>TotalReports</TableHead>
            </TableRow>
          </TableHeader>

          {ipsVirusTotal.map((el, i) => (
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
                <TableCell className='text-right'>{}</TableCell>
                <TableCell className='text-right'>{el.totalReports}</TableCell>
              </TableRow>
            </TableBody>
          ))}
        </Table>

        {/* <Table striped bordered hover size='sm'>
          <thead>
            <tr>
              <th>#</th>
              <th>IpAddress</th>
              <th>
                Security Vendors Flagged this <br /> IP Address as Malicious
              </th>
              <th>Engine Name</th>
              <th>Category</th>
              <th>LastReportedAt</th>
              <th>TotalReports</th>
            </tr>
          </thead>
          <tbody>
            {ipsVirusTotal.map((el, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{el.ipAddress}</td>
                <td>
                  {el.reports}/{el.totalReports}
                </td>
                <td>
                  <Table>
                    <tbody>
                      {el.malicious.map((e, l) => (
                        <tr key={l}>
                          <td>{e.engine_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </td>
                <td>
                  <Table>
                    <tbody>
                      {el.malicious.map((e, l) => (
                        <tr key={l}>
                          <td>{e.category}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </td>
                <td></td>
                <td>{el.totalReports}</td>
              </tr>
            ))}
          </tbody>
        </Table> */}

        {/* ------------------- Alien Vault-------------- */}
        <h2 className='text-left mt-4'>
          <img
            alt=''
            src='/lib/OTX-logo-white.svg'
            style={{ height: '30px' }}
          />
          Alien Vault OTX
        </h2>

        <Table>
          <TableCaption>
            Una lista de tus Alien Vault OTX recientes.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>#</TableHead>
              <TableHead>IpAddress</TableHead>
              <TableHead>Country Name</TableHead>
              <TableHead className='text-right'>Asn</TableHead>
              <TableHead className='text-right'>Pulse Info</TableHead>
            </TableRow>
          </TableHeader>

          {ipsAlienvault.map((el, i) => (
            <TableBody key={i}>
              <TableRow>
                <TableCell className='font-medium'>{i + 1}</TableCell>
                <TableCell>{el.ipAddress}</TableCell>
                <TableCell>{el.countryName}</TableCell>
                <TableCell className='text-right'>{el.asn}</TableCell>
                <TableCell className='text-right'>
                  <h6>
                    Showing{' '}
                    <span className='text-primary'>
                      {el.pulseInfoCount > 3 ? 3 : el.pulseInfoCount}
                    </span>{' '}
                    of <span className='text-danger'>{el.pulseInfoCount}</span>{' '}
                    pulses
                  </h6>
                  {el.pulseInfoCount > 3 && (
                    <Table>
                      <thead>
                        <tr>
                          <th>Author</th>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Tags</th>
                        </tr>
                      </thead>
                      {el.pulseInfoList.slice(0, 3).map((e, l) => (
                        <tbody key={l}>
                          <tr>
                            <td>{e.author.username}</td>
                            <td>{e.name}</td>
                            <td>{e.description}</td>
                            <td>{Array.from(e.tags).join(', ')}</td>
                          </tr>
                        </tbody>
                      ))}
                    </Table>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          ))}
        </Table>

        {/* <Table striped bordered hover size='sm'>
          <thead>
            <tr>
              <th>#</th>
              <th>IpAddress</th>
              <th>Country Name</th>
              <th>Asn</th>
              <th>PulseInfo Count</th>
              <th>Pulse Info</th>
            </tr>
          </thead>
          <tbody>
            {ipsAlienvault.map((el, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{el.ipAddress}</td>
                <td>{el.countryName}</td>
                <td>{el.asn}</td>
                <td>
                  <h6>
                    Showing{' '}
                    <span className='text-primary'>
                      {el.pulseInfoCount > 3 ? 3 : el.pulseInfoCount}
                    </span>{' '}
                    of <span className='text-danger'>{el.pulseInfoCount}</span>{' '}
                    pulses
                  </h6>
                  {el.pulseInfoCount > 3 && (
                    <Table>
                      <thead>
                        <tr>
                          <th>Author</th>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Tags</th>
                        </tr>
                      </thead>
                      {el.pulseInfoList.slice(0, 3).map((e, l) => (
                        <tbody key={l}>
                          <tr>
                            <td>{e.author.username}</td>
                            <td>{e.name}</td>
                            <td>{e.description}</td>
                            <td>{Array.from(e.tags).join(', ')}</td>
                          </tr>
                        </tbody>
                      ))}
                    </Table>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table> */}
      </div>
    </div>
  );
}
