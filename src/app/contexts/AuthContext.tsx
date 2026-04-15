'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type User = {
  ID: number
  AccountName: string
  Email: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  photo: string | null
  setPhoto: (url: string | null) => void
  loading: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [photo, setPhoto] = useState<string | null>(null)

  // 🔥 Load token dari localStorage saat pertama render
  useEffect(() => {
    const storedToken = localStorage.getItem('token')

    if (storedToken) {
      setToken(storedToken)
      fetchProfile(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  // 🔥 Fetch user dari API
  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch('http://localhost:8000/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (res.ok && data.status) {
        setUser(data.data.account)
        setPhoto(data.data.photo || null)
      } else {
        logout()
      }
    } catch (err) {
      console.error('Auth fetch error:', err)
      logout()
    } finally {
      setLoading(false)
    }
  }

  // 🔥 Login handler
  const login = (newToken: string) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    fetchProfile(newToken)
  }

  // 🔥 Logout handler
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setToken(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, photo, setPhoto, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 🔥 Hook helper
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}