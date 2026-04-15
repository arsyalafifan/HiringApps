'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'

const menus = [
  { label: 'Profil', href: '/profile', exact: true },
  { label: 'Pendidikan', href: '/profile/pendidikan' },
  { label: 'Pengalaman', href: '/profile/pengalaman' },
  { label: 'Keahlian', href: '/profile/keahlian' },
  { label: 'Organisasi', href: '/profile/organisasi' },
  { label: 'Lampiran', href: '/profile/lampiran' },
  { label: 'Lamaran', href: '/profile/lamaran' },
  { label: 'Undangan', href: '/profile/undangan' },
  { label: 'Tanggapan / Kendala', href: '/profile/tanggapan' },
]

const ProfileSidebar = () => {
  const pathname = usePathname()
  const { user, loading, photo, setPhoto } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const token = localStorage.getItem("token")

    const formData = new FormData()
    formData.append("photo", file)

    try {
      const res = await fetch("http://localhost:8000/api/profile/upload-photo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      const data = await res.json()

      if (!res.ok || !data.status) {
        throw new Error(data.message)
      }

      setPhoto(data.url)

    } catch (err) {
      console.error(err)
      alert("Upload failed")
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-3 border-b pb-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer" 
              onClick={() => document.getElementById('upload-photo')?.click()}>
          <Image
            src={photo || "/images/avatar.png"}
            alt="avatar"
            fill
            className="object-cover"
          />
          <input
            type="file"
            accept="image/*"
            id="upload-photo"
            className="hidden"
            onChange={handleUpload}
          />
        </div>
        <p className="font-semibold text-center">
          {loading ? 'Loading...' : user?.AccountName}
        </p>
        <span className="text-sm text-primary cursor-pointer">
          Klik gambar untuk ubah
        </span>
      </div>

      {/* Menu */}
      <ul className="mt-6 space-y-2">
        {menus.map((menu) => {
          // const isActive = menu.exact
          //           ? pathname === menu.href
          //           : pathname === menu.href || pathname.startsWith(menu.href + '/')

          const isActive =
            menu.href === '/profile'
              ? pathname === '/profile' || pathname === '/profile/'
              : pathname === menu.href || pathname.startsWith(menu.href + '/')

          return (
            <li key={menu.href}>
              <Link
                href={menu.href}
                className={`block px-4 py-2 rounded-lg transition ${
                  isActive
                    ? 'bg-primary text-white font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {menu.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ProfileSidebar
