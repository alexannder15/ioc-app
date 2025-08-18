import React from 'react';
import { render, screen } from '@testing-library/react';
import IocTable from '../IocTable';

const sample = [
  { sha256: 'a', sha1: 'b', md5: 'c', mcafee: '', engines: '0 / 0' },
];

test('renders IocTable rows', () => {
  render(<IocTable iocs={sample as any} loading={false} />);
  expect(
    screen.getByText('Una lista de tus IOCs recientes.')
  ).toBeInTheDocument();
  expect(screen.getByText('a')).toBeInTheDocument();
});
