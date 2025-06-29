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
          Key: process.env.ABUSEIPDB_API_KEY!,
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
