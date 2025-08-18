import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import AbuseIpTable from '../AbuseIpTable';

const sample = [
  {
    abuseConfidenceScore: 50,
    domain: 'example.com',
    ipAddress: '1.2.3.4',
    isp: 'ISP',
    lastReportedAt: Date.now(),
    totalReports: 2,
  },
];

test('renders AbuseIpTable rows', () => {
  render(<AbuseIpTable items={sample as any} />);
  expect(screen.getByText('AbuseIPDB')).toBeInTheDocument();
  expect(screen.getByText('1.2.3.4')).toBeInTheDocument();
});
