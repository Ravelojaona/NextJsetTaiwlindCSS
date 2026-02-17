import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    select: { id: true, name: true, username: true },
    orderBy: { name: "asc" },
  })

  return NextResponse.json(users)
}