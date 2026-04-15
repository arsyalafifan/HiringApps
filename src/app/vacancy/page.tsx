'use client'

import { useEffect, useState } from 'react'
import VacancyDetail from '../components/Vacancy/VacancyDetail'
import { useRouter } from 'next/navigation'
import Swal from "sweetalert2"

type Vacancy = {
  vacID: number
  vacTitle: string
  vacNote: string
  vacJobDesc: string
  DatePublish: string
  DateClose: string
}

export default function VacancyPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [selected, setSelected] = useState<Vacancy | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [applied, setApplied] = useState(false)
  const router = useRouter()
  const [filtered, setFiltered] = useState<Vacancy[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchVacancies()
  }, [])

  useEffect(() => {
    const checkApplied = async () => {
        const token = localStorage.getItem("token")
        if (!token || !selected) return

        try {
        const res = await fetch(
            `http://localhost:8000/api/vacancy/check-applied?vacID=${selected.vacID}`,
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
        )

        const data = await res.json()

        if (data.status) {
            setApplied(data.applied)
        }
        } catch (err) {
        console.error(err)
        }
    }

    checkApplied()
    }, [selected])

    // 🔍 SEARCH FILTER
    useEffect(() => {
        const keyword = search.toLowerCase()

        const result = vacancies.filter((v) =>
        v.vacTitle.toLowerCase().includes(keyword) ||
        v.vacJobDesc.toLowerCase().includes(keyword) ||
        v.vacNote.toLowerCase().includes(keyword)
        )

        setFiltered(result)
    }, [search, vacancies])

  const fetchVacancies = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/vacancy')
      const data = await res.json()

      if (data.status) {
        setVacancies(data.data)
        setFiltered(data.data)
        setSelected(data.data[0]) // default pilih pertama
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSelect = (vac: Vacancy) => {
    if (window.innerWidth < 768) {
        setSelected(vac)
        setOpenModal(true)
    } else {
        setSelected(vac)
    }
  }

  const handleApply = async () => {
    const token = localStorage.getItem("token")

    // ❌ BELUM LOGIN
    if (!token) {
        await Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Silakan login terlebih dahulu",
        confirmButtonText: "Login"
        })

        router.push("/login")
        return
    }

    // 🔥 CONFIRMATION
    const confirm = await Swal.fire({
        title: "Apply Job?",
        text: "Apakah Anda yakin ingin melamar posisi ini?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Apply",
        cancelButtonText: "Batal",
        confirmButtonColor: "#2563eb",
        cancelButtonColor: "#6b7280"
    })

    if (!confirm.isConfirmed) return

    // 🔄 LOADING
    Swal.fire({
        title: "Processing...",
        text: "Sedang mengirim lamaran",
        allowOutsideClick: false,
        didOpen: () => {
        Swal.showLoading()
        }
    })

    try {
        const res = await fetch("http://localhost:8000/api/vacancy/apply", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            VacID: selected?.vacID
        })
        })

        const data = await res.json()

        if (!res.ok || !data.status) {
        throw new Error(data.message)
        }

        // ✅ SUCCESS
        Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Lamaran berhasil dikirim",
            confirmButtonColor: "#2563eb"
        });
        setApplied(true)

    } catch (err: unknown) {
        // ❌ ERROR
        Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err instanceof Error ? err.message : "Terjadi kesalahan"
        })
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] bg-gray-100 p-4 gap-4 pt-24">

      {/* LEFT SIDE */}
      <div className="md:w-1/3 w-full bg-white rounded-xl shadow-sm p-3 space-y-3 overflow-y-auto">

        <div className="p-4 border-b font-semibold text-gray-700">
            Vacancy
        </div>

        <div className="mb-10 flex justify-center">
          <input
            type="text"
            placeholder="Cari pekerjaan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-full px-5 py-3 rounded-lg border focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        {filtered.map((vac) => {
            const isActive = selected?.vacID === vac.vacID

            return (
                <div
                key={vac.vacID}
                onClick={() => handleSelect(vac)}
                className={`p-5 rounded-xl border cursor-pointer transition-all duration-200
                ${isActive
                    ? 'border-blue-500 shadow-md bg-blue-50'
                    : 'border-gray-200 hover:shadow-sm hover:border-gray-300'
                }`}
                >
                {/* TOP */}
                <div className="flex justify-between items-start">
                    
                    {/* LEFT */}
                    <div>
                    <h3 className="font-semibold text-gray-800 text-base">
                        {vac.vacTitle}
                    </h3>

                    <p className="text-sm text-gray-500">
                        PT Example Company
                    </p>
                    </div>

                    {/* RIGHT LOGO */}
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                    Logo
                    </div>
                </div>

                {/* BADGE */}
                <div className="mt-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Baru untuk kamu
                    </span>
                </div>

                {/* INFO */}
                <div className="mt-3 text-sm text-gray-600 space-y-1">
                    <p>Full time</p>
                    <p>Batam, Indonesia</p>
                </div>

                {/* DATE */}
                <div className="mt-3 text-xs text-gray-400">
                    Close: {new Date(vac.DateClose).toLocaleDateString()}
                </div>
                </div>
            )
            })}
            {filtered.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                    Lowongan tidak ditemukan
                </div>
            )}
        </div>

      {/* RIGHT SIDE */}
      <div className="hidden md:flex flex-1 bg-white rounded shadow p-6 overflow-y-auto flex-col">

        {/* DESKTOP */}
        <div className="hidden md:block">
            {selected && <VacancyDetail data={selected} />}
        </div>

        {/* BUTTON DESKTOP */}
        <div className="sticky bottom-0 pt-4 mt-6 flex justify-end">
            <button
            onClick={handleApply}
            disabled={applied}
            className={`px-6 py-2 text-md rounded-lg shadow transition
                ${applied
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'}
            `}
            >
            {applied ? 'Already Applied' : 'Apply Now'}
            </button>
        </div>
      </div>
      {/* MOBILE MODAL */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden">

            {/* BACKDROP */}
            <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpenModal(false)}
            />

            {/* MODAL */}
            <div className="relative bg-white w-full h-[85%] rounded-t-2xl p-4 overflow-y-auto animate-slideUp">

            <div className="flex justify-between items-center mb-4">
                <h5 className="font-bold text-lg">Detail Vacancy</h5>
                <button onClick={() => setOpenModal(false)}>✕</button>
            </div>

            {selected && <VacancyDetail data={selected} />}

            {/* BUTTON MOBILE */}
            <div className="mt-6 flex justify-end">
                <button
                onClick={handleApply}
                disabled={applied}
                className={`px-6 py-2 text-md rounded-lg shadow transition
                    ${applied
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'}
                `}
                >
                {applied ? 'Already Applied' : 'Apply Now'}
                </button>
            </div>
            </div>
        </div>
        )}
    </div>
  )
}