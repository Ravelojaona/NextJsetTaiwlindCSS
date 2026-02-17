"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, Loader2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: "", name: "", password: "", confirm: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    setLoading(true)

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.username,
        name: form.name,
        password: form.password,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Erreur lors de la création du compte")
      setLoading(false)
    } else {
      router.push("/login?registered=true")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-indigo-500 p-2 rounded-xl">
            <CheckSquare className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">TaskFlow</h1>
        </div>

        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Créer un compte</CardTitle>
            <CardDescription className="text-slate-400">
              Rejoignez TaskFlow gratuitement
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Nom complet</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="john_doe"
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm" className="text-slate-300">Confirmer le mot de passe</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-indigo-500"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Création...</>
                ) : (
                  "Créer mon compte"
                )}
              </Button>
              <p className="text-slate-400 text-sm text-center">
                Déjà un compte ?{" "}
                <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                  Se connecter
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}