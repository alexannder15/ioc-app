// pages/api/abuseip.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ip = req.query.ip as string;

  if (!ip) {
    return res.status(400).json({ error: 'Missing IP parameter' });
  }

  try {
    const response = await fetch(
      `https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}&maxAgeInDays=90`,
      {
        headers: {
          Key: '673b76fb36714c2a41a73b11d30d91b2db2ea4d330e02aa7618a4ceff23e301e30afb0f8ddbb7d45'!,
          Accept: 'application/json',
        },
      }
    );

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
