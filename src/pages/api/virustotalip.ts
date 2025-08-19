// pages/api/virustotalip.ts

import type { NextApiRequest, NextApiResponse } from 'next';

type VirusTotalResponse = Record<string, unknown>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VirusTotalResponse | { error: string }>
) {
  const ip = Array.isArray(req.query.ip)
    ? req.query.ip[0]
    : (req.query.ip as string | undefined);

  if (!ip) {
    return res.status(400).json({ error: 'Missing ip parameter' });
  }

  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'VIRUSTOTAL_API_KEY not configured' });
  }

  try {
    const response = await fetch(
      `https://www.virustotal.com/api/v3/ip_addresses/${encodeURIComponent(
        ip
      )}`,
      {
        headers: {
          'x-apiKey': apiKey,
          Accept: 'application/json',
        },
      }
    );

    const data = (await response.json()) as VirusTotalResponse;
    return res.status(response.status).json(data);
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
