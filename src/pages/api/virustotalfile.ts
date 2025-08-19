import type { NextApiRequest, NextApiResponse } from 'next';

type VirusTotalResponse = Record<string, unknown>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VirusTotalResponse | { error: string }>
) {
  const hash = Array.isArray(req.query.hash)
    ? req.query.hash[0]
    : (req.query.hash as string | undefined);

  if (!hash) {
    return res.status(400).json({ error: 'Missing hash parameter' });
  }

  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'VIRUSTOTAL_API_KEY not configured' });
  }

  try {
    const response = await fetch(
      `https://www.virustotal.com/api/v3/files/${encodeURIComponent(hash)}`,
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
