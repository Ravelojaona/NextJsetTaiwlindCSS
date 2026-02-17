import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const taskSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  dueDate: z.string().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
})

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const search = searchParams.get("search")
  const sortBy = searchParams.get("sortBy") || "createdAt"
  const sortOrder = searchParams.get("sortOrder") || "desc"

  const where: any = {
    OR: [
      { creatorId: session.user.id },
      { assigneeId: session.user.id },
    ],
  }

  if (status) where.status = status
  if (search) {
    where.AND = [{ name: { contains: search } }]
  }

  const tasks = await prisma.task.findMany({
    where,
    include: {
      creator: { select: { id: true, name: true, username: true } },
      assignee: { select: { id: true, name: true, username: true } },
      tags: true,
    },
    orderBy: { [sortBy]: sortOrder },
  })

  return NextResponse.json(tasks)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = taskSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 })
    }

    const { name, description, status, dueDate, assigneeId, tags } = parsed.data

    const task = await prisma.task.create({
      data: {
        name,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        creatorId: session.user.id,
        assigneeId: assigneeId || null,
        tags: tags?.length
          ? {
              connectOrCreate: tags.map((tag) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            }
          : undefined,
      },
      include: {
        creator: { select: { id: true, name: true, username: true } },
        assignee: { select: { id: true, name: true, username: true } },
        tags: true,
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}