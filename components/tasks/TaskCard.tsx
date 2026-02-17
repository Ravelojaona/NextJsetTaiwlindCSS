"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, User, Pencil, Trash2, Tag } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useRouter } from "next/navigation"

const statusConfig = {
  TODO: { label: "À faire", class: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  IN_PROGRESS: { label: "En cours", class: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
  DONE: { label: "Terminé", class: "bg-green-500/20 text-green-300 border-green-500/30" },
}

export function TaskCard({ task, userId, onEdit, onDelete, onStatusChange }: any) {
    const router = useRouter()
  const [updating, setUpdating] = useState(false)
  const isOwner = task.creator.id === userId

  const handleStatusChange = async (status: string) => {
    setUpdating(true)
    await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    setUpdating(false)
    onStatusChange()
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE"

  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-200 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3
        className="text-white font-semibold text-base leading-tight line-clamp-2 cursor-pointer hover:text-indigo-400 transition-colors"
        onClick={() => router.push(`/tasks/${task.id}`)}
        >
        {task.name}
        </h3>
          {isOwner && (
            <div className="flex gap-1 shrink-0">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit(task)}
                className="h-7 w-7 text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(task.id)}
                className="h-7 w-7 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>

        {task.description && (
          <p className="text-slate-400 text-sm line-clamp-2 mt-1">{task.description}</p>
        )}
      </CardHeader>

      <CardContent className="pb-3 flex-1 space-y-3">
        {/* Status */}
        {isOwner ? (
          <Select value={task.status} onValueChange={handleStatusChange} disabled={updating}>
            <SelectTrigger className="h-8 bg-slate-800 border-slate-700 text-sm text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="TODO" className="text-white">À faire</SelectItem>
              <SelectItem value="IN_PROGRESS" className="text-white">En cours</SelectItem>
              <SelectItem value="DONE" className="text-white">Terminé</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Badge className={statusConfig[task.status as keyof typeof statusConfig]?.class}>
            {statusConfig[task.status as keyof typeof statusConfig]?.label}
          </Badge>
        )}

        {/* Due date */}
        {task.dueDate && (
          <div className={`flex items-center gap-2 text-sm ${isOverdue ? "text-red-400" : "text-slate-400"}`}>
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(new Date(task.dueDate), "dd MMM yyyy", { locale: fr })}</span>
            {isOverdue && <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">En retard</Badge>}
          </div>
        )}

        {/* Assignee */}
        {task.assignee && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <User className="h-3.5 w-3.5" />
            <span>Assigné à <span className="text-slate-300">{task.assignee.name}</span></span>
          </div>
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag: any) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: tag.color + "33", color: tag.color, border: `1px solid ${tag.color}66` }}
              >
                <Tag className="h-2.5 w-2.5" />
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <User className="h-3 w-3" />
          <span>Créé par <span className="text-slate-400">{task.creator.name}</span></span>
        </div>
      </CardFooter>
    </Card>
  )
}