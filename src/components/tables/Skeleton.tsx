import React from 'react';

export default function Skeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className='space-y-2 animate-pulse'>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className='h-6 bg-muted/30 rounded-md w-full' />
      ))}
    </div>
  );
}
