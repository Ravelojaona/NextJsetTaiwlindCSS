import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { signOut } from "@/auth"
import { CheckSquare, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500 p-1.5 rounded-lg">
                <CheckSquare className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">To-Do List App</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-300">
                <div className="bg-slate-700 p-1.5 rounded-full">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{session.user?.name}</span>
              </div>

              <form
                action={async () => {
                  "use server"
                  await signOut({ redirectTo: "/login" })
                }}
              >
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}