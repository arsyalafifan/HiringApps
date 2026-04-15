'use client'

import { Eye, Pencil, Trash2 } from 'lucide-react'

const educationData = [
  {
    school: 'UNIVERSITAS PI',
    date: '20 Sep 2020 - 20 Mar 2024',
    faculty: 'TEKNIK INFORMATIKA',
    level: 'Strata 1 (S1)',
  },
]

const SkillTable = () => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-primary">
          Skills
        </h2>
        <button className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition">
          + Tambah
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary text-white text-sm">
              <th className="text-left px-4 py-3">Company</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Position</th>
              <th className="text-left px-4 py-3">Salary</th>
              <th className="text-center px-4 py-3">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {educationData.map((item, i) => (
              <tr key={i} className="border-b text-sm">
                <td className="px-4 py-3">{item.school}</td>
                <td className="px-4 py-3">{item.date}</td>
                <td className="px-4 py-3">{item.faculty}</td>
                <td className="px-4 py-3">{item.level}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-3">
                    <ActionIcon>
                      <Eye size={16} />
                    </ActionIcon>
                    <ActionIcon>
                      <Pencil size={16} />
                    </ActionIcon>
                    <ActionIcon danger>
                      <Trash2 size={16} />
                    </ActionIcon>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const ActionIcon = ({
  children,
  danger,
}: {
  children: React.ReactNode
  danger?: boolean
}) => {
  return (
    <button
      className={`p-2 rounded-lg border hover:bg-gray-100 ${
        danger ? 'text-red-500' : 'text-gray-700'
      }`}
    >
      {children}
    </button>
  )
}

export default SkillTable
