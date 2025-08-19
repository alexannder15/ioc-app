import './globals.css';
import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
  return (
    <main className='container mx-auto min-h-svh flex flex-col items-center justify-center px-4'>
      <div className='max-w-[960px] w-full rounded-lg p-6 bg-card shadow-md'>
        <div className='flex flex-col md:flex-row items-center gap-6'>
          <div className='flex-1'>
            <h1 className='text-5xl font-medium mb-2 text-foreground'>
              IOC Analyzer
            </h1>
            <p className='text-lg text-muted-foreground mb-4'>
              Quickly analyze IPs and IOCs using VirusTotal, AbuseIPDB and
              AlienVault OTX.
            </p>

            {/* restored navigation links */}
            <div className='flex gap-3'>
              <Link
                href='/ioc'
                className='inline-block px-4 py-2 rounded-md bg-primary text-primary-foreground'
              >
                IOCs
              </Link>
              <Link
                href='/ip'
                className='inline-block px-4 py-2 rounded-md border border-input'
              >
                IPs
              </Link>
            </div>
          </div>

          <div className='w-full md:w-[420px] flex-shrink-0'>
            {/* static svg from public */}
            <Image
              src='/hero.svg'
              alt='IOC Analyzer illustration'
              className='w-full h-auto rounded-md'
            />
          </div>
        </div>
      </div>
    </main>
  );
}
