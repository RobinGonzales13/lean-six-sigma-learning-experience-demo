type PagesEnvironment = {
  SITE_PASSWORD?: string
}

type PagesContext = {
  request: Request
  env: PagesEnvironment
  next: () => Promise<Response>
}

const encoder = new TextEncoder()

function passwordFromHeader(header: string | null): string | null {
  if (!header?.startsWith('Basic ')) return null

  try {
    const binary = atob(header.slice(6))
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
    const credentials = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    const separator = credentials.indexOf(':')
    return separator < 0 ? null : credentials.slice(separator + 1)
  } catch {
    return null
  }
}

async function passwordsMatch(candidate: string, expected: string): Promise<boolean> {
  const [candidateHash, expectedHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(candidate)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ])
  const candidateBytes = new Uint8Array(candidateHash)
  const expectedBytes = new Uint8Array(expectedHash)
  let difference = 0

  for (let index = 0; index < candidateBytes.length; index += 1) {
    difference |= candidateBytes[index] ^ expectedBytes[index]
  }

  return difference === 0
}

export async function onRequest({ request, env, next }: PagesContext): Promise<Response> {
  const expectedPassword = env.SITE_PASSWORD
  if (!expectedPassword) {
    return new Response('Site access is not configured.', {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    })
  }

  const candidate = passwordFromHeader(request.headers.get('Authorization'))
  if (candidate !== null && await passwordsMatch(candidate, expectedPassword)) {
    return next()
  }

  return new Response('Password required.', {
    status: 401,
    headers: {
      'Cache-Control': 'no-store',
      'WWW-Authenticate': 'Basic realm="Lean Six Sigma Training", charset="UTF-8"',
    },
  })
}
