import { prisma } from '@/lib/db'
import { requireAdmin, hashPassword } from '@/lib/admin-auth'

export async function GET(req: Request) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    const users = await prisma.adminUser.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true, lastLoginAt: true },
      orderBy: { createdAt: 'desc' },
    })
    return Response.json({ users })
  } catch (error) {
    console.error('Admin users GET error:', error)
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    const { email, password, name, role } = await req.json()

    if (!email || !password || !name) {
      return Response.json({ error: 'Email, password, and name required' }, { status: 400 })
    }

    if (password.length < 8) {
      return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const existing = await prisma.adminUser.findUnique({ where: { email } })
    if (existing) {
      return Response.json({ error: 'Email already exists' }, { status: 409 })
    }

    const user = await prisma.adminUser.create({
      data: {
        email,
        passwordHash: hashPassword(password),
        name,
        role: role || 'editor',
      },
      select: { id: true, email: true, name: true, role: true },
    })

    return Response.json({ success: true, user }, { status: 201 })
  } catch (error) {
    console.error('Admin users POST error:', error)
    return Response.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
