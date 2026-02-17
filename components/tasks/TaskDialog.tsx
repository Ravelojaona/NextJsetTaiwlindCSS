"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Loader2 } from "lucide-react"

export function TaskDialog({ open, onClose, onSuccess, task }: any) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "TODO",
    dueDate: "",
    assigneeId: "",
    tags: [] as string[],
  })

  useEffect(() => {
    if (open) {
      fetch("/api/users").then((r) => r.json()).then(setUsers)
      if (task) {
        setForm({
          name: task.name,
          description: task.description || "",
          status: task.status,
          dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
          assigneeId: task.assignee?.id || "none",
          tags: task.tags.map((t: any) => t.name),
        })
      } else {
        setForm({ name: "", description: "", status: "TODO", dueDate: "", assigneeId: "", tags: [] })
      }
    }
  }, [open, task])

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !form.tags.includes(t)) {
      setForm({ ...form, tags: [...form.tags, t] })
    }
    setTagInput("")
  }

  const removeTag = (tag: string) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const body = {
      ...form,
      assigneeId: form.assigneeId === "none" || !form.assigneeId ? null : form.assigneeId,
      dueDate: form.dueDate || null,
    }

    const url = task ? `/api/tasks/${task.id}` : "/api/tasks"
    const method = task ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      onSuccess()
      onClose()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">
            {task ? "Modifier la tâche" : "Nouvelle tâche"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Nom *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Nom de la tâche"
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description optionnelle..."
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Statut</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, assigneeId: v === "none" ? "" : v })}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="TODO" className="text-white">À faire</SelectItem>
                  <SelectItem value="IN_PROGRESS" className="text-white">En cours</SelectItem>
                  <SelectItem value="DONE" className="text-white">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Date d'échéance</Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Assigner à</Label>
            <Select value={form.assigneeId} onValueChange={(v) => setForm({ ...form, assigneeId: v })}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Choisir un utilisateur" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="none" className="text-slate-400">Personne</SelectItem>
                {users.map((u: any) => (
                  <SelectItem key={u.id} value={u.id} className="text-white">
                    {u.name} (@{u.username})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Ajouter un tag..."
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
              />
              <Button type="button" onClick={addTag} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tags.map((tag) => (
                  <Badge key={tag} className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : task ? "Modifier" : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}