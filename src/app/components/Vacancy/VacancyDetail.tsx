'use client'

import VacancySection from "./VacancySection"

type VacancyData = {
  vacTitle: string
  DatePublish: string
  DateClose: string
  vacNote: string
  vacJobDesc: string
}

const VacancyDetail = ({ data }: { data: VacancyData }) => {

  return (
    <div className="max-w-3xl">

      {/* TITLE */}
      <h1 className="text-2xl font-bold text-gray-800">
        {data.vacTitle}
      </h1>

      {/* META */}
      <div className="mt-2 text-sm text-gray-500">
        Posted: {new Date(data.DatePublish).toDateString()}
      </div>

      <div className="text-sm text-red-500 font-medium mt-1">
        Date Close: {new Date(data.DateClose).toDateString()}
      </div>

      {/* QUALIFICATION */}
      <VacancySection
        title="Qualification"
        items={data.vacNote}
      />

      {/* JOB DESC */}
      <VacancySection
        title="Job Description"
        items={data.vacJobDesc}
      />

    </div>
  )
}

export default VacancyDetail