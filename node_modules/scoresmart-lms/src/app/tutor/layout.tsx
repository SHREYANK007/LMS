import Sidebar from '@/components/common/Sidebar'

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex bg-slate-50">
      <Sidebar role="tutor" />
      <main className="flex-1 h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  )
}