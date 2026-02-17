import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const taskSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  dueDate: z.string().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
})

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const task = await prisma.task.findUnique({
    where: { id: params.id },
    include: {
      creator: { select: { id: true, name: true, username: true } },
      assignee: { select: { id: true, name: true, username: true } },
      tags: true,
    },
  })

  if (!task) return NextResponse.json({ error: "Introuvable" }, { status: 404 })

  return NextResponse.json(task)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const task = await prisma.task.findUnique({ where: { id: params.id } })
  if (!task) return NextResponse.json({ error: "Tâche introuvable" }, { status: 404 })
  if (task.creatorId !== session.user.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const body = await req.json()
  const parsed = taskSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 })

  const { name, description, status, dueDate, assigneeId, tags } = parsed.data

  const updated = await prisma.task.update({
    where: { id: params.id },
    data: {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(status && { status }),
      dueDate: dueDate ? new Date(dueDate) : null,
      assigneeId: assigneeId || null,
      ...(tags && {
        tags: {
          set: [],
          connectOrCreate: tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      }),
    },
    include: {
      creator: { select: { id: true, name: true, username: true } },
      assignee: { select: { id: true, name: true, username: true } },
      tags: true,
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const task = await prisma.task.findUnique({ where: { id: params.id } })
  if (!task) return NextResponse.json({ error: "Tâche introuvable" }, { status: 404 })
  if (task.creatorId !== session.user.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  await prisma.task.delete({ where: { id: params.id } })
  return NextResponse.json({ message: "Tâche supprimée" })
}