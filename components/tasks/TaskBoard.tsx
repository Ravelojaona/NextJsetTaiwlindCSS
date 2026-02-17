"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, SortAsc, Filter } from "lucide-react"
import { TaskCard } from "./TaskCard"
import { TaskDialog } from "./TaskDialog"

interface Task {
  id: string
  name: string
  description?: string
  status: string
  dueDate?: string
  creator: { id: string; name: string; username: string }
  assignee?: { id: string; name: string; username: string }
  tags: { id: string; name: string; color: string }[]
}

export function TaskBoard({ userId }: { userId: string }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [sortBy, setSortBy] = useState("createdAt")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (statusFilter !== "ALL") params.set("status", statusFilter)
    if (search) params.set("search", search)
    params.set("sortBy", sortBy)

    const res = await fetch(`/api/tasks?${params}`)
    const data = await res.json()
    setTasks(data)
    setLoading(false)
  }, [statusFilter, search, sortBy])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleDelete = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" })
    fetchTasks()
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setDialogOpen(true)
  }

  const statusCounts = {
    ALL: tasks.length,
    TODO: tasks.filter((t) => t.status === "TODO").length,
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    DONE: tasks.filter((t) => t.status === "DONE").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: statusCounts.ALL, color: "bg-slate-700" },
          { label: "À faire", value: statusCounts.TODO, color: "bg-blue-500/20 border border-blue-500/30" },
          { label: "En cours", value: statusCounts.IN_PROGRESS, color: "bg-yellow-500/20 border border-yellow-500/30" },
          { label: "Terminé", value: statusCounts.DONE, color: "bg-green-500/20 border border-green-500/30" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-xl p-4`}>
            <p className="text-slate-400 text-sm">{stat.label}</p>
            <p className="text-white text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher une tâche..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-slate-800 border-slate-700 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="ALL" className="text-white">Tous</SelectItem>
              <SelectItem value="TODO" className="text-white">À faire</SelectItem>
              <SelectItem value="IN_PROGRESS" className="text-white">En cours</SelectItem>
              <SelectItem value="DONE" className="text-white">Terminé</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-44 bg-slate-800 border-slate-700 text-white">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="createdAt" className="text-white">Date création</SelectItem>
              <SelectItem value="dueDate" className="text-white">Date échéance</SelectItem>
              <SelectItem value="name" className="text-white">Nom</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => { setEditingTask(null); setDialogOpen(true) }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle tâche
          </Button>
        </div>
      </div>

      {/* Tasks */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg">Aucune tâche trouvée</p>
          <p className="text-slate-500 text-sm mt-1">Créez votre première tâche !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              userId={userId}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={fetchTasks}
            />
          ))}
        </div>
      )}

      <TaskDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditingTask(null) }}
        onSuccess={fetchTasks}
        task={editingTask}
      />
    </div>
  )
}