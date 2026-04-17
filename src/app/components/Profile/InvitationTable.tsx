'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'
import Swal from 'sweetalert2'

type EventType = {
  id: number
  vacTitle: string
  inviteType: string
  eventDate: string
  jamStart: string
  jamEnd: string
  attendConfirmBool: boolean
  cekConfirmasi: string
  namaView: string
}

const InvitationTable = () => {
  const [events, setEvents] = useState<EventType[]>([])
  const [loading, setLoading] = useState(true)
  const [qrImage, setQrImage] = useState<string | null>(null)
const [openQR, setOpenQR] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token')

      const res = await fetch('http://localhost:8000/api/candidate/events', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (data.status) {
        setEvents(data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  /*
  =========================
  🔥 CONFIRM ATTENDANCE
  =========================
  */
  const handleConfirm = async (item: EventType, index: number) => {
    const confirm = await Swal.fire({
      title: "Konfirmasi Kehadiran?",
      text: "Apakah Anda yakin akan hadir?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal"
    })

    if (!confirm.isConfirmed) return

    try {
      const token = localStorage.getItem("token")
      console.log("TOKEN:", token)

      const res = await fetch("http://localhost:8000/api/candidate/confirm-attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: item.inviteType,
          id: item.id
        })
      })

      const data = await res.json()

      if (!res.ok || !data.status) {
        throw new Error(data.message)
      }

      // ✅ UPDATE UI TANPA REFRESH
      const updated = [...events]
      updated[index].attendConfirmBool = true
      updated[index].cekConfirmasi = "Confirmed"
      setEvents(updated)

      Swal.fire("Berhasil", "Kehadiran dikonfirmasi", "success")

    }catch (err: unknown) {
      if (err instanceof Error) {
        Swal.fire("Error", err.message, "error")
      } else {
        Swal.fire("Error", "Terjadi kesalahan", "error")
      }
    }
  }

  const handleViewQR = async (item: EventType) => {
    try {
      const token = localStorage.getItem("token")

      const res = await fetch("http://localhost:8000/api/candidate/generate-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: item.inviteType,
          id: item.id
        })
      })

      const data = await res.json()

      if (!res.ok || !data.status) {
        throw new Error(data.message)
      }

      setQrImage(data.qr)
      setOpenQR(true)

    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan"

      alert(message)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary">
          Tes / Interview / Medical
        </h2>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          
          {/* HEAD */}
          <thead>
            <tr className="bg-primary text-white text-sm">
              <th className="text-left px-4 py-3">Lowongan</th>
              <th className="text-left px-4 py-3">Tipe</th>
              <th className="text-left px-4 py-3">Tanggal</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-center px-4 py-3">Aksi</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              events.map((item, i) => (
                <tr key={i} className="border-b text-sm hover:bg-gray-50">
                  
                  {/* LOWONGAN */}
                  <td className="px-4 py-3 font-medium">
                    {item.vacTitle}
                  </td>

                  {/* TYPE */}
                  <td className="px-4 py-3">
                    {item.inviteType}
                  </td>

                  {/* DATE */}
                  <td className="px-4 py-3">
                    {new Date(item.eventDate).toLocaleDateString()}
                    <div className="text-xs text-gray-500">
                      {item.jamStart} - {item.jamEnd}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.attendConfirmBool
                          ? 'bg-green-100 text-green-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      {item.cekConfirmasi}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">

                      {/* CONFIRM */}
                      {!item.attendConfirmBool && (
                        <button
                          onClick={() => handleConfirm(item, i)}
                          className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Confirm
                        </button>
                      )}

                      {/* VIEW QR */}
                      <button
                        onClick={() => handleViewQR(item)}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                      >
                        <Eye size={14} />
                        QR
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
        {openQR && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl text-center">
              
              <h3 className="mb-4 font-semibold">QR Attendance</h3>

              {qrImage && (
                <img
                  src={
                    qrImage?.startsWith("data:image")
                      ? qrImage
                      : `data:image/png;base64,${qrImage}`
                  }
                />
              )}

              <button
                onClick={() => setOpenQR(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Close
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InvitationTable