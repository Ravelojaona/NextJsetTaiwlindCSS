import { auth } from "@/auth"
import { TaskBoard } from "@/components/tasks/TaskBoard"

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Bonjour, {session?.user?.name?.split(" ")[0]} 
        </h1>
        <p className="text-slate-400 mt-1">
          Gérez vos tâches et suivez votre progression
        </p>
      </div>
      <TaskBoard userId={session?.user?.id!} />
    </div>
  )
}