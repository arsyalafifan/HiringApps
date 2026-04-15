'use client'

import ProfileSidebar from './ProfileSidebar'

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="bg-gray-50 min-h-screen pt-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <ProfileSidebar />
          </div>

          {/* Content */}
          <div className="lg:col-span-9">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfileLayout
