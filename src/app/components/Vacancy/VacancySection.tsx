'use client'

const VacancySection = ({ title, items }: { title: string; items: string }) => {
  const splitText = (text: string) =>
    text?.split(/\r?\n|\|/).filter(x => x.trim() !== '')

  return (
    <div className="mt-8">
      
      {/* TITLE */}
      <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-md text-sm font-medium shadow">
        {title}
      </div>

      {/* CONTENT */}
      <ul className="mt-4 space-y-2 pl-5 list-disc text-gray-700">
        {splitText(items).map((item, i) => (
          <li key={i} className="leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default VacancySection