import { verifyApiKey, verifyEmailPassword, getAdminCookieOptions, getClearCookieHeader, createUserSessionToken } from '@/lib/admin-auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { apiKey, email, password } = body

    // API key login (legacy/admin)
    if (apiKey) {
      if (!verifyApiKey(apiKey)) {
        return Response.json({ error: 'Invalid API key' }, { status: 401 })
      }
      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': getAdminCookieOptions(),
          },
        }
      )
    }

    // Email/password login
    if (email && password) {
      const userId = await verifyEmailPassword(email, password)
      if (!userId) {
        return Response.json({ error: 'Invalid email or password' }, { status: 401 })
      }
      const token = createUserSessionToken(userId)
      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': getAdminCookieOptions(token),
          },
        }
      )
    }

    return Response.json({ error: 'API key or email/password required' }, { status: 400 })
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE() {
  return new Response(
    JSON.stringify({ success: true }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': getClearCookieHeader(),
      },
    }
  )
}
