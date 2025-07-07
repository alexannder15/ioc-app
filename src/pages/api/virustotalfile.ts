// pages/api/abuseip.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const hash = req.query.hash as string;

  if (!hash) {
    return res.status(400).json({ error: 'Missing hash parameter' });
  }

  try {
    const response = await fetch(
      `https://www.virustotal.com/api/v3/files/${hash}`,
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
