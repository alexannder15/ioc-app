// pages/api/abuseip.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ip = req.query.ip as string;

  if (!ip) {
    return res.status(400).json({ error: 'Missing ip parameter' });
  }

  try {
    const response = await fetch(
      `https://www.virustotal.com/api/v3/ip_addresses/${ip}`,
      {
        headers: {
          'x-apiKey': process.env.VIRUSTOTAL_API_KEY!,
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
