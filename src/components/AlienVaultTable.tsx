import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IipItemAlienvault } from '@/lib/types';

export default function AlienVaultTable({
  items,
}: {
  items: IipItemAlienvault[];
}) {
  return (
    <>
      <h2 className='text-left mt-4'>
        <img alt='' src='/lib/OTX-logo-white.svg' style={{ height: '30px' }} />
        Alien Vault OTX
      </h2>
      <Table>
        <TableCaption>Una lista de tus Alien Vault OTX recientes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>#</TableHead>
            <TableHead>IpAddress</TableHead>
            <TableHead>Country Name</TableHead>
            <TableHead className='text-right'>Asn</TableHead>
            <TableHead className='text-right'>Pulse Info</TableHead>
          </TableRow>
        </TableHeader>

        {items.map((el, i) => (
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
    </>
  );
}
