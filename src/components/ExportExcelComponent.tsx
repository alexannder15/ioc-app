import { Button } from './ui/button';
import { unparse } from 'papaparse';

interface IiocItem {
  sha256: any;
  sha1: any;
  md5: any;
  mcafee: any;
  engines: any;
}

export default function ExportExcelComponent({ iocs }: { iocs: IiocItem[] }) {
  const handleDownload = () => {
    const csv = unparse(iocs); // Convert JSON to CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url); // Cleanup
  };

  return (
    <>
      {/* <CSVLink style={{ textDecoration: 'none', color: '#fff' }} data={iocs}> */}
      <Button onClick={handleDownload}>Descargar CSV</Button>
      {/* </CSVLink> */}
    </>
  );
}
