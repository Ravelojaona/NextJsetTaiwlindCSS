import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { TaskDetailClient } from "@/components/tasks/TaskDetailClient"

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const task = await prisma.task.findUnique({
    where: { id: params.id },
    include: {
      creator: { select: { id: true, name: true, username: true } },
      assignee: { select: { id: true, name: true, username: true } },
      tags: true,
    },
  })

  if (!task) notFound()

  // Seul le créateur ou l'assigné peut voir la tâche
  const canView =
    task.creatorId === session.user.id || task.assigneeId === session.user.id

  if (!canView) redirect("/dashboard")

  const isOwner = task.creatorId === session.user.id

  return <TaskDetailClient task={JSON.parse(JSON.stringify(task))} isOwner={isOwner} userId={session.user.id} />
}