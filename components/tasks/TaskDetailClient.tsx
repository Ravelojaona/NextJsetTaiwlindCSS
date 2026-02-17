"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskDialog } from "./TaskDialog"
import {
  ArrowLeft, Calendar, User, Tag, Clock,
  Pencil, Trash2, CheckCircle2, Circle, Timer
} from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const statusConfig = {
  TODO: {
    label: "À faire",
    icon: Circle,
    class: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    iconClass: "text-blue-400"
  },
  IN_PROGRESS: {
    label: "En cours",
    icon: Timer,
    class: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    iconClass: "text-yellow-400"
  },
  DONE: {
    label: "Terminé",
    icon: CheckCircle2,
    class: "bg-green-500/20 text-green-300 border-green-500/30",
    iconClass: "text-green-400"
  },
}

export function TaskDetailClient({ task, isOwner, userId }: any) {
  const router = useRouter()
  const [currentTask, setCurrentTask] = useState(task)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [updating, setUpdating] = useState(false)

  const status = statusConfig[currentTask.status as keyof typeof statusConfig]
  const StatusIcon = status.icon

  const isOverdue =
    currentTask.dueDate &&
    new Date(currentTask.dueDate) < new Date() &&
    currentTask.status !== "DONE"

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true)
    const res = await fetch(`/api/tasks/${currentTask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    const updated = await res.json()
    setCurrentTask(updated)
    setUpdating(false)
  }

  const handleDelete = async () => {
    if (!confirm("Supprimer cette tâche ?")) return
    setDeleting(true)
    await fetch(`/api/tasks/${currentTask.id}`, { method: "DELETE" })
    router.push("/dashboard")
  }

  const handleEditSuccess = async () => {
    const res = await fetch(`/api/tasks/${currentTask.id}`)
    // Re-fetch via API tasks list
    router.refresh()
    setDialogOpen(false)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="text-slate-400 hover:text-white hover:bg-slate-800 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>

      {/* Main Card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        {/* Top bar color selon statut */}
        <div
          className={`h-1.5 w-full ${
            currentTask.status === "DONE"
              ? "bg-green-500"
              : currentTask.status === "IN_PROGRESS"
              ? "bg-yellow-500"
              : "bg-blue-500"
          }`}
        />

        <div className="p-6 space-y-6">
          {/* Title + Actions */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <StatusIcon className={`h-6 w-6 mt-0.5 shrink-0 ${status.iconClass}`} />
              <h1 className="text-2xl font-bold text-white leading-tight">
                {currentTask.name}
              </h1>
            </div>

            {isOwner && (
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDialogOpen(true)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deleting ? "..." : "Supprimer"}
                </Button>
              </div>
            )}
          </div>

          {/* Description */}
          {currentTask.description && (
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {currentTask.description}
              </p>
            </div>
          )}

          {/* Status Selector */}
          <div className="space-y-2">
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Statut</p>
            {isOwner ? (
              <Select
                value={currentTask.status}
                onValueChange={handleStatusChange}
                disabled={updating}
              >
                <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="TODO" className="text-white">
                    <div className="flex items-center gap-2">
                      <Circle className="h-4 w-4 text-blue-400" /> À faire
                    </div>
                  </SelectItem>
                  <SelectItem value="IN_PROGRESS" className="text-white">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-yellow-400" /> En cours
                    </div>
                  </SelectItem>
                  <SelectItem value="DONE" className="text-white">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" /> Terminé
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge className={status.class}>{status.label}</Badge>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Due Date */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Calendar className="h-4 w-4" />
                <span>Date d'échéance</span>
              </div>
              {currentTask.dueDate ? (
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium">
                    {format(new Date(currentTask.dueDate), "dd MMMM yyyy", { locale: fr })}
                  </p>
                  {isOverdue && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                      En retard
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-slate-500">Non définie</p>
              )}
            </div>

            {/* Assignee */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <User className="h-4 w-4" />
                <span>Assigné à</span>
              </div>
              {currentTask.assignee ? (
                <div>
                  <p className="text-white font-medium">{currentTask.assignee.name}</p>
                  <p className="text-slate-400 text-sm">@{currentTask.assignee.username}</p>
                </div>
              ) : (
                <p className="text-slate-500">Personne</p>
              )}
            </div>

            {/* Creator */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <User className="h-4 w-4" />
                <span>Créé par</span>
              </div>
              <div>
                <p className="text-white font-medium">{currentTask.creator.name}</p>
                <p className="text-slate-400 text-sm">@{currentTask.creator.username}</p>
              </div>
            </div>

            {/* Created at */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Clock className="h-4 w-4" />
                <span>Créé le</span>
              </div>
              <p className="text-white font-medium">
                {format(new Date(currentTask.createdAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
              </p>
            </div>
          </div>

          {/* Tags */}
          {currentTask.tags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Tag className="h-4 w-4" />
                <span className="font-medium uppercase tracking-wide">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentTask.tags.map((tag: any) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: tag.color + "22",
                      color: tag.color,
                      border: `1px solid ${tag.color}55`,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <TaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleEditSuccess}
        task={currentTask}
      />
    </div>
  )
}