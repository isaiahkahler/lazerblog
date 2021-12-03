import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'POST') {
    res.status(400).json({ error: 'only post requests accepted at this route' });
    return;
  }

  if (!('token' in req.headers)) {
    res.status(400).json({ error: "no token attached" });
    return;
  }

  try {
    const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${req.headers.token}`, {
      method: 'post'
    });

    res.status(200).json(await recaptchaResponse.json());
  } catch (error) {
    console.error(error);
    res.status(500).json(JSON.stringify(error));
  }
}
