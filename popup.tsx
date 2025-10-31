import { useState, useEffect } from "react"
import { supabase } from "~lib/supabase"
import { Button } from "~components/ui/button"
import { Input } from "~components/ui/input"
import { Label } from "~components/ui/label"

import "~style.css"

function IndexPopup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("Signed in successfully!")
    }
    setLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("Check your email for the confirmation link!")
    }
    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setMessage("Signed out successfully!")
  }

  if (user) {
    return (
      <div className="w-[350px] p-6">
        <h2 className="text-2xl font-bold mb-4">Nimbus</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Welcome, {user.email}!
        </p>
        <p className="text-sm mb-4">
          You're now authenticated. The extension will work on Salesforce Lightning pages.
        </p>
        <Button onClick={handleSignOut} variant="outline" className="w-full">
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="w-[350px] p-6">
      <h2 className="text-2xl font-bold mb-2">Nimbus</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Sign in to use on Salesforce Lightning
      </p>
      
      {message && (
        <div className="mb-4 p-3 text-sm rounded-md bg-secondary text-secondary-foreground">
          {message}
        </div>
      )}

      <form onSubmit={handleSignIn} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Loading..." : "Sign In"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={handleSignUp}
            className="flex-1">
            Sign Up
          </Button>
        </div>
      </form>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Configure your Supabase credentials in .env.local
      </p>
    </div>
  )
}

export default IndexPopup
