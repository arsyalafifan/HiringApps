'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaMapMarkerAlt, FaBriefcase, FaClock } from 'react-icons/fa'

type Vacancy = {
  vacID: number
  vacTitle: string
  vacJobDesc: string
  DatePublish: string
  DateClose: string
}

const JobOpportunity = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [filtered, setFiltered] = useState<Vacancy[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVacancies()
  }, [])

  const fetchVacancies = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/vacancy')
      const data = await res.json()

      if (data.status) {
        setVacancies(data.data)
        setFiltered(data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 🔍 SEARCH FILTER
  useEffect(() => {
    const keyword = search.toLowerCase()

    const result = vacancies.filter((v) =>
      v.vacTitle.toLowerCase().includes(keyword) ||
      v.vacJobDesc.toLowerCase().includes(keyword)
    )

    setFiltered(result)
  }, [search, vacancies])

  return (
    <section className="bg-secondary dark:bg-darklight py-16">
      <div className="container">

        {/* TITLE */}
        <div className='mb-4'>
            <h2 className='text-center'>Job Opportunity</h2>
          </div>
          <div className='md:max-w-45 mx-auto mb-8'>
            <p className='text-xl font-normal text-center leading-8'>
              Temukan peluang karir terbaik sesuai dengan keahlianmu
            </p>
        </div>

        {/* SEARCH */}
        <div className="mb-10 flex justify-center">
          <input
            type="text"
            placeholder="Cari pekerjaan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 px-5 py-3 rounded-lg border focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        {/* LIST */}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500">
            Lowongan tidak ditemukan
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">

            {filtered.map((vac) => (
              <div
                key={vac.vacID}
                className="bg-white dark:bg-darkmode rounded-xl p-5 shadow-sm hover:shadow-md transition border border-gray-100 cursor-pointer"
                >
                {/* HEADER */}
                <div className="flex items-start justify-between mb-3">
                    
                    <div className="flex gap-3">
                    {/* LOGO (dummy dulu) */}
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                        Logo
                    </div>

                    <div>
                        <h4 className="font-semibold text-base leading-tight">
                        {vac.vacTitle}
                        </h4>
                        <p className="text-sm text-gray-500">
                        PT Example Company
                        </p>
                    </div>
                    </div>

                    {/* FAVORITE ICON */}
                    <span className="text-gray-300 text-xl">♡</span>
                </div>

                {/* JOB DESC (1 LINE) */}
                <p className="text-sm text-gray-500 line-clamp-1 mb-3">
                    {vac.vacJobDesc}
                </p>

                {/* INFO */}
                <div className="flex flex-col gap-2 text-sm text-gray-500">

                    {/* LOCATION */}
                    <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>Batam, Indonesia</span>
                    </div>

                    {/* JOB TYPE */}
                    <div className="flex items-center gap-2">
                    <FaBriefcase className='text-gray-400' />
                    <span>Full Time</span>
                    </div>

                    {/* POST DATE */}
                    <div className="flex items-center gap-2">
                    <FaClock className='text-gray-400' />
                    <span>
                        Posted {new Date(vac.DatePublish).toLocaleDateString()}
                    </span>
                    </div>

                    {/* CLOSE DATE */}
                    <div className="flex items-center gap-2">
                    <FaClock className='text-red-400' />
                    <span className="text-red-500">
                        Close {new Date(vac.DateClose).toLocaleDateString()}
                    </span>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="mt-4 flex items-center justify-between">

                    {/* BADGE */}
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                    Baru
                    </span>

                    {/* BUTTON */}
                    <Link href="/vacancy">
                        <button className="text-sm text-primary font-medium hover:underline">
                        Detail →
                        </button>
                    </Link>
                </div>
                </div>
            ))}

          </div>
        )}
      </div>
    </section>
  )
}

export default JobOpportunity