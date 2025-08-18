import { Button } from './ui/button';
import { unparse } from 'papaparse';
import { IiocItem } from '@/lib/types';

export default function ExportExcelComponent({ iocs }: { iocs: IiocItem[] }) {
  const handleDownload = () => {
    // ensure stable ordering and string values
    const data = iocs.map((row) => ({
      sha256: String(row.sha256 ?? ''),
      sha1: String(row.sha1 ?? ''),
      md5: String(row.md5 ?? ''),
      mcafee: String(row.mcafee ?? ''),
      engines: String(row.engines ?? ''),
    }));

    const csv = unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'iocs.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return <Button onClick={handleDownload}>Descargar CSV</Button>;
}
