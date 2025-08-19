import React from 'react';
import { render, screen } from '@testing-library/react';
import IocTable from '../IocTable';

// typed sample to avoid `any`
const sample: {
  sha256: string;
  sha1: string;
  md5: string;
  mcafee: string;
  engines: string;
}[] = [{ sha256: 'a', sha1: 'b', md5: 'c', mcafee: '', engines: '0 / 0' }];

test('renders IocTable rows', () => {
  render(<IocTable iocs={sample} loading={false} />);
  expect(
    screen.getByText('Una lista de tus IOCs recientes.')
  ).toBeInTheDocument();
  expect(screen.getByText('a')).toBeInTheDocument();
});
