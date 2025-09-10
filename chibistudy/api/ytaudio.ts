import type { VercelRequest, VercelResponse } from '@vercel/node'
import ytdl from 'ytdl-core'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url = (req.query.url as string) || ''
    if (!url || !ytdl.validateURL(url)) {
      res.status(400).json({ error: 'invalid_url' })
      return
    }
    const info = await ytdl.getInfo(url)
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' })
    if (!format || !format.url) {
      res.status(500).json({ error: 'no_audio_format' })
      return
    }
    // Redirect to the audio stream URL (signed URL by YouTube)
    res.setHeader('Cache-Control', 'private, max-age=60')
    res.status(302).setHeader('Location', format.url)
    res.end()
  } catch (e: any) {
    res.status(500).json({ error: 'server_error', message: e?.message || 'unknown' })
  }
}

