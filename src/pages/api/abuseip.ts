// pages/api/abuseip.ts

import type { NextApiRequest, NextApiResponse } from 'next';

type AbuseIpResponse = Record<string, unknown>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AbuseIpResponse | { error: string }>
) {
  const ip = Array.isArray(req.query.ip)
    ? req.query.ip[0]
    : (req.query.ip as string | undefined);

  if (!ip) {
    return res.status(400).json({ error: 'Missing IP parameter' });
  }

  const apiKey = process.env.ABUSEIPDB_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ABUSEIPDB_API_KEY not configured' });
  }

  try {
    const response = await fetch(
      `https://api.abuseipdb.com/api/v2/check?ipAddress=${encodeURIComponent(
        ip
      )}&maxAgeInDays=90`,
      {
        headers: {
          Key: apiKey,
          Accept: 'application/json',
        },
      }
    );

    const data = (await response.json()) as AbuseIpResponse;
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
